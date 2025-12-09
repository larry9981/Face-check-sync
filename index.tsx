
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// RESTORED: Needed for Client-Side Fallback if Server is offline
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
import { AdminPage } from './pages/AdminPage';
import { PricingPage } from './pages/PricingPage';
import { RenderStartView, RenderSelectionView, RenderCameraView, RenderResultView, LoadingSpinner, RenderHistoryView } from './pages/HomeViews';

// =========================================================
// 🌐 FRONTEND CONFIGURATION
// =========================================================

// Point this to your backend server URL
const API_BASE_URL = "http://localhost:3000/api"; 

// --- AI PROVIDER CONFIGURATION (CLIENT SIDE FALLBACK) ---
// If you want to use DeepSeek/OpenAI directly in browser when server is down
// fill these in. Otherwise, it defaults to Google via process.env.API_KEY
let CURRENT_PROVIDER = 'Google'; // 'Google' | 'OpenAI' | 'DeepSeek'
const OPENAI_API_KEY = ""; // Optional: For Client-Side Fallback
const DEEPSEEK_API_KEY = ""; // Optional: For Client-Side Fallback

// Music
const AMBIENT_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/02/07/audio_1919830500.mp3";

// =========================================================
// 🛠️ LOCAL BACKEND SERVICE (FALLBACK)
// =========================================================
// This mimics the server.ts logic but runs in the browser
// if the actual backend is unreachable.
const LocalBackend = {
    // Mimic DB
    getOrders: () => {
        const stored = localStorage.getItem('mystic_all_orders');
        return stored ? JSON.parse(stored) : [];
    },
    saveOrder: (order: any) => {
        const orders = LocalBackend.getOrders();
        order.id = `ORD-${Date.now().toString().slice(-6)}`;
        order.date = new Date().toLocaleDateString();
        order.status = 'paid';
        orders.unshift(order);
        localStorage.setItem('mystic_all_orders', JSON.stringify(orders));
        return { success: true, orderId: order.id };
    },
    getHistory: (userId: string) => {
        const allHistory = JSON.parse(localStorage.getItem('mystic_user_history_db') || '{}');
        return allHistory[userId] || [];
    },
    saveHistory: (userId: string, record: any) => {
        const allHistory = JSON.parse(localStorage.getItem('mystic_user_history_db') || '{}');
        if (!allHistory[userId]) allHistory[userId] = [];
        allHistory[userId].unshift(record);
        // Limit to 5
        allHistory[userId] = allHistory[userId].slice(0, 5);
        localStorage.setItem('mystic_user_history_db', JSON.stringify(allHistory));
    },
    
    // Mimic AI
    callAI: async (prompt: string, base64Image?: string) => {
        console.log(`[LocalBackend] Using ${CURRENT_PROVIDER} (Fallback)...`);
        
        if (CURRENT_PROVIDER === 'Google') {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
            ];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        base64Image ? { inlineData: { mimeType: 'image/jpeg', data: base64Image } } : null,
                        { text: prompt }
                    ].filter(Boolean) as any
                },
                config: { safetySettings }
            });
            return response.text;
        } else {
             // Generic OpenAI/DeepSeek Handler
             const apiKey = CURRENT_PROVIDER === 'DeepSeek' ? DEEPSEEK_API_KEY : OPENAI_API_KEY;
             const apiUrl = CURRENT_PROVIDER === 'DeepSeek' ? 'https://api.deepseek.com/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
             const model = CURRENT_PROVIDER === 'DeepSeek' ? 'deepseek-chat' : 'gpt-4o';
             
             if (!apiKey) throw new Error(`${CURRENT_PROVIDER} API Key missing for local fallback.`);

             // Construct payload (Vision supported?)
             const messages: any[] = [{ role: "user", content: [] }];
             if (prompt) messages[0].content.push({ type: "text", text: prompt });
             if (base64Image) messages[0].content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } });

             const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ model: model, messages: messages })
             });

             if (!response.ok) {
                 const err = await response.json();
                 throw new Error(err.error?.message || "AI API Error");
             }
             const data = await response.json();
             return data.choices[0].message.content;
        }
    }
};

// --- API CLIENT HELPERS ---

