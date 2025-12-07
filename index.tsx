
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

import { theme, styles } from './theme';
import { LANGUAGES, TRANSLATIONS } from './translations';
import { calculateAge, calculateWuXing, getWesternZodiac } from './utils';
import { UserState, Plan, CartItem, Product, HistoryRecord, Order } from './types';
import { BaguaSVG } from './components/Icons';
import { PaymentModal, ProductDetailModal, FiveElementsBalanceModal } from './components/Modals';
import { PrivacyPolicy, TermsOfService, AboutPage } from './pages/StaticPages';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage'; 
import { AdminPage } from './pages/AdminPage'; // Import AdminPage
import { PricingPage } from './pages/PricingPage';
import { RenderStartView, RenderSelectionView, RenderCameraView, RenderResultView, LoadingSpinner, RenderHistoryView } from './pages/HomeViews';

const API_KEY = process.env.API_KEY;
// Using gemini-2.5-flash as per guidelines.
const MODEL_NAME = 'gemini-2.5-flash'; 

// Music
const AMBIENT_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/02/07/audio_1919830500.mp3";

// --- AI SERVICE ABSTRACTION ---
async function callUniversalAI(
    provider: 'Google', 
    params: { model: string, prompt: string, base64Image?: string, apiKey: string }
) {
    // Always use Google (Gemini)
    const ai = new GoogleGenAI({ apiKey: params.apiKey });
    
    // Safety Settings: Critical for Face Reading apps to avoid false positives on 'Medical' or 'Harassment'
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE }
    ];

    return await ai.models.generateContent({
        model: params.model,
        contents: {
            parts: [
                params.base64Image ? { inlineData: { mimeType: 'image/jpeg', data: params.base64Image } } : null,
                { text: params.prompt }
            ].filter(Boolean) as any
        },
        config: {
            safetySettings: safetySettings
        }
    });
}

// Helper for Retry with Error Parsing
const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 4000, onRetry?: (msg: string) => void): Promise<any> => {
    try {
        return await fn();
    } catch (err: any) {
        // Deep parse the error object for status codes or specific messages
        const errorObj = err.error || err;
        
        // Extract status/code. Handle both number (429) and string ("RESOURCE_EXHAUSTED")
        const code = errorObj?.code;
        const status = errorObj?.status;
        const message = errorObj?.message || JSON.stringify(errorObj);
        
        // Parse "retry in X seconds" if available
        let waitTime = delay;
        const retryMatch = message.match(/retry in ([0-9.]+)s/);
        if (retryMatch) {
            waitTime = Math.ceil(parseFloat(retryMatch[1])) * 1000 + 2000; // Add 2s buffer
        }

        // Abort if wait time is absurdly long (> 150 seconds)
        if (waitTime > 150000) {
            console.warn(`Retry time ${waitTime}ms too long. Aborting.`);
            throw err;
        }

        // Check for 429 / Resource Exhausted / 5xx Server Errors
        const isRateLimit = 
            code === 429 || 
            status === 429 ||
            status === 'RESOURCE_EXHAUSTED' || 
            message.includes('429') || 
            message.includes('RESOURCE_EXHAUSTED') ||
            message.includes('quota');
            
        const isServerError = (typeof code === 'number' && code >= 500) || (typeof status === 'number' && status >= 500);

        if (retries > 0 && (isRateLimit || isServerError)) {
             const seconds = Math.ceil(waitTime / 1000);
             console.warn(`API Error (${status || code}). Retrying in ${waitTime}ms... (Retries left: ${retries})`);
             
             if (onRetry) {
                 onRetry(`High traffic. Retrying in ${seconds}s...`);
             }
             
             await new Promise(resolve => setTimeout(resolve, waitTime));
             
             // If we had a specific wait time from the API, stick closer to it for the next loop rather than exploding exponentially
             const nextDelay = retryMatch ? waitTime : waitTime * 1.5;
             
             return callWithRetry(fn, retries - 1, nextDelay, onRetry); 
        }
        throw err;
    }
};

