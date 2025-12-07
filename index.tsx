
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

import { theme, styles } from './theme';
import { LANGUAGES, TRANSLATIONS } from './translations';
import { calculateAge, calculateWuXing } from './utils';
import { UserState, Plan, CartItem, Product } from './types';
import { BaguaSVG } from './components/Icons';
import { PaymentModal, ProductDetailModal, FiveElementsBalanceModal } from './components/Modals';
import { PrivacyPolicy, TermsOfService, AboutPage } from './pages/StaticPages';
import { ShopPage } from './pages/ShopPage';
import { PricingPage } from './pages/PricingPage';
import { RenderStartView, RenderSelectionView, RenderCameraView, RenderResultView, LoadingSpinner } from './pages/HomeViews';

const API_KEY = process.env.API_KEY;
// Changed to MP3 for Safari/iOS compatibility to fix "no supported sources" error
const AMBIENT_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/02/07/audio_1919830500.mp3";

const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'pricing' | 'shop' | 'about' | 'privacy' | 'terms'>('home');
  
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
  const [userState, setUserState] = useState<UserState>({ freeTrials: 3, isSubscribed: false, hasPaidSingle: false });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState<'start' | 'selection' | 'camera' | 'analyzing' | 'result'>('start');
  const [image, setImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false); // New State
  const [isTranslating, setIsTranslating] = useState(false); // New State
  const [selectedPlan, setSelectedPlan] = useState<Plan | Product | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [calculatedElements, setCalculatedElements] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [birthDate, setBirthDate] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobHour, setDobHour] = useState('12');
  const [dobMinute, setDobMinute] = useState('00');
  const [dobSecond, setDobSecond] = useState('00');
  const [gender, setGender] = useState('male');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => { const saved = localStorage.getItem('fortune_user_state'); if (saved) setUserState(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem('fortune_user_state', JSON.stringify(userState)); }, [userState]);
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

  const switchLanguage = async (newLang: string) => {
      setLanguage(newLang);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      // Dynamic Translation if on Result Page
      if (view === 'result' && resultText) {
          setIsTranslating(true);
          try {
              if (!API_KEY) throw new Error("API Key missing");
              const ai = new GoogleGenAI({ apiKey: API_KEY });
              const langConfig = LANGUAGES.find(l => l.code === newLang);
              const targetLangName = langConfig?.label || 'English';
              
              const prompt = `Translate the following markdown text into ${targetLangName}. Preserve all markdown formatting (##, *, etc.) and emojis. Text:\n\n${resultText}`;
              
              const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: { text: prompt }
              });
              
              if (response.text) {
                  setResultText(response.text);
              }
          } catch (e) {
              console.error("Translation failed", e);
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
            // Handle play promise to prevent unhandled rejection
            videoRef.current.play().catch(e => console.error("Video play error:", e)); 
        } 
    } catch (err) { 
        console.error(err);
        alert("Unable to access camera. Please allow permissions."); 
        setView('selection'); 
    }
  };
  const stopCamera = () => { if (videoRef.current && videoRef.current.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop()); videoRef.current.srcObject = null; } };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current; const canvas = canvasRef.current; canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d'); if (ctx) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, canvas.width, canvas.height); const dataUrl = canvas.toDataURL('image/jpeg'); setImage(dataUrl); stopCamera(); processImage(dataUrl); }
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
      // Smoother upload simulation
      const interval = setInterval(() => { 
          progress += 5; 
          setUploadProgress(Math.min(progress, 99)); 
      }, 50);
      
      reader.onloadend = () => { 
          clearInterval(interval); 
          setUploadProgress(100); 
          const dataUrl = reader.result as string; 
          setTimeout(() => { 
              setImage(dataUrl); 
              setUploadProgress(0); 
              processImage(dataUrl); 
          }, 800); // Slight delay to show 100%
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string) => {
    if (userState.freeTrials <= 0 && !userState.isSubscribed && !userState.hasPaidSingle) { setShowPaywall(true); setView('start'); return; }
    const wuXingResult = calculateWuXing(dobYear, dobMonth, dobDay, dobHour, dobMinute, dobSecond);
    setCalculatedElements(wuXingResult);
    const now = new Date(); const currentDateStr = now.toLocaleDateString();
    
    // Switch to analyzing view
    setView('analyzing');
    setAnalysisProgress(0);
    
    // Simulation for Analysis Progress
    const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
            // Slow down as we approach 90%
            const increment = prev < 60 ? 5 : prev < 85 ? 2 : 0.5;
            return Math.min(prev + increment, 95);
        });
    }, 200);

    // Deduct credit
    if (!userState.isSubscribed) { if (userState.hasPaidSingle) setUserState(prev => ({ ...prev, hasPaidSingle: false })); else setUserState(prev => ({ ...prev, freeTrials: Math.max(0, prev.freeTrials - 1) })); }
    
    try {
      if (!API_KEY) throw new Error("API Key is missing.");
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      // Clean base64 string
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      const langConfig = LANGUAGES.find(l => l.code === language);
      const targetLangName = langConfig?.label || 'English';
      const age = calculateAge(birthDate);
      const prompt = `
        You are a grandmaster of traditional Chinese physiognomy (Mianxiang) and Bazi Astrology.
        The user is ${gender}, born on ${birthDate} at ${dobHour}:${dobMinute}:${dobSecond}. (Age: ${age}).
        **Current Date/Time of Reading:** ${currentDateStr}
        Calculated Birth Five Elements (Wu Xing) Strength: Metal: ${wuXingResult.scores.Metal}%, Wood: ${wuXingResult.scores.Wood}%, Water: ${wuXingResult.scores.Water}%, Fire: ${wuXingResult.scores.Fire}%, Earth: ${wuXingResult.scores.Earth}%.
        Weakest Element in Birth Chart: ${wuXingResult.missingElement}.
        Analyze this person's face with a respectful, ancient, and insightful tone.
        **CRITICAL TASK**: Compare their Birth Date (Bazi) against the Current Date (${currentDateStr}). Determine if there are any clashes or harmonies today and for this current month.
        Structure your response EXACTLY as follows in Markdown:
        ## 🔮 General Aura
        [Analysis here]
        ## ⚖️ Five Elements (Wu Xing)
        *   🪙 **Metal (Jin):** [Analysis]
        *   🌲 **Wood (Mu):** [Analysis]
        *   💧 **Water (Shui):** [Analysis]
        *   🔥 **Fire (Huo):** [Analysis]
        *   ⛰️ **Earth (Tu):** [Analysis]
        ## 📅 Temporal Fortune (Date: ${currentDateStr})
        *   **Today's Luck:** [Analyze today's luck based on birth/current date clash/harmony]
        *   **Monthly Forecast:** [Analyze this month's luck]
        ## 💰 Wealth & Fortune
        [Analysis here]
        ## 🏠 Family & Relationships
        [Analysis here]
        ## 👴 Parents & Ancestors
        [Analysis here]
        ## 📜 Master's Advice
        [Analysis here. Mention that their weakest element is ${wuXingResult.missingElement}. Explain WHY they need to supplement this specific element to navigate the challenges of the current date/month. Explicitly mention that wearing accessories related to ${wuXingResult.missingElement} can help balance the specific energies of today.]
        CRITICAL: Output the response DIRECTLY in ${targetLangName}. Ensure the emojis (🪙, 🌲, 💧, 🔥, ⛰️) are used at the start of each Five Elements line.
      `;
      
      // Use 'gemini-2.5-flash' for multimodal vision + text generation tasks.
      const response = await ai.models.generateContent({ 
          model: 'gemini-2.5-flash', 
          contents: { 
              parts: [ 
                  { inlineData: { mimeType: 'image/jpeg', data: base64Data } }, 
                  { text: prompt } 
              ] 
          } 
      });
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Short delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 600));

      setResultText(response.text || "Destiny is unclear."); 
      setView('result');
    } catch (error) { 
        clearInterval(progressInterval);
        setAnalysisProgress(0);
        console.error(error); 
        alert(`Analysis failed: ${error instanceof Error ? error.message : "Connection Error"}. Please try again.`);
        setView('selection'); // Go back to selection instead of start to preserve inputs
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    if (!resultText) return;
    const utterance = new SpeechSynthesisUtterance(resultText.replace(/[#*]/g, ''));
    const langConfig = LANGUAGES.find(l => l.code === language);
    utterance.lang = langConfig?.voiceCode || 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === utterance.lang && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('daniel')));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9; utterance.pitch = 0.8; utterance.onend = () => setIsSpeaking(false); speechRef.current = utterance; window.speechSynthesis.speak(utterance); setIsSpeaking(true);
  };

  const handleOpenBalance = () => {
      // Gatekeeping: Check payment
      if (!userState.isSubscribed && !userState.hasPaidSingle) {
          setShowPaywall(true);
      } else {
          setShowBalanceModal(true);
      }
  };

  const handleAddToCart = (product: Product) => { setCart(prev => { const existing = prev.find(item => item.product.id === product.id); if (existing) { return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item); } return [...prev, { product, quantity: 1 }]; }); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  const handleBuyProduct = (product: Product) => { setShowBalanceModal(false); setSelectedProduct(null); setSelectedPlan(product); setShowPaymentModal(true); };
  const handlePaymentSuccess = () => { if (!selectedPlan) return; if ('isSub' in selectedPlan) { if (selectedPlan.id === 'single') setUserState(prev => ({ ...prev, hasPaidSingle: true })); else setUserState(prev => ({ ...prev, isSubscribed: true })); } else { alert(t.success); } setShowPaymentModal(false); if (currentPage === 'pricing') handleGoHome(); };
  const handleGoHome = () => { stopCamera(); window.speechSynthesis.cancel(); setIsSpeaking(false); setShowPaywall(false); setShowBalanceModal(false); setShowPaymentModal(false); setSelectedProduct(null); setCurrentPage('home'); setView('start'); setUploadProgress(0); setAnalysisProgress(0); };
  const getNavLinkStyle = (page: string) => ({ ...styles.navLink, color: currentPage === page ? theme.gold : theme.text, borderBottom: currentPage === page ? `2px solid ${theme.gold}` : 'none' });

  const triggerPayment = (plan: Plan) => {
      setSelectedPlan(plan);
      setShowPaymentModal(true);
  };

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
             <div style={{position: 'relative', cursor: 'pointer', marginLeft: '10px'}} onClick={() => { setCurrentPage('shop'); setView('start'); }}>
                 <i className="fas fa-shopping-cart" style={{color: theme.gold}}></i>
                 {cart.length > 0 && <span style={{position: 'absolute', top: '-8px', right: '-8px', background: '#c0392b', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cart.reduce((a,c) => a + c.quantity, 0)}</span>}
             </div>
             <select style={{background: 'transparent', color: '#ccc', border: '1px solid #555', borderRadius: '4px', padding: '2px', marginLeft: '10px'}} value={language} onChange={(e) => switchLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
             </select>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        {showToast && <div style={{position: 'fixed', top: '80px', right: '20px', background: '#2ecc71', color: '#fff', padding: '10px 20px', borderRadius: '4px', zIndex: 2000}} className="fade-in"><i className="fas fa-check"></i> Added to Cart</div>}
        
        {showPaywall && <PaymentModal t={t} plan={{id: 'single', title: t.planSingle, price: t.planSinglePrice, desc: t.planSingleDesc, isSub: false}} onClose={() => setShowPaywall(false)} onSuccess={() => { handlePaymentSuccess(); if (view === 'start') setView('selection'); }} />}
        {showPaymentModal && selectedPlan && <PaymentModal t={t} plan={selectedPlan} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />}
        {showBalanceModal && calculatedElements && <FiveElementsBalanceModal t={t} missingElement={calculatedElements.missingElement} onClose={() => setShowBalanceModal(false)} onBuyProduct={handleBuyProduct} />}
        {selectedProduct && <ProductDetailModal t={t} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={() => handleAddToCart(selectedProduct)} onBuyNow={() => handleBuyProduct(selectedProduct)} />}

        {currentPage === 'home' && (
             <div style={styles.heroSection}>
                {view === 'start' && <RenderStartView t={t} freeTrials={userState.freeTrials} onStart={() => setView('selection')} />}
                
                {view === 'selection' && <RenderSelectionView 
                    t={t} 
                    gender={gender} dobYear={dobYear} dobMonth={dobMonth} dobDay={dobDay} dobHour={dobHour} dobMinute={dobMinute} dobSecond={dobSecond}
                    uploadProgress={uploadProgress}
                    onSetGender={setGender} onSetDobYear={setDobYear} onSetDobMonth={setDobMonth} onSetDobDay={setDobDay} onSetDobHour={setDobHour} onSetDobMinute={setDobMinute} onSetDobSecond={setDobSecond}
                    onStartCamera={startCamera} onUpload={handleFileUpload} onBack={() => setView('start')}
                />}
                
                {view === 'camera' && <RenderCameraView t={t} videoRef={videoRef} canvasRef={canvasRef} onStopCamera={() => { stopCamera(); setView('selection'); }} onCapture={capturePhoto} />}
                
                {view === 'analyzing' && <LoadingSpinner t={t} progress={analysisProgress} />}
                
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
        {currentPage === 'shop' && <div style={styles.heroSection}><ShopPage t={t} onViewProduct={setSelectedProduct} /></div>}
        {currentPage === 'about' && <div style={styles.heroSection}><AboutPage t={t} /></div>}
        {currentPage === 'privacy' && <div style={styles.heroSection}><PrivacyPolicy t={t} /></div>}
        {currentPage === 'terms' && <div style={styles.heroSection}><TermsOfService t={t} /></div>}
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