const callBackendAPI = async (endpoint: string, body: any = {}, method = 'POST') => {
    try {
        // 1. Try Real Backend
        const options: RequestInit = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (method === 'POST') options.body = JSON.stringify(body);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `Server Error: ${response.status}`);
        }
        return await response.json();

    } catch (error: any) {
        // 2. Fallback to LocalBackend if connection fails
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Connection refused')) {
            console.warn(`Backend unreachable. Using LocalBackend fallback for ${endpoint}`);
            
            // Route to local logic
            if (endpoint === '/analyze') {
                 const text = await LocalBackend.callAI(body.prompt, body.image);
                 if (body.userId) LocalBackend.saveHistory(body.userId, {
                     id: Date.now(), date: new Date().toLocaleDateString(), resultText: text
                 });
                 return { text };
            }
            if (endpoint === '/translate') {
                const prompt = `Translate to ${body.targetLang}. Preserve formatting:\n\n${body.text}`;
                const text = await LocalBackend.callAI(prompt);
                return { text };
            }
            if (endpoint === '/orders' && method === 'POST') {
                return LocalBackend.saveOrder(body);
            }
            if (endpoint === '/admin/orders' && method === 'GET') {
                return LocalBackend.getOrders();
            }
            if (endpoint.startsWith('/history/') && method === 'GET') {
                const userId = endpoint.split('/').pop() || '';
                return LocalBackend.getHistory(userId);
            }
        }
        throw error;
    }
};

// Helper for Retry with Error Parsing
const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 4000, onRetry?: (msg: string) => void): Promise<any> => {
    try {
        return await fn();
    } catch (err: any) {
        const msg = err.message || "";
        const isRateLimit = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');

        // Extract wait time if backend passes it through
        let waitTime = delay;
        
        // 1. Check Google RetryInfo struct (if available)
        if (err.details) {
            const retryInfo = err.details.find((d: any) => d['@type']?.includes('RetryInfo'));
            if (retryInfo && retryInfo.retryDelay) {
                const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
                if (!isNaN(seconds)) waitTime = Math.ceil(seconds * 1000) + 1000;
            }
        }
        
        // 2. Check Text Match
        if (waitTime === delay) {
             const retryMatch = msg.match(/retry in ([0-9.]+)s/);
             if (retryMatch) {
                 waitTime = Math.ceil(parseFloat(retryMatch[1])) * 1000 + 2000;
             }
        }

        if (waitTime > 180000) throw err; // Cap wait time

        if (retries > 0 && isRateLimit) {
             const seconds = Math.ceil(waitTime / 1000);
             if (onRetry) onRetry(`High traffic. Retrying in ${seconds}s...`);
             await new Promise(resolve => setTimeout(resolve, waitTime));
             return callWithRetry(fn, retries - 1, waitTime, onRetry); 
        }
        throw err;
    }
};

// Client-side Image Resizing Helper
const resizeImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } 
      else { if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; } }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); 
    };
    img.onerror = () => resolve(base64Str);
  });
};