// Client-side Image Resizing Helper to speed up upload/inference
const resizeImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Reduced to 70% quality for faster upload
    };
    img.onerror = () => resolve(base64Str);
  });
};

const App = () => {
  // Determine if we are in Admin Mode based on URL hash
  const [isAdminMode, setIsAdminMode] = useState(window.location.hash === '#admin');

  // Listen for hash changes to toggle admin mode dynamically
  useEffect(() => {
    const handleHashChange = () => {
        setIsAdminMode(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [currentPage, setCurrentPage] = useState<'home' | 'pricing' | 'shop' | 'product-detail' | 'about' | 'privacy' | 'terms' | 'history' | 'cart'>('home');
  
  // Detect Language & Region
  const detectLanguage = () => {
     try {
         const browserLang = navigator.language.split('-')[0];
         const supportedCodes = LANGUAGES.map(l => l.code);
         if (supportedCodes.includes(navigator.language)) return navigator.language;
         if (supportedCodes.includes(browserLang)) return browserLang;
         if (navigator.language === 'zh-HK') return 'zh-TW';
         if (browserLang === 'zh') return 'zh-CN';
         return 'en';
     } catch (e) { return 'en'; }
  };

  const [language, setLanguage] = useState(detectLanguage());
  
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [userState, setUserState] = useState<UserState>({ trialStartDate: null, isSubscribed: false, hasPaidSingle: false, history: [] });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState<'start' | 'selection' | 'camera' | 'analyzing' | 'result'>('start');
  const [image, setImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAiAdvice, setBalanceAiAdvice] = useState<string | undefined>(undefined); // New state for AI Advice passed to Modal
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | Product | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [calculatedElements, setCalculatedElements] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState<string>(""); // Custom loading message state
  const [birthDate, setBirthDate] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobHour, setDobHour] = useState('12');
  const [dobMinute, setDobMinute] = useState('00');
  const [dobSecond, setDobSecond] = useState('00');
  const [gender, setGender] = useState('male');
  const [userName, setUserName] = useState(''); // New state for Name input
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => { const saved = localStorage.getItem('fortune_user_state_v3'); if (saved) setUserState(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem('fortune_user_state_v3', JSON.stringify(userState)); }, [userState]);
  useEffect(() => {
    if (!audioRef.current) { 
        audioRef.current = new Audio(AMBIENT_MUSIC_URL); 
        audioRef.current.loop = true; 
        audioRef.current.volume = 0.3; 
        audioRef.current.onerror = (e) => console.warn("Audio Error:", e);
    }
    if (isPlayingMusic) {
        audioRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));
    } else {
        audioRef.current.pause();
    }
  }, [isPlayingMusic]);
  useEffect(() => { if (dobYear && dobMonth && dobDay) { const m = dobMonth.padStart(2, '0'); const d = dobDay.padStart(2, '0'); setBirthDate(`${dobYear}-${m}-${d}`); } else { setBirthDate(''); } }, [dobYear, dobMonth, dobDay]);
  
  // Scroll to top when changing pages
  useEffect(() => {
      window.scrollTo(0, 0);
  }, [currentPage, selectedProduct]);

  const getDaysRemaining = () => {
      if (!userState.trialStartDate) return 3; 
      const start = new Date(userState.trialStartDate);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.ceil(3 - diffDays));
  };

  const switchLanguage = async (newLang: string) => {
      setLanguage(newLang);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      if (view === 'result' && resultText) {
          setIsTranslating(true);
          try {
              if (!API_KEY) throw new Error("API Key missing");
              // Use Google for quick translation
              const response = await callUniversalAI('Google', {
                  model: MODEL_NAME,
                  apiKey: API_KEY,
                  prompt: `Translate markdown to ${newLang}. Preserve format. Text:\n\n${resultText}`
              });
              
              if (response.text) {
                  setResultText(response.text);
              }
          } catch (e: any) {
              console.error("Translation failed", e);
              // Handle quota error specifically for UI feedback
              if (e?.status === 429 || e?.message?.includes('429') || e?.message?.includes('RESOURCE_EXHAUSTED')) {
                  alert("Translation unavailable due to high system traffic. Showing original text.");
              }
          } finally {
              setIsTranslating(false);
          }
      }
  };

  const startCamera = async () => {
    if (!birthDate) { alert("Please complete your birth date."); return; }
    setView('camera'); 
    if (!isPlayingMusic) setIsPlayingMusic(true);
    try { 
        const stream = await navigator.mediaDevices.getUserMedia({ video: true }); 
        if (videoRef.current) { 
            videoRef.current.srcObject = stream; 
            videoRef.current.play().catch(e => console.error("Video play error:", e)); 
        } 
    } catch (err) { 
        console.error(err);
        alert("Unable to access camera. Please allow permissions."); 
        setView('selection'); 
    }
  };
  const stopCamera = () => { if (videoRef.current && videoRef.current.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop()); videoRef.current.srcObject = null; } };
  
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current; const canvas = canvasRef.current; 
      // Set to 1024 to resize capture
      canvas.width = 1024; 
      canvas.height = (video.videoHeight / video.videoWidth) * 1024;
      
      const ctx = canvas.getContext('2d'); if (ctx) { 
          ctx.translate(canvas.width, 0); 
          ctx.scale(-1, 1); 
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality 
          setImage(dataUrl); 
          stopCamera(); 
          processImage(dataUrl); 
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!birthDate) { alert("Please complete your birth date."); e.target.value = ''; return; }
    if (!isPlayingMusic) setIsPlayingMusic(true);
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0); 
      const reader = new FileReader(); 
      let progress = 0;
      const interval = setInterval(() => { 
          progress += 10; // Faster simulation
          setUploadProgress(Math.min(progress, 99)); 
      }, 30);
      reader.onloadend = async () => { 
          clearInterval(interval); 
          setUploadProgress(100); 
          let dataUrl = reader.result as string; 
          
          // RESIZE IMAGE BEFORE PROCESSING
          dataUrl = await resizeImage(dataUrl);

          setTimeout(() => { 
              setImage(dataUrl); 
              setUploadProgress(0); 
              processImage(dataUrl); 
          }, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string) => {
    const now = new Date();
    // 3-Day Free Trial Logic
    if (!userState.isSubscribed && !userState.hasPaidSingle) {
        if (!userState.trialStartDate) {
            setUserState(prev => ({ ...prev, trialStartDate: now.toISOString() }));
        } else {
            const start = new Date(userState.trialStartDate);
            const diffMs = now.getTime() - start.getTime();
            const daysPassed = diffMs / (1000 * 60 * 60 * 24);
            if (daysPassed > 3) { setShowPaywall(true); setView('start'); return; }
        }
    }
    if (userState.hasPaidSingle) { setUserState(prev => ({ ...prev, hasPaidSingle: false })); }

    const wuXingResult = calculateWuXing(dobYear, dobMonth, dobDay, dobHour, dobMinute, dobSecond);
    const starSign = getWesternZodiac(birthDate);
    setCalculatedElements(wuXingResult);
    const currentDateStr = now.toLocaleDateString();
    
    setView('analyzing');
    setLoadingMessage(""); // Reset message
    setAnalysisProgress(0);
    const progressInterval = setInterval(() => {
        // Faster Analysis Simulation
        setAnalysisProgress(prev => Math.min(prev + (prev < 60 ? 8 : prev < 85 ? 4 : 1), 95));
    }, 200);

    try {
      // Clean base64 string
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      const langConfig = LANGUAGES.find(l => l.code === language);
      const targetLangName = langConfig?.label || 'English';
      const age = calculateAge(birthDate);
      
      const headers = {
          aura: t.reportHeaderAura || "General Aura",
          elements: t.reportHeaderElements || "Five Elements (Wu Xing)",
          name: t.reportHeaderName || "Name Analysis",
          star: t.reportHeaderStar || "Western Zodiac Analysis",
          fortune: t.reportHeaderFortune || "Temporal Fortune",
          wealth: t.reportHeaderWealth || "Wealth & Fortune",
          family: t.reportHeaderFamily || "Family & Relationships",
          parents: t.reportHeaderParents || "Parents & Ancestors",
          advice: t.reportHeaderAdvice || "Master's Advice"
      };

      // Construct Prompt
      let prompt = `
        You are a grandmaster of traditional Chinese physiognomy (Mianxiang) and Bazi Astrology.
        The user is ${gender}, born on ${birthDate} at ${dobHour}:${dobMinute}:${dobSecond}. (Age: ${age}).
        **Current Date/Time of Reading:** ${currentDateStr}
        Calculated Birth Five Elements (Wu Xing) Strength: Metal: ${wuXingResult.scores.Metal}%, Wood: ${wuXingResult.scores.Wood}%, Water: ${wuXingResult.scores.Water}%, Fire: ${wuXingResult.scores.Fire}%, Earth: ${wuXingResult.scores.Earth}%.
        Weakest Element in Birth Chart: ${wuXingResult.missingElement}.
        Western Zodiac Sign: ${starSign}.
      `;

      if (userName) {
          prompt += `\n**User Name:** "${userName}". Analyze if this name balances their missing element (${wuXingResult.missingElement}). If Chinese characters, analyze the radicals. If other language, analyze the sound.`;
      }

      prompt += `
        Analyze this person's face with a respectful, ancient, and insightful tone.
        **CRITICAL TASK**: Compare their Birth Date (Bazi) against the Current Date (${currentDateStr}). Determine if there are any clashes or harmonies today and for this current month.
        
        Structure your response EXACTLY as follows in Markdown (Use the EXACT translated headers provided):
        ## 🔮 ${headers.aura}
        [Analysis here]
        ## ⚖️ ${headers.elements}
        *   🪙 **${t.elementMetal}:** [Analysis]
        *   🌲 **${t.elementWood}:** [Analysis]
        *   💧 **${t.elementWater}:** [Analysis]
        *   🔥 **${t.elementFire}:** [Analysis]
        *   ⛰️ **${t.elementEarth}:** [Analysis]
        ## 🌌 ${headers.star}
        [Analyze their Western Zodiac sign (${starSign}). Discuss personality traits and current cosmic planetary influences.]
      `;
      
      if (userName) {
          prompt += `
        ## ✍️ ${headers.name}
        [Analyze the name "${userName}" in relation to their Five Elements. Does it help balance the missing ${wuXingResult.missingElement}? Suggest improvements if needed.]
          `;
      }

      prompt += `
        ## 📅 ${headers.fortune} (Date: ${currentDateStr})
        *   **Today's Luck:** [Analyze today's luck based on birth/current date clash/harmony]
        *   **Monthly Forecast:** [Analyze this month's luck]
        ## 💰 ${headers.wealth}
        [Analysis here]
        ## 🏠 ${headers.family}
        [Analysis here]
        ## 👴 ${headers.parents}
        [Analysis here]
        ## 📜 ${headers.advice}
        [Provide specific practical advice here on how they can improve their ${wuXingResult.missingElement} energy. Suggest specific colors to wear, types of jewelry (e.g. gold, wood, crystal), and lifestyle habits. Be very specific. Use double line breaks between paragraphs for clarity.]
        
        IMPORTANT: Output the response DIRECTLY in ${targetLangName}. 
        ENSURE "Five Elements" header is EXACTLY: ## ⚖️ ${headers.elements}
        Ensure the emojis (🪙, 🌲, 💧, 🔥, ⛰️) are used at the start of each Five Elements line.
      `;
      
      // FORCE GOOGLE GEMINI
      let provider: 'Google' = 'Google';
      let model = MODEL_NAME;
      let apiKey = API_KEY;

      // Execute Call
      if (!apiKey) throw new Error("No API Key available.");

      // Increased retries to 5 to tolerate long waits
      const apiCall = callWithRetry(() => callUniversalAI(provider, {
          model,
          prompt,
          base64Image: base64Data,
          apiKey
      }), 5, 4000, (retryMsg) => {
          setLoadingMessage(retryMsg);
      });

      // No Timeout Limit for Analysis (User Requested)
      const response: any = await apiCall;
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setLoadingMessage("");
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newResultText = response.text || "Destiny is unclear. Please try again.";
      setResultText(newResultText);
      
      // Save to History (Max 5)
      const newHistoryItem: HistoryRecord = {
          id: Date.now(),
          date: now.toLocaleDateString(),
          resultText: newResultText,
          elements: wuXingResult,
          name: userName,
          gender: gender,
          birthDate: birthDate
      };
      setUserState(prev => {
          const updatedHistory = [newHistoryItem, ...(prev.history || [])].slice(0, 5);
          return { ...prev, history: updatedHistory };
      });
      
      setView('result');
    } catch (error: any) { 
        clearInterval(progressInterval);
        setAnalysisProgress(0);
        setLoadingMessage("");
        console.error(error); 
        let msg = "Analysis failed. Please try again.";
        const errObj = error?.error || error;
        const errMsg = errObj?.message || JSON.stringify(errObj);
        
        // Extract wait time if present in final error
        const retryMatch = errMsg.match(/retry in ([0-9.]+)s/);
        
        if (errObj?.status === 'RESOURCE_EXHAUSTED' || errObj?.code === 429 || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) { 
            msg = "High System Traffic.";
            if (retryMatch) {
                msg += ` Please wait ${Math.ceil(parseFloat(retryMatch[1]))} seconds before trying again.`;
            } else {
                msg += " Please try again in a minute.";
            }
        } else if (error instanceof Error) { 
            msg = `Analysis failed: ${error.message}`; 
        }
        alert(msg);
        setView('selection');
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    if (!resultText) return;
    const utterance = new SpeechSynthesisUtterance(resultText.replace(/[#*]/g, ''));
    const langConfig = LANGUAGES.find(l => l.code === language);
    utterance.lang = langConfig?.voiceCode || 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === utterance.lang && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david')));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9; utterance.pitch = 0.8; utterance.onend = () => setIsSpeaking(false); speechRef.current = utterance; window.speechSynthesis.speak(utterance); setIsSpeaking(true);
  };
  
  const handleLoadHistory = (record: HistoryRecord) => {
      setResultText(record.resultText);
      setCalculatedElements(record.elements);
      setBirthDate(record.birthDate);
      setGender(record.gender);
      setUserName(record.name);
      setView('result');
      setCurrentPage('home');
  };

  const handleOpenBalance = (aiAdvice?: string) => {
      // Gatekeeping: Check 3-day trial or payment
      const daysRemaining = getDaysRemaining();
      if (daysRemaining > 0 || userState.isSubscribed) { 
          setBalanceAiAdvice(aiAdvice); // Store the passed AI advice
          setShowBalanceModal(true); 
      } else { 
          setShowPaywall(true); 
      }
  };

  const handleAddToCart = (product: Product) => { setCart(prev => { const existing = prev.find(item => item.product.id === product.id); if (existing) { return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item); } return [...prev, { product, quantity: 1 }]; }); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  const handleRemoveFromCart = (productId: string) => { setCart(prev => prev.filter(item => item.product.id !== productId)); };
  
  const handleCartCheckout = (total: number) => {
      // Create a dummy plan for checkout
      const cartPlan: any = {
          id: 'cart_checkout',
          title: 'Cart Checkout',
          price: `$${total.toFixed(2)}`,
          desc: 'Items from Spiritual Shop',
          isSub: false,
          category: 'cart_mixed' // Treat as physical product for shipping address requirement
      };
      setSelectedPlan(cartPlan);
      setShowPaymentModal(true);
  };

  const handleBuyProduct = (product: Product) => { setShowBalanceModal(false); setSelectedProduct(null); setSelectedPlan(product); setShowPaymentModal(true); };
  
  // New handler for clicking a product in the shop
  const handleViewProduct = (product: Product) => {
      setSelectedProduct(product);
      setCurrentPage('product-detail');
      setView('start'); // Reset internal home states if necessary
  };

  const handlePaymentSuccess = (paymentDetails?: any) => { 
      if (!selectedPlan) return; 
      
      // Save Order to "Mock Server" (localStorage)
      const saveOrderToServer = () => {
          const storedOrders = localStorage.getItem('mystic_all_orders');
          const allOrders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
          
          let orderItems = "";
          let total = 0;
          
          if (selectedPlan.id === 'cart_checkout') {
              orderItems = cart.map(c => `${c.product.defaultName} x${c.quantity}`).join(', ');
              total = cart.reduce((acc, c) => acc + (c.product.numericPrice * c.quantity), 0);
          } else {
              orderItems = 'defaultName' in selectedPlan ? (selectedPlan as Product).defaultName : (selectedPlan as Plan).title;
              total = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ''));
          }

          const shipping = paymentDetails?.shipping || {};
          const contact = paymentDetails?.contact || {};
          
          const fullAddress = shipping.address 
            ? `${shipping.address}, ${shipping.city} ${shipping.zip}, ${shipping.country}`
            : 'Digital Delivery';
          const customerName = shipping.name || 'Guest User';

          const newOrder: Order = {
              id: `ORD-${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString(),
              customerName: customerName,
              items: orderItems,
              total: total,
              status: 'paid',
              shippingAddress: fullAddress,
              paymentMethod: paymentDetails?.method || 'unknown',
              email: contact.email,
              phone: contact.phone
          };
          
          allOrders.unshift(newOrder); // Add to top
          localStorage.setItem('mystic_all_orders', JSON.stringify(allOrders));
      };
      
      saveOrderToServer();

      if (selectedPlan.id === 'cart_checkout') {
          // Clear Cart on successful checkout
          setCart([]);
          setCurrentPage('home');
          setView('start');
      } else if ('isSub' in selectedPlan) { 
          if (selectedPlan.id === 'single') setUserState(prev => ({ ...prev, hasPaidSingle: true })); 
          else setUserState(prev => ({ ...prev, isSubscribed: true })); 
      }
      
      alert(t.success); 
      setShowPaymentModal(false); 
      if (currentPage === 'pricing') handleGoHome(); 
  };
  
  const handleGoHome = () => { stopCamera(); window.speechSynthesis.cancel(); setIsSpeaking(false); setShowPaywall(false); setShowBalanceModal(false); setShowPaymentModal(false); setSelectedProduct(null); setCurrentPage('home'); setView('start'); setUploadProgress(0); setAnalysisProgress(0); };
  const getNavLinkStyle = (page: string) => ({ ...styles.navLink, color: currentPage === page ? theme.gold : theme.text, borderBottom: currentPage === page ? `2px solid ${theme.gold}` : 'none' });

  const triggerPayment = (plan: Plan) => { setSelectedPlan(plan); setShowPaymentModal(true); };

  // --- ADMIN VIEW ---
  if (isAdminMode) {
      return (
          <div style={styles.appContainer}>
               <div style={{padding: '20px', textAlign: 'center', borderBottom: `1px solid ${theme.darkGold}`}}>
                    <h1 style={{color: theme.gold, fontFamily: 'Cinzel, serif'}}>Mystic Face Admin</h1>
               </div>
               <div style={styles.heroSection}>
                    <AdminPage t={t} />
               </div>
          </div>
      );
  }

  // --- MAIN APP VIEW ---
  return (
    <div style={styles.appContainer}>
      <nav style={styles.navbar}>
        <div className="nav-container">
          <div style={styles.logo} onClick={handleGoHome}>
            <div style={{width: '30px', height: '30px'}}>{BaguaSVG}</div>
            {t.title}
          </div>
          <div className="nav-links">
             <span style={getNavLinkStyle('home')} onClick={handleGoHome}>{t.home}</span>
             <span style={getNavLinkStyle('pricing')} onClick={() => { setCurrentPage('pricing'); setView('start'); }}>{t.pricing}</span>
             <span style={getNavLinkStyle('shop')} onClick={() => { setCurrentPage('shop'); setView('start'); }}>{t.shop}</span>
             <span style={getNavLinkStyle('about')} onClick={() => { setCurrentPage('about'); setView('start'); }}>{t.about}</span>
             
             {/* History Link */}
             <span style={getNavLinkStyle('history')} onClick={() => { setCurrentPage('history'); setView('start'); }}>
                 <i className="fas fa-history" style={{marginRight: '5px'}}></i>{t.history}
             </span>

             <div style={{position: 'relative', cursor: 'pointer', marginLeft: '10px', marginRight: '15px'}} onClick={() => { setCurrentPage('cart'); setView('start'); }}>
                 <i className="fas fa-shopping-cart" style={{color: currentPage === 'cart' ? theme.gold : theme.gold}}></i>
                 {cart.length > 0 && <span style={{position: 'absolute', top: '-8px', right: '-8px', background: '#c0392b', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cart.reduce((a,c) => a + c.quantity, 0)}</span>}
             </div>
             <select style={{background: 'transparent', color: '#ccc', border: '1px solid #555', borderRadius: '4px', padding: '2px', marginLeft: '10px'}} value={language} onChange={(e) => switchLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
             </select>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        {showToast && <div style={{position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', background: '#2ecc71', color: '#fff', padding: '15px 30px', borderRadius: '30px', zIndex: 3005, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'}} className="fade-in"><i className="fas fa-check-circle"></i> {t.addToCart} - Success</div>}
        
        {showPaywall && <PaymentModal t={t} plan={{id: 'single', title: t.planSingle, price: t.planSinglePrice, desc: t.planSingleDesc, isSub: false}} onClose={() => setShowPaywall(false)} onSuccess={(d) => { handlePaymentSuccess(d); if (view === 'start') setView('selection'); }} />}
        {showPaymentModal && selectedPlan && <PaymentModal t={t} plan={selectedPlan} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />}
        {showBalanceModal && calculatedElements && <FiveElementsBalanceModal t={t} missingElement={calculatedElements.missingElement} aiAdvice={balanceAiAdvice} onClose={() => setShowBalanceModal(false)} onBuyProduct={handleBuyProduct} />}
        
        {/* Render ProductDetailModal as a standalone page section if currentPage is 'product-detail' */}
        {currentPage === 'product-detail' && selectedProduct && (
            <div style={{...styles.heroSection, justifyContent: 'flex-start', paddingTop: '100px'}}>
                <ProductDetailModal 
                    key={selectedProduct.id} // Forces fresh mount when switching products (regenerate page)
                    isPageMode={true} 
                    t={t} 
                    product={selectedProduct} 
                    onClose={() => setCurrentPage('shop')} // Close returns to shop
                    onAddToCart={() => handleAddToCart(selectedProduct)} 
                    onBuyNow={() => handleBuyProduct(selectedProduct)} 
                    onSwitchProduct={(p) => setSelectedProduct(p)} 
                />
            </div>
        )}

        {currentPage === 'home' && (
             <div style={styles.heroSection}>
                {view === 'start' && <RenderStartView t={t} freeTrials={getDaysRemaining()} onStart={() => setView('selection')} />}
                {view === 'selection' && <RenderSelectionView 
                    t={t} 
                    gender={gender} dobYear={dobYear} dobMonth={dobMonth} dobDay={dobDay} dobHour={dobHour} dobMinute={dobMinute} dobSecond={dobSecond}
                    uploadProgress={uploadProgress}
                    userName={userName} onSetUserName={setUserName} 
                    onSetGender={setGender} onSetDobYear={setDobYear} onSetDobMonth={setDobMonth} onSetDobDay={setDobDay} onSetDobHour={setDobHour} onSetDobMinute={setDobMinute} onSetDobSecond={setDobSecond}
                    onStartCamera={startCamera} onUpload={handleFileUpload} onBack={() => setView('start')}
                    language={language}
                />}
                {view === 'camera' && <RenderCameraView t={t} videoRef={videoRef} canvasRef={canvasRef} onStopCamera={() => { stopCamera(); setView('selection'); }} onCapture={capturePhoto} />}
                {view === 'analyzing' && <LoadingSpinner t={t} progress={analysisProgress} message={loadingMessage} />}
                {view === 'result' && <RenderResultView 
                    t={t} birthDate={birthDate} gender={gender} calculatedElements={calculatedElements} resultText={resultText} 
                    language={language} isSpeaking={isSpeaking} isTranslating={isTranslating} LANGUAGES={LANGUAGES}
                    onLanguageChange={(e: any) => switchLanguage(e.target.value)}
                    onToggleSpeech={toggleSpeech} onAnalyzeAnother={() => { setView('selection'); setImage(null); setResultText(""); }}
                    onBuyProduct={handleBuyProduct} onOpenBalance={handleOpenBalance}
                />}
                {view === 'start' && (
                    <div style={{marginTop: '4rem', maxWidth: '1000px', width: '100%'}} className="desktop-only">
                       <h2 style={{color: theme.gold, marginBottom: '2rem'}}>{t.howItWorks}</h2>
                       <div className="feature-grid">
                          <div style={{flex: 1, minWidth: '200px'}}>
                              <i className="fas fa-camera" style={{fontSize: '2rem', color: theme.darkGold, marginBottom: '1rem'}}></i>
                              <h3>{t.step1Title}</h3>
                              <p style={{color: '#aaa'}}>{t.step1Desc}</p>
                          </div>
                          <div style={{flex: 1, minWidth: '200px'}}>
                              <i className="fas fa-brain" style={{fontSize: '2rem', color: theme.darkGold, marginBottom: '1rem'}}></i>
                              <h3>{t.step2Title}</h3>
                              <p style={{color: '#aaa'}}>{t.step2Desc}</p>
                          </div>
                          <div style={{flex: 1, minWidth: '200px'}}>
                              <i className="fas fa-scroll" style={{fontSize: '2rem', color: theme.darkGold, marginBottom: '1rem'}}></i>
                              <h3>{t.step3Title}</h3>
                              <p style={{color: '#aaa'}}>{t.step3Desc}</p>
                          </div>
                       </div>
                    </div>
                )}
             </div>
        )}
        {currentPage === 'pricing' && <div style={styles.heroSection}><PricingPage t={t} onSelectPlan={triggerPayment} /></div>}
        {currentPage === 'shop' && <div style={styles.heroSection}><ShopPage t={t} onViewProduct={handleViewProduct} /></div>}
        {currentPage === 'cart' && <div style={styles.heroSection}><CartPage t={t} cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCartCheckout} /></div>}
        {/* AdminPage removed from main flow */}
        {currentPage === 'about' && <div style={styles.heroSection}><AboutPage t={t} /></div>}
        {currentPage === 'privacy' && <div style={styles.heroSection}><PrivacyPolicy t={t} /></div>}
        {currentPage === 'terms' && <div style={styles.heroSection}><TermsOfService t={t} /></div>}
        {currentPage === 'history' && <div style={styles.heroSection}><RenderHistoryView t={t} history={userState.history} onViewResult={handleLoadHistory} /></div>}
      </div>
      <footer style={styles.footer}>
        <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '20px'}}>
            <span style={{cursor: 'pointer', color: theme.gold}} onClick={() => {setCurrentPage('privacy'); setView('start');}}>{t.privacy}</span>
            <span style={{cursor: 'pointer', color: theme.gold}} onClick={() => {setCurrentPage('terms'); setView('start');}}>{t.terms}</span>
        </div>
        <div>&copy; {new Date().getFullYear()} {t.title}. {t.footerRight}</div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