const App = () => {
  const [isAdminMode, setIsAdminMode] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => { setIsAdminMode(window.location.hash === '#admin'); };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [currentPage, setCurrentPage] = useState<'home' | 'pricing' | 'shop' | 'product-detail' | 'about' | 'privacy' | 'terms' | 'history' | 'cart'>('home');
  
  // Language Logic
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
  
  // App State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [userState, setUserState] = useState<UserState>({ 
      trialStartDate: null, isSubscribed: false, hasPaidSingle: false, history: [], userId: '' 
  });
  
  // Generate a random User ID if not present (Simple Auth)
  useEffect(() => {
      let saved = localStorage.getItem('fortune_user_state_v3');
      let parsed = saved ? JSON.parse(saved) : null;
      
      if (!parsed) {
          parsed = { 
              trialStartDate: null, isSubscribed: false, hasPaidSingle: false, history: [],
              userId: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
          };
      } else if (!parsed.userId) {
          parsed.userId = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      }
      setUserState(parsed);
  }, []);

  // Save basic state locally (subscription status)
  useEffect(() => { 
      if (userState.userId) {
          localStorage.setItem('fortune_user_state_v3', JSON.stringify(userState)); 
      }
  }, [userState]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState<'start' | 'selection' | 'camera' | 'analyzing' | 'result'>('start');
  const [readingType, setReadingType] = useState<'face' | 'palm'>('face'); 
  const [image, setImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAiAdvice, setBalanceAiAdvice] = useState<string | undefined>(undefined); 
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | Product | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [calculatedElements, setCalculatedElements] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState<string>(""); 
  const [birthDate, setBirthDate] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobHour, setDobHour] = useState('12');
  const [dobMinute, setDobMinute] = useState('00');
  const [dobSecond, setDobSecond] = useState('00');
  const [gender, setGender] = useState('male');
  const [userName, setUserName] = useState('');
  const [useAdvancedAnalysis, setUseAdvancedAnalysis] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!audioRef.current) { 
        audioRef.current = new Audio(AMBIENT_MUSIC_URL); 
        audioRef.current.loop = true; 
        audioRef.current.volume = 0.3; 
    }
    if (isPlayingMusic) audioRef.current.play().catch(e => console.warn(e));
    else audioRef.current.pause();
  }, [isPlayingMusic]);

  useEffect(() => { if (dobYear && dobMonth && dobDay) { const m = dobMonth.padStart(2, '0'); const d = dobDay.padStart(2, '0'); setBirthDate(`${dobYear}-${m}-${d}`); } else { setBirthDate(''); } }, [dobYear, dobMonth, dobDay]);
  useEffect(() => { window.scrollTo(0, 0); }, [currentPage, selectedProduct]);

  // Retrieve History
  useEffect(() => {
      const fetchHistory = async () => {
          if (!userState.userId) return;
          try {
              // Try backend, fallback to local via callBackendAPI logic
              const historyData = await callBackendAPI(`/history/${userState.userId}`, {}, 'GET');
              setUserState(prev => ({ ...prev, history: historyData }));
          } catch (e) { console.warn("Could not fetch history", e); }
      };
      if (currentPage === 'history') fetchHistory();
  }, [currentPage, userState.userId]);

  const getDaysRemaining = () => {
      if (!userState.trialStartDate) return 3; 
      const start = new Date(userState.trialStartDate);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      return Math.max(0, Math.ceil(3 - (diffMs / (1000 * 60 * 60 * 24))));
  };

  const switchLanguage = async (newLang: string) => {
      setLanguage(newLang);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      if (view === 'result' && resultText) {
          setIsTranslating(true);
          try {
              const response = await callWithRetry(() => callBackendAPI('/translate', {
                  text: resultText,
                  targetLang: newLang
              }), 5, 2000, (retryMsg) => console.log("Translating wait: " + retryMsg));
              
              if (response.text) setResultText(response.text);
          } catch (e: any) {
               // Silent fail for translation
               console.warn("Translation failed:", e.message);
          } finally {
              setIsTranslating(false);
          }
      }
  };

  const startCamera = async (type: 'face' | 'palm') => {
    setReadingType(type);
    if (useAdvancedAnalysis && !birthDate) { alert("Please complete your birth date."); return; }
    setView('camera'); 
    if (!isPlayingMusic) setIsPlayingMusic(true);
    try { 
        const stream = await navigator.mediaDevices.getUserMedia({ video: true }); 
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); } 
    } catch (err) { 
        alert("Unable to access camera."); setView('selection'); 
    }
  };
  const stopCamera = () => { if (videoRef.current && videoRef.current.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop()); videoRef.current.srcObject = null; } };
  
  const capturePhoto = async (): Promise<boolean> => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      if (video.readyState !== 4) return false;
      const canvas = canvasRef.current; 
      canvas.width = 1024; canvas.height = (video.videoHeight / video.videoWidth) * 1024;
      const ctx = canvas.getContext('2d'); 
      if (ctx) { 
          ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
          setImage(dataUrl); stopCamera(); processImage(dataUrl);
          return true;
      }
    }
    return false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useAdvancedAnalysis && !birthDate) { alert("Please complete your birth date."); e.target.value = ''; return; }
    if (!isPlayingMusic) setIsPlayingMusic(true);
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0); 
      const reader = new FileReader(); 
      let progress = 0;
      const interval = setInterval(() => { progress += 10; setUploadProgress(Math.min(progress, 99)); }, 30);
      reader.onloadend = async () => { 
          clearInterval(interval); setUploadProgress(100); 
          let dataUrl = reader.result as string; 
          dataUrl = await resizeImage(dataUrl);
          setTimeout(() => { setImage(dataUrl); setUploadProgress(0); processImage(dataUrl); }, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- DEMO / MOCK GENERATOR FOR ERROR FALLBACK ---
  const getMockResult = (headers: any) => {
      return `
## 🔮 ${headers.aura}
(DEMO MODE - LOCATION BLOCKED)
Your aura radiates with a calm, stable golden energy.

## ⚖️ ${headers.elements}
*   🪙 **${t.elementMetal}:** 40%
*   🌲 **${t.elementWood}:** 15%
*   💧 **${t.elementWater}:** 25%
*   🔥 **${t.elementFire}:** 10%
*   ⛰️ **${t.elementEarth}:** 10%

## 📜 ${headers.advice}
Google AI services are currently unavailable in your region.
This is a demonstration of the result layout.
      `;
  };

  const processImage = async (base64Image: string) => {
    const now = new Date();
    // 3-Day Free Trial Logic
    if (!userState.isSubscribed && !userState.hasPaidSingle) {
        if (!userState.trialStartDate) {
            setUserState(prev => ({ ...prev, trialStartDate: now.toISOString() }));
        } else {
            const start = new Date(userState.trialStartDate);
            const daysPassed = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            if (daysPassed > 3) { setShowPaywall(true); setView('start'); return; }
        }
    }
    if (userState.hasPaidSingle) { setUserState(prev => ({ ...prev, hasPaidSingle: false })); }

    // Conditional Calculations
    let wuXingResult: any = null;
    let starSign: string | null = null;
    let age = 0;
    if (useAdvancedAnalysis && birthDate) {
        wuXingResult = calculateWuXing(dobYear, dobMonth, dobDay, dobHour, dobMinute, dobSecond);
        starSign = getWesternZodiac(birthDate);
        setCalculatedElements(wuXingResult);
        age = calculateAge(birthDate);
    } else {
        setCalculatedElements(null); 
    }
    
    setView('analyzing');
    setLoadingMessage(""); 
    setAnalysisProgress(0);
    const progressInterval = setInterval(() => { setAnalysisProgress(prev => Math.min(prev + 1, 95)); }, 200);

    const langConfig = LANGUAGES.find(l => l.code === language);
    const targetLangName = langConfig?.label || 'English';
    const headers = {
        aura: t.reportHeaderAura, elements: t.reportHeaderElements, name: t.reportHeaderName, star: t.reportHeaderStar,
        fortune: t.reportHeaderFortune, wealth: t.reportHeaderWealth, family: t.reportHeaderFamily, parents: t.reportHeaderParents,
        advice: t.reportHeaderAdvice, health: t.reportHeaderHealth, love: t.reportHeaderLove, dailyLuck: t.reportHeaderDailyLuck,
        palmLifeLine: t.palmLifeLine, palmHeadLine: t.palmHeadLine, palmHeartLine: t.palmHeartLine, palmFateLine: t.palmFateLine
    };

    try {
      const currentDateStr = now.toLocaleDateString();
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      let prompt = '';
      if (readingType === 'palm') {
           prompt = `
            You are a grandmaster of Palmistry. User: ${gender}. Date: ${currentDateStr}.
            Analyze Life Line, Head Line, Heart Line, Fate Line.
            Structure:
            ## 🔮 ${headers.dailyLuck} ...
            ## 🧬 ${headers.palmLifeLine} ...
            ## 🧠 ${headers.palmHeadLine} ...
            ## ❤️ ${headers.palmHeartLine} ...
            ## 🛤️ ${headers.palmFateLine} ...
            ## ⚖️ ${headers.elements} ...
            ## 📜 ${headers.advice} ...
            Output in ${targetLangName}.
           `;
      } else {
          prompt = `
            You are a grandmaster of Mianxiang (Face Reading). User: ${gender}. Date: ${currentDateStr}.
            Analyze face.
            Structure:
            ## 🔮 ${headers.aura} ...
            ## ⚖️ ${headers.elements} ... (Include emojis 🪙, 🌲, 💧, 🔥, ⛰️)
            ## 📅 ${headers.fortune} ...
            ## 💰 ${headers.wealth} ...
            ## 🏠 ${headers.family} ...
            ## 👴 ${headers.parents} ...
            ## 📜 ${headers.advice} ...
            Output in ${targetLangName}.
          `;
          if (useAdvancedAnalysis && wuXingResult) {
              prompt += ` Context: Born ${birthDate}. WuXing: Metal:${wuXingResult.scores.Metal}%, Wood:${wuXingResult.scores.Wood}%, Water:${wuXingResult.scores.Water}%, Fire:${wuXingResult.scores.Fire}%, Earth:${wuXingResult.scores.Earth}%. Weak: ${wuXingResult.missingElement}. Zodiac: ${starSign}. Name: ${userName}. Add analysis for these.`;
          }
      }

      // CALL BACKEND API (or FALLBACK)
      const apiCall = callWithRetry(() => callBackendAPI('/analyze', {
          prompt,
          image: base64Data,
          userId: userState.userId
      }), 5, 4000, (retryMsg) => setLoadingMessage(retryMsg));

      const response: any = await apiCall;
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setLoadingMessage("");
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newResultText = response.text || "Destiny unclear.";
      setResultText(newResultText);
      
      // History is already updated via LocalBackend/Server, but we update UI state here
      const newHistoryItem: HistoryRecord = {
          id: Date.now(),
          date: now.toLocaleDateString(),
          resultText: newResultText,
          elements: wuXingResult,
          name: userName,
          gender: gender,
          birthDate: birthDate || "Not Provided"
      };
      // Optimistic Update
      setUserState(prev => ({ ...prev, history: [newHistoryItem, ...(prev.history || [])].slice(0, 5) }));
      
      setView('result');
    } catch (error: any) { 
        clearInterval(progressInterval);
        setAnalysisProgress(0);
        setLoadingMessage("");
        
        // Handle Location Block specifically
        if (error.message.includes('FAILED_PRECONDITION') || error.message.includes('location')) {
            const mockText = getMockResult(headers);
            setResultText(mockText);
            if (!calculatedElements) setCalculatedElements({ scores: { Metal: 20, Wood: 20, Water: 20, Fire: 20, Earth: 20 }, missingElement: 'Fire' });
            setView('result');
            alert("Google AI is not available in your region. Switching to Demo Mode.");
        } else {
             console.error("Analysis Error:", error);
             alert("Connection failed. Please check your network.");
        }
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    if (!resultText) return;
    const utterance = new SpeechSynthesisUtterance(resultText.replace(/[#*]/g, ''));
    const langConfig = LANGUAGES.find(l => l.code === language);
    utterance.lang = langConfig?.voiceCode || 'en-US';
    utterance.onend = () => setIsSpeaking(false); speechRef.current = utterance; window.speechSynthesis.speak(utterance); setIsSpeaking(true);
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
      const daysRemaining = getDaysRemaining();
      if (daysRemaining > 0 || userState.isSubscribed) { 
          setBalanceAiAdvice(aiAdvice); setShowBalanceModal(true); 
      } else { 
          setShowPaywall(true); 
      }
  };

  const handleAddToCart = (product: Product) => { setCart(prev => { const existing = prev.find(item => item.product.id === product.id); if (existing) { return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item); } return [...prev, { product, quantity: 1 }]; }); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  const handleRemoveFromCart = (productId: string) => { setCart(prev => prev.filter(item => item.product.id !== productId)); };
  
  const handleCartCheckout = (total: number) => {
      const cartPlan: any = { id: 'cart_checkout', title: 'Cart Checkout', price: `$${total.toFixed(2)}`, desc: 'Items from Spiritual Shop', isSub: false, category: 'cart_mixed' };
      setSelectedPlan(cartPlan); setShowPaymentModal(true);
  };

  const handleBuyProduct = (product: Product) => { setShowBalanceModal(false); setSelectedProduct(null); setSelectedPlan(product); setShowPaymentModal(true); };
  
  const handleViewProduct = (product: Product) => { setSelectedProduct(product); setCurrentPage('product-detail'); setView('start'); };

  const handlePaymentSuccess = async (paymentDetails?: any) => { 
      if (!selectedPlan) return; 
      
      try {
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
          
          const newOrder: Partial<Order> = {
              customerName: shipping.name || 'Guest User',
              items: orderItems,
              total: total,
              shippingAddress: shipping.address ? `${shipping.address}, ${shipping.city}` : 'Digital',
              paymentMethod: paymentDetails?.method || 'unknown',
              email: contact.email,
              phone: contact.phone
          };
          
          // Call Backend OR Fallback
          await callBackendAPI('/orders', newOrder);

      } catch (e) {
          console.error("Failed to save order", e);
      }

      // Update Client State
      if (selectedPlan.id === 'cart_checkout') { setCart([]); setCurrentPage('home'); setView('start'); } 
      else if ('isSub' in selectedPlan) { 
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

  return (
    <div style={styles.appContainer}>
      <nav style={styles.navbar}>
        <div className="nav-container">
          <div style={styles.logo} onClick={handleGoHome}>
            <div style={{width: '30px', height: '30px'}}>{BaguaSVG}</div>
            <span style={{color: theme.gold}}>{t.title}</span>
          </div>
          <div className="nav-links">
             <span style={getNavLinkStyle('home')} onClick={handleGoHome}>{t.home}</span>
             <span style={getNavLinkStyle('pricing')} onClick={() => { setCurrentPage('pricing'); setView('start'); }}>{t.pricing}</span>
             <span style={getNavLinkStyle('shop')} onClick={() => { setCurrentPage('shop'); setView('start'); }}>{t.shop}</span>
             <span style={getNavLinkStyle('about')} onClick={() => { setCurrentPage('about'); setView('start'); }}>{t.about}</span>
             <span style={getNavLinkStyle('history')} onClick={() => { setCurrentPage('history'); setView('start'); }}>
                 <i className="fas fa-history" style={{marginRight: '5px'}}></i>{t.history}
             </span>
             <div style={{position: 'relative', cursor: 'pointer', marginLeft: '10px', marginRight: '15px'}} onClick={() => { setCurrentPage('cart'); setView('start'); }}>
                 <i className="fas fa-shopping-cart" style={{color: theme.gold}}></i>
                 {cart.length > 0 && <span style={{position: 'absolute', top: '-8px', right: '-8px', background: '#c0392b', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cart.reduce((a,c) => a + c.quantity, 0)}</span>}
             </div>
             <select style={{background: 'rgba(0,0,0,0.5)', color: theme.gold, border: '1px solid #555', borderRadius: '4px', padding: '2px', marginLeft: '10px'}} value={language} onChange={(e) => switchLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
             </select>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        {showToast && <div style={{position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', background: '#2ecc71', color: '#fff', padding: '15px 30px', borderRadius: '30px', zIndex: 3005, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', fontWeight: 'bold'}} className="fade-in"><i className="fas fa-check-circle"></i> {t.addToCart} - Success</div>}
        
        {showPaywall && <PaymentModal t={t} plan={{id: 'single', title: t.planSingle, price: t.planSinglePrice, desc: t.planSingleDesc, isSub: false}} onClose={() => setShowPaywall(false)} onSuccess={(d) => { handlePaymentSuccess(d); if (view === 'start') setView('selection'); }} />}
        {showPaymentModal && selectedPlan && <PaymentModal t={t} plan={selectedPlan} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />}
        {showBalanceModal && (<FiveElementsBalanceModal t={t} missingElement={calculatedElements ? calculatedElements.missingElement : 'Metal'} aiAdvice={balanceAiAdvice} onClose={() => setShowBalanceModal(false)} onBuyProduct={handleBuyProduct} />)}
        
        {currentPage === 'product-detail' && selectedProduct && (
            <div style={{...styles.heroSection, justifyContent: 'flex-start', paddingTop: '100px'}}>
                <ProductDetailModal key={selectedProduct.id} isPageMode={true} t={t} product={selectedProduct} onClose={() => setCurrentPage('shop')} onAddToCart={() => handleAddToCart(selectedProduct)} onBuyNow={() => handleBuyProduct(selectedProduct)} onSwitchProduct={(p) => setSelectedProduct(p)} />
            </div>
        )}

        {currentPage === 'home' && (
             <div style={{...styles.heroSection, paddingTop: '1rem'}}>
                {view === 'start' && <RenderStartView t={t} freeTrials={getDaysRemaining()} onStart={(type: 'face' | 'palm') => { setReadingType(type); setView('selection'); }} />}
                {view === 'selection' && <RenderSelectionView 
                    t={t} readingType={readingType} gender={gender} dobYear={dobYear} dobMonth={dobMonth} dobDay={dobDay} dobHour={dobHour} dobMinute={dobMinute} dobSecond={dobSecond}
                    uploadProgress={uploadProgress} userName={userName} onSetUserName={setUserName} onSetGender={setGender} onSetDobYear={setDobYear} onSetDobMonth={setDobMonth} onSetDobDay={setDobDay} onSetDobHour={setDobHour} onSetDobMinute={setDobMinute} onSetDobSecond={setDobSecond}
                    onStartCamera={() => startCamera(readingType)} onUpload={handleFileUpload} onBack={() => setView('start')}
                    language={language} useAdvancedAnalysis={useAdvancedAnalysis} onToggleAdvanced={() => setUseAdvancedAnalysis(!useAdvancedAnalysis)}
                />}
                {view === 'camera' && <RenderCameraView t={t} readingType={readingType} videoRef={videoRef} canvasRef={canvasRef} onStopCamera={() => { stopCamera(); setView('selection'); }} onCapture={capturePhoto} />}
                {view === 'analyzing' && <LoadingSpinner t={t} progress={analysisProgress} message={loadingMessage} />}
                {view === 'result' && <RenderResultView 
                    t={t} readingType={readingType} birthDate={birthDate} gender={gender} calculatedElements={calculatedElements} resultText={resultText} 
                    language={language} isSpeaking={isSpeaking} isTranslating={isTranslating} LANGUAGES={LANGUAGES}
                    onLanguageChange={(e: any) => switchLanguage(e.target.value)} onToggleSpeech={toggleSpeech} onAnalyzeAnother={() => { setView('selection'); setImage(null); setResultText(""); }}
                    onBuyProduct={handleBuyProduct} onOpenBalance={handleOpenBalance}
                />}
                {view === 'start' && (
                    <div style={{marginTop: '4rem', maxWidth: '1000px', width: '100%'}} className="desktop-only">
                       <h2 style={{color: theme.gold, marginBottom: '2rem'}}>{t.howItWorks}</h2>
                       <div className="feature-grid">
                          <div style={{flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.4)', padding:'20px', borderRadius:'8px', border:'1px solid rgba(212, 175, 55, 0.2)'}}><i className="fas fa-fingerprint" style={{fontSize: '2rem', color: theme.gold, marginBottom: '1rem'}}></i><h3 style={{color: theme.gold}}>{t.step1Title}</h3><p style={{color: '#aaa'}}>{t.step1Desc}</p></div>
                          <div style={{flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.4)', padding:'20px', borderRadius:'8px', border:'1px solid rgba(212, 175, 55, 0.2)'}}><i className="fas fa-microchip" style={{fontSize: '2rem', color: theme.gold, marginBottom: '1rem'}}></i><h3 style={{color: theme.gold}}>{t.step2Title}</h3><p style={{color: '#aaa'}}>{t.step2Desc}</p></div>
                          <div style={{flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.4)', padding:'20px', borderRadius:'8px', border:'1px solid rgba(212, 175, 55, 0.2)'}}><i className="fas fa-file-invoice-dollar" style={{fontSize: '2rem', color: theme.gold, marginBottom: '1rem'}}></i><h3 style={{color: theme.gold}}>{t.step3Title}</h3><p style={{color: '#aaa'}}>{t.step3Desc}</p></div>
                       </div>
                    </div>
                )}
             </div>
        )}
        {currentPage === 'pricing' && <div style={styles.heroSection}><PricingPage t={t} onSelectPlan={triggerPayment} /></div>}
        {currentPage === 'shop' && <div style={styles.heroSection}><ShopPage t={t} onViewProduct={handleViewProduct} /></div>}
        {currentPage === 'cart' && <div style={styles.heroSection}><CartPage t={t} cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCartCheckout} /></div>}
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
