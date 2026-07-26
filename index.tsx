
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { theme, styles } from './theme';
import { LANGUAGES, TRANSLATIONS } from './translations';
import { calculateAge, calculateWuXing, getWesternZodiac } from './utils';
import { UserState, Plan, CartItem, Product, HistoryRecord, Order, AppConfig, HomepageConfig, ServiceTierOption } from './types';
import { BaguaSVG } from './components/Icons';
import { PaymentModal, ProductDetailModal, FiveElementsBalanceModal } from './components/Modals';
import { PrivacyPolicy, TermsOfService, RefundPolicy, AboutPage } from './pages/StaticPages';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage'; 
import { AdminPage } from './pages/AdminPage';
import { PricingPage } from './pages/PricingPage';
import { LandingPage } from './pages/LandingPage';
import { RenderStartView, RenderSelectionView, RenderResultView, LoadingSpinner, RenderHistoryView, RenderCameraView } from './pages/HomeViews';

// =========================================================
// 🌐 FRONTEND CONFIGURATION
// =========================================================

// Point this to your backend server URL
const API_BASE_URL = "/api"; 

// Music
const AMBIENT_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/02/07/audio_1919830500.mp3";

// =========================================================
// 🛠️ LOCAL BACKEND SERVICE (FALLBACK & DYNAMIC CONFIG)
// =========================================================

const AIService = {
    // Call AI securely through server-side proxy
    callAI: async (prompt: string, base64Image?: string | string[] | null, config?: AppConfig, userId?: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 180000); // 180s timeout

        try {
            const provider = config?.textProvider || 'Google';
            console.log(`[AIService] Proxying ${provider} request via server...`);

            // Resize images before sending to prevent heavy payload fetch failures
            let processedImages: string | string[] | null = null;
            if (Array.isArray(base64Image)) {
                processedImages = await Promise.all(
                    base64Image.map(async (img) => {
                        const fullStr = img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
                        return await resizeImage(fullStr, 800, 800);
                    })
                );
            } else if (base64Image) {
                const fullStr = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
                processedImages = await resizeImage(fullStr, 800, 800);
            }

            const payload: any = { prompt, provider, config, userId };
            if (Array.isArray(processedImages)) {
                payload.base64Images = processedImages;
                payload.base64Image = processedImages[0];
            } else {
                payload.base64Image = processedImages;
            }

            let response: Response;
            try {
                response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
            } catch (fetchErr: any) {
                console.warn("[AIService] Network or fetch error:", fetchErr);
                throw new Error(`Fetch request failed: ${fetchErr.message || 'Server connection error'}`);
            }

            if (!response.ok) {
                let errData: any = {};
                try {
                    errData = await response.json();
                } catch (e) {
                    errData = { error: `Server Error: ${response.status}` };
                }
                throw new Error(errData.error || `Server Error: ${response.status}`);
            }

            const data = await response.json();
            return data.text;
        } finally {
            clearTimeout(timeoutId);
        }
    }
};

// --- API CLIENT HELPERS ---

const callBackendAPI = async (endpoint: string, body: any = {}, method = 'POST', config?: AppConfig) => {
    try {
        const options: RequestInit = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (method === 'POST') options.body = JSON.stringify({ ...body, config });

        let response: Response;
        try {
            response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        } catch (fetchErr: any) {
            console.warn(`[callBackendAPI] Network fetch error for ${endpoint}:`, fetchErr);
            throw new Error(`Fetch request failed: ${fetchErr.message || 'Server connection error'}`);
        }

        if (!response.ok) {
            let errData: any = {};
            try {
                errData = await response.json();
            } catch (e) {
                errData = { error: `Server Error: ${response.status}` };
            }
            throw new Error(errData.error || `Server Error: ${response.status}`);
        }
        return await response.json();

    } catch (error: any) {
        throw error;
    }
};

// Helper for Retry with Error Parsing
const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 1500, onRetry?: (msg: string) => void): Promise<any> => {
    try {
        return await fn();
    } catch (err: any) {
        const msg = err.message || "";
        // Don't retry auth errors or location blocks
        if (msg.includes('Key missing') || msg.includes('FAILED_PRECONDITION')) throw err;

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

// --- AUTH MODAL COMPONENT (UPDATED VALIDATION) ---
const AuthModal = ({ t, onClose, onLoginSuccess }: { t: any, onClose: () => void, onLoginSuccess: (user: any) => void }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    // Email Regex: Standard format checking
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleAuthAction = async (action: 'login' | 'signup' | 'forgot') => {
        setLoading(true);
        setError('');
        
        try {
            // Client-Side Validation
            if (action === 'login' || action === 'signup') {
                if (!email) throw new Error(t.required + ": " + t.emailLabel);
                if (!emailRegex.test(email)) throw new Error("Invalid email format (example@domain.com)");
                if (!password) throw new Error(t.required + ": " + t.passwordPlaceholder);
                if (action === 'signup') {
                     if (password.length < 6) throw new Error("Password must be at least 6 characters.");
                     if (password !== confirmPass) throw new Error(t.passMismatch);
                }
            }

            if (action === 'signup') {
                if (!name) throw new Error(t.usernameRequired);
                if (name.length < 2) throw new Error(t.usernameMinLength);
            }

            const endpoint = `/auth/${action}`;
            let body: any = { email };

            if (action === 'login' || action === 'signup') {
                body.password = password;
                if (action === 'signup') body.name = name;
            }

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                // Specific handling for User Not Found
                if (data.code === 'USER_NOT_FOUND') {
                    throw new Error(t.userNotFound);
                }
                throw new Error(data.error || "Authentication failed");
            }

            if (action === 'forgot') {
                setResetSent(true);
            } else {
                onLoginSuccess(data.user);
                onClose();
            }

        } catch (err: any) {
            // Fallback for "Network Error" if backend is down - Simulate success for demo
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                 console.warn("Backend unavailable, using mock auth");
                 if (action === 'forgot') { setResetSent(true); }
                 else {
                     onLoginSuccess({ 
                         id: 'mock_user', 
                         email: email || 'mock@example.com', 
                         name: email ? email.split('@')[0] : 'Guest',
                         authType: 'email'
                     });
                     onClose();
                 }
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'}}>
            <div style={{...styles.glassPanel, maxWidth: '400px', width: '90%', padding: '30px', position: 'relative'}}>
                <button onClick={onClose} aria-label="Close" style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(231, 76, 60, 0.15)', border: '1px solid rgba(231, 76, 60, 0.4)', color: '#ff6b6b', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>&times;</button>
                
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.8rem', margin: 0}}>
                        {mode === 'login' ? t.login : mode === 'signup' ? t.signup : t.forgotPassword}
                    </h2>
                </div>

                {mode === 'forgot' ? (
                    <>
                        {!resetSent ? (
                            <>
                                <input type="email" placeholder={t.emailPlaceholder} style={styles.formInput} value={email} onChange={e => setEmail(e.target.value)} />
                                <button style={{...styles.button, width: '100%', marginTop: '10px'}} onClick={() => handleAuthAction('forgot')} disabled={loading}>
                                    {loading ? '...' : 'Reset Password'}
                                </button>
                            </>
                        ) : (
                            <div style={{textAlign: 'center', color: '#2ecc71', padding: '20px'}}>
                                <i className="fas fa-envelope" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                                <p>{t.resetSent}</p>
                            </div>
                        )}
                        <div style={{textAlign: 'center', marginTop: '15px'}}>
                            <span style={{color: theme.gold, cursor: 'pointer', fontSize: '0.9rem'}} onClick={() => { setMode('login'); setResetSent(false); }}>{t.backBtn}</span>
                        </div>
                    </>
                ) : (
                    <>
                        {mode === 'signup' && (
                            <input type="text" placeholder={t.username} style={styles.formInput} value={name} onChange={e => setName(e.target.value)} />
                        )}
                        <input type="email" placeholder={t.emailPlaceholder} style={styles.formInput} value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder={t.passwordPlaceholder} style={styles.formInput} value={password} onChange={e => setPassword(e.target.value)} />
                        
                        {mode === 'signup' && (
                            <input type="password" placeholder={t.confirmPassword} style={styles.formInput} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                        )}

                        {error && <div style={{color: '#e74c3c', fontSize: '0.8rem', marginBottom: '10px'}}>{error}</div>}

                        <button style={{...styles.button, width: '100%', marginTop: '10px'}} onClick={() => handleAuthAction(mode)} disabled={loading}>
                            {loading ? '...' : (mode === 'login' ? t.login : t.signup)}
                        </button>

                        <div style={{textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#aaa'}}>
                            {mode === 'login' ? (
                                <>
                                    <div style={{marginBottom: '10px', cursor: 'pointer', color: '#ccc'}} onClick={() => setMode('forgot')}>{t.forgotPassword}</div>
                                    {t.noAccount} <span style={{color: theme.gold, cursor: 'pointer'}} onClick={() => setMode('signup')}>{t.createAccount}</span>
                                </>
                            ) : (
                                <>
                                    {t.hasAccount} <span style={{color: theme.gold, cursor: 'pointer'}} onClick={() => setMode('login')}>{t.loginLink}</span>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- SETTINGS MODAL COMPONENT ---
const SettingsModal = ({ t, config, onSave, onClose }: { t: any, config: AppConfig, onSave: (c: AppConfig) => void, onClose: () => void }) => {
    const [localConfig, setLocalConfig] = useState<AppConfig>(config);
    const [msg, setMsg] = useState('');
    const isMounted = useRef(true);
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        isMounted.current = true;
        return () => { 
            isMounted.current = false; 
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleSave = () => {
        onSave(localConfig);
        setMsg(t.configSaved);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => { 
            if (isMounted.current) {
                setMsg(''); 
                onClose(); 
            }
        }, 1000);
    };

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'}}>
            <div style={{...styles.glassPanel, maxWidth: '500px', width: '90%'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <h2 style={{color: theme.gold, margin: 0, fontFamily: 'Cinzel, serif'}}>{t.settingsTitle}</h2>
                    <button onClick={onClose} style={{background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
                </div>
                <p style={{color: '#ccc', marginBottom: '20px', fontSize: '0.9rem'}}>{t.settingsDesc}</p>

                <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', color: theme.gold, marginBottom: '5px'}}>{t.textProvider}</label>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        {['Google', 'OpenAI', 'DeepSeek'].map(p => (
                            <button key={p} 
                                onClick={() => setLocalConfig({...localConfig, textProvider: p as any})}
                                style={{
                                    flex: 1, padding: '8px', 
                                    background: localConfig.textProvider === p ? theme.gold : 'transparent',
                                    color: localConfig.textProvider === p ? '#000' : theme.gold,
                                    border: `1px solid ${theme.gold}`, cursor: 'pointer', borderRadius: '4px'
                                }}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{marginBottom: '20px'}}>
                     <label style={{display: 'block', color: theme.gold, marginBottom: '5px'}}>API Keys</label>
                     <input type="password" placeholder={t.googleKeyPlaceholder} style={styles.formInput} value={localConfig.googleKey} onChange={e => setLocalConfig({...localConfig, googleKey: e.target.value})} />
                     <input type="password" placeholder={t.openaiKeyPlaceholder} style={styles.formInput} value={localConfig.openaiKey} onChange={e => setLocalConfig({...localConfig, openaiKey: e.target.value})} />
                     <input type="password" placeholder={t.deepseekKeyPlaceholder} style={styles.formInput} value={localConfig.deepseekKey} onChange={e => setLocalConfig({...localConfig, deepseekKey: e.target.value})} />
                </div>

                <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', color: theme.gold, marginBottom: '5px'}}>{t.imageProvider}</label>
                    <select style={styles.formInput} value={localConfig.imageProvider} onChange={e => setLocalConfig({...localConfig, imageProvider: e.target.value as any})}>
                        <option value="Pollinations">Pollinations AI (Default)</option>
                        <option value="DALL-E">DALL-E 3 (OpenAI)</option>
                        <option value="Sora2">Sora 2 (Video/Image Model)</option>
                    </select>
                </div>

                {msg && <div style={{color: '#2ecc71', textAlign: 'center', marginBottom: '10px'}}>{msg}</div>}

                <button style={{...styles.button, width: '100%'}} onClick={handleSave}>{t.saveConfig}</button>
            </div>
        </div>
    );
};

const App = () => {
  const isMounted = useRef(true);
  const uploadIntervalRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const toastTimeoutRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTextRef = useRef<{ chunks: string[]; index: number; isSpeaking: boolean }>({ chunks: [], index: 0, isSpeaking: false });

  useEffect(() => {
    isMounted.current = true;
    return () => { 
      isMounted.current = false; 
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      
      // Stop camera if running
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      } catch (e) {
        console.warn("Error stopping camera on unmount:", e);
      }

      // Cancel speech synthesis
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {
        console.warn("Error canceling speech synthesis on unmount:", e);
      }

      // Stop ambient music
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      } catch (e) {
        console.warn("Error pausing ambient music on unmount:", e);
      }
    };
  }, []);

  const [isAdminMode, setIsAdminMode] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => { setIsAdminMode(window.location.hash === '#admin'); };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [currentPage, setCurrentPage] = useState<'home' | 'analysis' | 'pricing' | 'shop' | 'product-detail' | 'about' | 'privacy' | 'terms' | 'refund' | 'history' | 'cart'>('home');
  const [selectedServiceTier, setSelectedServiceTier] = useState<ServiceTierOption | null>(null);
  const [unlockedTiers, setUnlockedTiers] = useState<string[]>([]);
  const [previousPageConfig, setPreviousPageConfig] = useState<{ page: any; view: any } | null>(null);
  const [cookieConsent, setCookieConsent] = useState<string | null>(localStorage.getItem('cookieConsent'));

  useEffect(() => {
    const gaId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID || 'G-DEFAULGAID';
    if (cookieConsent === 'accepted') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      const scriptConfig = document.createElement('script');
      scriptConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { 'anonymize_ip': true });
      `;
      document.head.appendChild(scriptConfig);
    }
  }, [cookieConsent]);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookieConsent('accepted');
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setCookieConsent('declined');
  };
  
  // Configuration State
  const [appConfig, setAppConfig] = useState<AppConfig>({
      textProvider: 'Google',
      imageProvider: 'Pollinations',
      googleKey: '',
      openaiKey: '',
      deepseekKey: ''
  });
  const [showSettings, setShowSettings] = useState(false);

  // Load Config from LocalStorage
  useEffect(() => {
      const savedConfig = localStorage.getItem('mystic_app_config');
      if (savedConfig) {
          setAppConfig(JSON.parse(savedConfig));
      }
  }, []);

  const saveConfig = (newConfig: AppConfig) => {
      setAppConfig(newConfig);
      localStorage.setItem('mystic_app_config', JSON.stringify(newConfig));
  };

  // Language Logic
  const detectLanguage = () => {
      return 'en';
  };

  const [language, setLanguage] = useState('en');
  // IMPORTANT: Ensure t updates correctly. If translations are missing, this fallback prevents crashes.
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  const [homepageConfigs, setHomepageConfigs] = useState<HomepageConfig[]>([]);

  useEffect(() => {
      const fetchHomepage = async () => {
          try {
              const data = await callBackendAPI('/homepage', {}, 'GET');
              if (isMounted.current && Array.isArray(data)) setHomepageConfigs(data);
          } catch (e) {
              console.warn("Could not fetch homepage config", e);
          }
      };
      fetchHomepage();
  }, []);

  // App State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [userState, setUserState] = useState<UserState>({ 
      trialStartDate: null, isSubscribed: false, hasPaidSingle: false, history: [], userId: '', isLoggedIn: false,
      dailyGenerations: {}, lastGenerationDate: '', totalTests: 0
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Generate a random User ID if not present (Simple Auth)
  useEffect(() => {
      let saved = localStorage.getItem('fortune_user_state_v4');
      let parsed = saved ? JSON.parse(saved) : null;
      
      if (!parsed) {
          parsed = { 
              trialStartDate: null, isSubscribed: false, hasPaidSingle: false, history: [],
              userId: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              isLoggedIn: false,
              dailyGenerations: {},
              lastGenerationDate: '',
              totalTests: 0
          };
      } else if (!parsed.userId) {
          parsed.userId = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      }
      setUserState(parsed);
  }, []);

  // Save basic state locally (subscription status)
  useEffect(() => { 
      if (userState.userId) {
          localStorage.setItem('fortune_user_state_v4', JSON.stringify(userState)); 
      }
  }, [userState]);

  // Handle Login and Sync State from Server Data
  const handleLoginSuccess = (user: any) => {
      const isSuper = Boolean(user?.isSuperUser || (user?.email && user.email.toLowerCase() === '314104801@qq.com'));
      setUserState(prev => ({
          ...prev,
          isLoggedIn: true,
          userId: user.id || prev.userId,
          email: user.email,
          name: user.name,
          authType: user.authType,
          // Sync Subscription Status from Server DB or Super User override
          isSubscribed: isSuper || user.isSubscribed || false,
          trialStartDate: user.trialStartDate || prev.trialStartDate,
          totalTests: user.totalTests !== undefined ? user.totalTests : prev.totalTests,
          hasPaidSingle: isSuper || user.hasPaidSingle || false,
          isSuperUser: isSuper,
          // Welcome free remains: defaulting to 3 (or unlimited for super user)
          freeFaceRemaining: isSuper ? 99999 : (user.freeFaceRemaining !== undefined ? user.freeFaceRemaining : 3),
          freePalmRemaining: isSuper ? 99999 : (user.freePalmRemaining !== undefined ? user.freePalmRemaining : 3)
      }));

      // If user had a pending payment plan (e.g. clicked unlock full report before login/signup), trigger payment modal now
      if (pendingPaymentPlan) {
          setSelectedPlan(pendingPaymentPlan);
          setShowPaymentModal(true);
          setPendingPaymentPlan(null);
      }
  };

  const handleLogout = () => {
      setUserState(prev => ({
          ...prev,
          isLoggedIn: false,
          email: undefined,
          name: undefined,
          authType: undefined,
          history: [], // Clear history on logout
          isSubscribed: false, // Reset subscription for guest
          hasPaidSingle: false
      }));
      // Generate new Guest ID
      const newGuestId = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setUserState(prev => ({ ...prev, userId: newGuestId }));
      setCurrentPage('home');
      setView('start');
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState<'start' | 'selection' | 'camera' | 'analyzing' | 'result'>('start');
  const [readingType, setReadingType] = useState<'face' | 'palm' | 'both'>('face'); 
  const [activeCameraSlot, setActiveCameraSlot] = useState<'face' | 'palm'>('face');
  const [bothStep, setBothStep] = useState<'none' | 'face' | 'face_captured' | 'palm' | 'palm_captured' | 'both_captured'>('none');
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAiAdvice, setBalanceAiAdvice] = useState<string | undefined>(undefined); 
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | Product | null>(null);
  const [pendingPaymentPlan, setPendingPaymentPlan] = useState<Plan | null>(null);
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
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [useAdvancedAnalysis, setUseAdvancedAnalysis] = useState(true);

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

  const getTotalTestsCount = () => {
      let count = 0;
      if (userState.dailyGenerations) {
          for (const day in userState.dailyGenerations) {
              count += userState.dailyGenerations[day] || 0;
          }
      }
      if (userState.history && userState.history.length > count) {
          count = userState.history.length;
      }
      if (userState.totalTests && userState.totalTests > count) {
          count = userState.totalTests;
      }
      return count;
  };

  const getDaysRemaining = () => {
      if (!userState.trialStartDate) return 3; 
      const start = new Date(userState.trialStartDate);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      const daysRemaining = 3 - (diffMs / (1000 * 60 * 60 * 24));
      return Math.max(0, Math.ceil(daysRemaining));
  };

  const getFreeTestsRemaining = () => {
      if (userState.isSubscribed || userState.hasPaidSingle) return 999;
      const totalTests = getTotalTestsCount();
      return Math.max(0, 3 - totalTests);
  };

  const getDailyFreeRemaining = () => {
      return getFreeTestsRemaining();
  };

  const switchLanguage = async (newLang: string) => {
      setLanguage(newLang);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      if (view === 'result' && resultText) {
          // Instant offline translation for Demo Mode to guarantee success without API limits
          if (resultText.includes("DEMO MODE") || resultText.includes("演示模式")) {
              const targetT = TRANSLATIONS[newLang] || TRANSLATIONS.en;
              const newHeaders = {
                  aura: targetT.reportHeaderAura, elements: targetT.reportHeaderElements, name: targetT.reportHeaderName, star: targetT.reportHeaderStar,
                  fortune: targetT.reportHeaderFortune, wealth: targetT.reportHeaderWealth, family: targetT.reportHeaderFamily, parents: targetT.reportHeaderParents,
                  advice: targetT.reportHeaderAdvice, health: targetT.reportHeaderHealth, love: targetT.reportHeaderLove, dailyLuck: targetT.reportHeaderDailyLuck,
                  palmLifeLine: targetT.palmLifeLine, palmHeadLine: targetT.palmHeadLine, palmHeartLine: targetT.palmHeartLine, palmFateLine: targetT.palmFateLine
              };
              
              const isZh = newLang.startsWith('zh');
              let newMockText = '';
              if (isZh) {
                  newMockText = `
## 🔮 ${newHeaders.aura}
（演示模式 - 离线/服务受限）
您的气场散发着宁静、稳定的金色能量。

## ⚖️ ${newHeaders.elements}
*   🪙 **${targetT.elementMetal || "金"}:** 40%
*   🌲 **${targetT.elementWood || "木"}:** 15%
*   💧 **${targetT.elementWater || "水"}:** 25%
*   🔥 **${targetT.elementFire || "火"}:** 10%
*   ⛰️ **${targetT.elementEarth || "土"}:** 10%

## 📜 ${newHeaders.advice}
**${targetT.adviceCategoryDiet || "饮食建议"}**: 多吃根茎类蔬菜，保持膳食平衡。
**${targetT.adviceCategoryHome || "居家风水"}**: 在房屋中央放置一块水晶。
**${targetT.adviceCategoryJewelry || "幸运配饰"}**: 佩戴金饰或银饰。
Google AI 服务目前在您的地区不可用。这是测算结果排版设计的演示。
                  `.trim();
              } else {
                  newMockText = `
## 🔮 ${newHeaders.aura}
(DEMO MODE - LOCATION BLOCKED)
Your aura radiates with a calm, stable golden energy.

## ⚖️ ${newHeaders.elements}
*   🪙 **${targetT.elementMetal}:** 40%
*   🌲 **${targetT.elementWood}:** 15%
*   💧 **${targetT.elementWater}:** 25%
*   🔥 **${targetT.elementFire}:** 10%
*   ⛰️ **${targetT.elementEarth}:** 10%

## 📜 ${newHeaders.advice}
**${targetT.adviceCategoryDiet}**: Eat balanced meals with more root vegetables.
**${targetT.adviceCategoryHome}**: Place a crystal in the center of your home.
**${targetT.adviceCategoryJewelry}**: Wear Gold or Silver.
Google AI services are currently unavailable in your region.
This is a demonstration of the result layout.
                  `.trim();
              }
              setResultText(newMockText);
              return;
          }

          setIsTranslating(true);
          try {
              const prompt = `Translate the following markdown text to ${newLang}. Preserve all formatting, emojis, and headers exactly. Text:\n\n${resultText}`;
              const translatedText = await callWithRetry(() => AIService.callAI(prompt, undefined, appConfig), 5, 2000, (retryMsg) => console.log("Translating wait: " + retryMsg));
              
              if (translatedText) setResultText(translatedText);
          } catch (e: any) {
               console.warn("Translation failed:", e.message);
          } finally {
              setIsTranslating(false);
          }
      }
  };

  const stopCamera = () => { 
      if (videoRef.current && videoRef.current.srcObject) { 
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop()); 
          videoRef.current.srcObject = null; 
      } 
  };

  const startCamera = async (type: 'face' | 'palm') => {
    // SECURITY CHECK for Mobile Chrome
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        alert("Secure context required. Please use HTTPS to access camera on mobile devices.");
        return;
    }

    setActiveCameraSlot(type);
    if (readingType !== 'both') {
      setReadingType(type);
    }
    if (useAdvancedAnalysis && !birthDate) { alert("Please complete your birth date."); return; }
    
    // Stop any previous stream
    stopCamera();

    setView('camera'); 
    if (!isPlayingMusic) setIsPlayingMusic(true);
    
    try { 
        // Force User Camera for Face, Environment for Palm (if available)
        // Explicitly set audio: false to prevent permission issues on some Android browsers
        const constraints = {
            audio: false,
            video: {
                facingMode: type === 'face' ? 'user' : 'environment'
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints); 
        
        // Wait for next tick/render to ensure ref is populated
        setTimeout(async () => {
            if (!isMounted.current) {
                try {
                    stream.getTracks().forEach(track => track.stop());
                } catch (e) {
                    console.error("Stop tracks error", e);
                }
                return;
            }
            if (videoRef.current) { 
                videoRef.current.srcObject = stream; 
                try {
                    await videoRef.current.play();
                } catch (e) {
                    console.error("Play error", e);
                }
            } 
        }, 100);

    } catch (err: any) { 
        console.warn("Camera Init Error, trying fallback", err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            alert("Camera access denied. Please allow camera permissions in your browser settings.");
            setView('selection');
            return;
        }

        try {
             // Fallback to basic constraint if facingMode fails
             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); 
             setTimeout(async () => {
                 if (!isMounted.current) {
                     try {
                         stream.getTracks().forEach(track => track.stop());
                     } catch (e) {
                         console.error("Stop tracks error", e);
                     }
                     return;
                 }
                 if (videoRef.current) { 
                     videoRef.current.srcObject = stream; 
                     try { await videoRef.current.play(); } catch(e) { console.error(e); }
                 } 
             }, 100);
        } catch (e: any) {
            alert(`Camera Error: ${e.name || e.message}. Please check browser permissions.`); 
            setView('selection');
        }
    }
  };
  
  const handleSubmitSingleAnalysis = () => {
    if (useAdvancedAnalysis && (!dobYear || !dobMonth || !dobDay)) {
      alert(language.startsWith('zh') ? "请先完整填写出生日期信息。" : "Please complete your birth date first.");
      return;
    }
    const targetImage = readingType === 'face' ? faceImage : palmImage;
    if (!targetImage) {
      alert(language.startsWith('zh') ? "请先完成照片采集！" : "Please complete photo capture first!");
      return;
    }
    processImage(targetImage);
  };

  const handleSubmitDualAnalysis = () => {
    if (useAdvancedAnalysis && (!dobYear || !dobMonth || !dobDay)) {
      alert(language.startsWith('zh') ? "请先完整填写出生日期信息。" : "Please complete your birth date first.");
      return;
    }
    if (!faceImage || !palmImage) {
      alert(language.startsWith('zh') ? "请先完成面部和手掌两张照片的采集！" : "Please complete both face and palm photo captures first!");
      return;
    }
    processImage(palmImage, faceImage);
  };

  const handleCapturedImage = (dataUrl: string, targetSlot?: 'face' | 'palm') => {
    setImage(dataUrl);
    const slot = targetSlot || activeCameraSlot;
    if (readingType === 'both') {
      if (slot === 'face') {
        setFaceImage(dataUrl);
        setBothStep(palmImage ? 'both_captured' : 'palm');
      } else {
        setPalmImage(dataUrl);
        setBothStep(faceImage ? 'both_captured' : 'face');
      }
    } else if (readingType === 'face') {
      setFaceImage(dataUrl);
    } else if (readingType === 'palm') {
      setPalmImage(dataUrl);
    }
    stopCamera();
    setView('selection');
  };

  const capturePhoto = async (): Promise<boolean> => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      if (video.readyState < 2) return false;
      
      const canvas = canvasRef.current; 
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      const targetWidth = 1024;
      const targetHeight = (videoHeight / videoWidth) * targetWidth;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d'); 
      if (ctx) { 
          const slot = activeCameraSlot;
          if (slot === 'face' || readingType === 'face') {
              ctx.translate(canvas.width, 0); 
              ctx.scale(-1, 1); 
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8); 
          stopCamera();
          handleCapturedImage(dataUrl, slot);
          return true;
      }
    }
    return false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetSlot?: 'face' | 'palm') => {
    if (useAdvancedAnalysis && (!dobYear || !dobMonth || !dobDay)) { alert("Please complete your birth date."); e.target.value = ''; return; }
    if (!isPlayingMusic) setIsPlayingMusic(true);
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0); 
      const reader = new FileReader(); 
      let progress = 0;
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = setInterval(() => { 
          progress += 10; 
          if (isMounted.current) setUploadProgress(Math.min(progress, 99)); 
      }, 30);
      reader.onloadend = async () => { 
          if (uploadIntervalRef.current) {
              clearInterval(uploadIntervalRef.current);
              uploadIntervalRef.current = null;
          }
          if (isMounted.current) setUploadProgress(100); 
          let dataUrl = reader.result as string; 
          dataUrl = await resizeImage(dataUrl);
          setTimeout(() => { 
              if (isMounted.current) {
                  setUploadProgress(0); 
                  const slot = targetSlot || activeCameraSlot;
                  handleCapturedImage(dataUrl, slot); 
              }
          }, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- DEMO / MOCK GENERATOR FOR ERROR FALLBACK ---
  const getMockResult = (headers: any) => {
      const isZh = language.startsWith('zh');
      if (isZh) {
          return `
## 🔮 ${headers.aura}
（演示模式 - 离线/服务受限）
您的气场散发着宁静、稳定的金色能量。

## ⚖️ ${headers.elements}
*   🪙 **${t.elementMetal || "金"}:** 40%
*   🌲 **${t.elementWood || "木"}:** 15%
*   💧 **${t.elementWater || "水"}:** 25%
*   🔥 **${t.elementFire || "火"}:** 10%
*   ⛰️ **${t.elementEarth || "土"}:** 10%

## 📜 ${headers.advice}
**${t.adviceCategoryDiet || "饮食建议"}**: 多吃根茎类蔬菜，保持膳食平衡。
**${t.adviceCategoryHome || "居家风水"}**: 在房屋中央放置一块水晶。
**${t.adviceCategoryJewelry || "幸运配饰"}**: 佩戴金饰或银饰。
Google AI 服务目前在您的地区不可用。这是测算结果排版设计的演示。
          `.trim();
      }
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
**${t.adviceCategoryDiet}**: Eat balanced meals with more root vegetables.
**${t.adviceCategoryHome}**: Place a crystal in the center of your home.
**${t.adviceCategoryJewelry}**: Wear Gold or Silver.
Google AI services are currently unavailable in your region.
This is a demonstration of the result layout.
      `.trim();
  };

  const processImage = async (base64Image: string, faceImgOverride?: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const isZh = language.startsWith('zh');

    // Free scan flow: Allow non-subscribed & non-logged-in users to perform scans without payment prompt beforehand.
    // 30% preview restriction is applied when viewing the result.

    // Initialize trialStartDate upon first test if not set yet
    if (!userState.trialStartDate) {
        setUserState(prev => ({
            ...prev,
            trialStartDate: new Date().toISOString()
        }));
    }

    // Reset single payment state on consumption
    if (userState.hasPaidSingle) { 
        setUserState(prev => ({ ...prev, hasPaidSingle: false })); 
    }

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
    
    // Faster progress bar: reach 90% in ~5 seconds
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => { 
        if (!isMounted.current) { 
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            return; 
        }
        setAnalysisProgress(prev => {
            const next = prev < 30 ? prev + 3 : (prev < 70 ? prev + 1.5 : (prev < 95 ? prev + 0.5 : prev));
            
            // Update message based on the NEXT value
            if (next > 80) setLoadingMessage(t.analyzingStep4 || "Finalizing destiny...");
            else if (next > 50) setLoadingMessage(t.analyzingStep3 || "Calculating elemental balance...");
            else if (next > 20) setLoadingMessage(t.analyzingStep2 || "Mapping facial features...");
            else setLoadingMessage(t.analyzingStep1 || "Connecting to celestial energy...");
            
            return next;
        }); 
    }, 100);

    const langConfig = LANGUAGES.find(l => l.code === language);
    // Explicitly tell AI the target language to reduce translation needs
    const targetLangName = langConfig?.label || 'English';
    const targetLangCode = langConfig?.code || 'en';

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
      let imageInputForAI: string | string[] = base64Data;

      if (readingType === 'both') {
           const fImg = (faceImgOverride || faceImage || '').replace(/^data:image\/\w+;base64,/, '');
           const pImg = base64Data;
           imageInputForAI = [fImg, pImg].filter(Boolean);

           prompt = `
            You are a supreme grandmaster of both Mianxiang (Face Reading) and Chiromancy (Palmistry), possessing quantum bio-scanner algorithms and ancient Taoist metaphysics. User: ${gender}. Date: ${currentDateStr}.${height ? ` Height: ${height}cm.` : ''}${weight ? ` Weight: ${weight}kg.` : ''}
            You have received TWO images: Image 1 is the FACE, and Image 2 is the PALM.

            CRITICAL DIRECTIVES:
            1. Make the analysis extremely rich, highly detailed, exhaustive, and beautifully written with high literary flair. Write long, complete paragraphs for every single section.
            2. First major section MUST analyze the FACE (12 Palaces, facial structure, complexion, nose of wealth, eye spirit).
            3. Second major section MUST analyze the PALM (Life Line, Wisdom/Head Line, Heart Line, Fate Line, Palm Mounts).
            4. Final major section MUST provide an OVERALL COMBINED CONCLUSION (Master Synthesis) cross-referencing facial features with palmistry lines to reveal their ultimate destiny, career trajectory, emotional fortune, and holistic energetic balance.

            Structure:
            ## 👤 ${t.faceAnalysisSection || '面部分析结果'}
            (Detailed analysis of facial structure, 12 palaces, nose, eyes, and facial aura...)

            ## ✋ ${t.palmAnalysisSection || '掌纹分析结果'}
            (Detailed analysis of Life Line, Wisdom Line, Heart Line, Fate Line, and Palm Mounts...)

            ## 🔮 ${t.overallConclusionSection || '双相合璧·总分析结论'}
            (Exhaustive final conclusion cross-referencing face and palm insights to synthesize ultimate destiny, wealth peaks, career paths, and relationship timing...)

            ## ⚖️ ${headers.elements} ... (Include emojis 🪙, 🌲, 💧, 🔥, ⛰️)

            ## 📜 ${headers.advice}
            Based on both face and palm analysis above, provide extremely detailed personalized actionable advice:
            *   **${t.adviceCategoryDiet}**: (Bio-energetic nutrients)
            *   **${t.adviceCategoryHome}**: (Feng Shui spatial guidance)
            *   **${t.adviceCategoryJewelry}**: (Amulets & gemstones)
            *   **${t.namingAdvice}**: (Destiny mindset alignment)

            IMPORTANT: Output STRICTLY in ${targetLangName} (${targetLangCode}).
           `;
           if (useAdvancedAnalysis && wuXingResult) {
               prompt += ` Context: Born ${birthDate}. WuXing: Metal:${wuXingResult.scores.Metal}%, Wood:${wuXingResult.scores.Wood}%, Water:${wuXingResult.scores.Water}%, Fire:${wuXingResult.scores.Fire}%, Earth:${wuXingResult.scores.Earth}%. Weak: ${wuXingResult.missingElement}. Zodiac: ${starSign}. Name: ${userName}. Add combined analysis for these.`;
           }
      } else if (readingType === 'palm') {
           prompt = `
            You are a supreme grandmaster of Palmistry, commanding state-of-the-art quantum cybernetic bio-mapping scanners and ancient esoteric Taoist magic. User: ${gender}. Date: ${currentDateStr}.${height ? ` Height: ${height}cm.` : ''}${weight ? ` Weight: ${weight}kg.` : ''}
            Analyze Life Line, Head Line, Heart Line, Fate Line.

            CRITICAL DIRECTIVES:
            1. DO NOT INCLUDE ANY FACE OR FACIAL FEATURE ANALYSIS DATA IN THIS PALM READING. FOCUS EXCLUSIVELY ON PALMISTRY (PALM LINES, MOUNTS, HAND TOPOGRAPHY, AND HAND GEOMETRY).
            2. Make the analysis extremely rich, highly detailed, exhaustive, and beautifully written with high literary flair. Write long, complete paragraphs for every single section. Do NOT write short summaries.
            3. Infuse the reading with both MYSTICAL/FANTASY elements (ancient Taoist sorcery, celestial alignments, astral threads, soul contracts, Qi meridian paths, ancestral karma) and HIGH-TECH/SCIENTIFIC elements (quantum resonance frequency, holographic palm topography, biophoton emission dynamics, neural path mapping, holographic spatial matrix, timeline probability branches, spatial frequency vector fields).
            4. Intelligently connect their physical metrics (${height ? `${height}cm height` : 'N/A'}, ${weight ? `${weight}kg weight` : 'N/A'}) to their constitutional vitality, metabolic Qi, and cellular reserve analysis in the Life Line section.
            
            Structure:
            ## 🔮 ${headers.dailyLuck} ...
            ## 🧬 ${headers.palmLifeLine} ...
            ## 🧠 ${headers.palmHeadLine} ...
            ## ❤️ ${headers.palmHeartLine} ...
            ## 🛤️ ${headers.palmFateLine} ...
            ## ⚖️ ${headers.elements} ...
            
            ## 📜 ${headers.advice}
            Based on the palm analysis above, provide extremely detailed, personalized actionable advice:
            *   **${t.adviceCategoryDiet}**: (Specific foods and bio-energetic nutrients, customized for their physical build of ${height || 'N/A'}cm and ${weight || 'N/A'}kg)
            *   **${t.adviceCategoryHome}**: (Feng Shui spatial vortex corrections and geomantic arrangements)
            *   **${t.adviceCategoryJewelry}**: (Lucky crystalline energy transmitters and astral talismans)
            *   **${t.namingAdvice}**: (Quantum cosmic philosophy and mind alignment)
            
            IMPORTANT: Output STRICTLY in ${targetLangName} (${targetLangCode}).
           `;
      } else {
          prompt = `
            You are a supreme grandmaster of Mianxiang (Face Reading), possessing both legendary Eastern mystical vision and future quantum cyber-genetic facial structure scanners. User: ${gender}. Date: ${currentDateStr}.${height ? ` Height: ${height}cm.` : ''}${weight ? ` Weight: ${weight}kg.` : ''}
            Analyze face.

            CRITICAL DIRECTIVES:
            1. Make the analysis extremely rich, highly detailed, exhaustive, and beautifully written with high literary flair. Write long, complete paragraphs for every single section. Do NOT write short summaries.
            2. Infuse the reading with both MYSTICAL/FANTASY elements (primordial Qi flows, celestial constellation resonance, spiritual aura of Yin-Yang, Daoist cosmic destiny, karmic threads of the soul) and HIGH-TECH/SCIENTIFIC elements (quantum biophotonic emission spectrum, micro-expression algorithmic mapping, cybernetic facial-surface topography, spatial energy vector fields, neural network probability curves, timeline state vector collapses).
            3. Intelligently connect their physical metrics (${height ? `${height}cm height` : 'N/A'}, ${weight ? `${weight}kg weight` : 'N/A'}) to their bone density, facial muscle tone, constitutional health, and elemental balance in the general aura analysis.

            Structure:
            ## 🔮 ${headers.aura} ...
            ## ⚖️ ${headers.elements} ... (Include emojis 🪙, 🌲, 💧, 🔥, ⛰️)
            ## 📅 ${headers.fortune} ...
            ## 💰 ${headers.wealth} ...
            ## 🏠 ${headers.family} ...
            ## 👴 ${headers.parents} ...
            
            ## 📜 ${headers.advice}
            Based on the face analysis above (e.g. eyes, nose, complexion), provide specific, highly detailed personalized actionable advice in a list format:
            *   **${t.adviceCategoryFiveElements}**: (Analyze the user's specific quantum elemental balance based on face shape and elemental signatures)
            *   **${t.adviceCategoryDiet}**: (Specific bio-energetic foods to adjust and heal their specific face reading weaknesses, customized for their physical build of ${height || 'N/A'}cm and ${weight || 'N/A'}kg)
            *   **${t.adviceCategoryHome}**: (Geomantic Feng Shui spatial arrangements and frequency optimization for their specific situation)
            *   **${t.adviceCategoryJewelry}**: (Specific crystalline resonance transmitters or amulets to wear for protection and amplification)
            
            IMPORTANT: Output STRICTLY in ${targetLangName} (${targetLangCode}).
          `;
          if (useAdvancedAnalysis && wuXingResult) {
              prompt += ` Context: Born ${birthDate}. WuXing: Metal:${wuXingResult.scores.Metal}%, Wood:${wuXingResult.scores.Wood}%, Water:${wuXingResult.scores.Water}%, Fire:${wuXingResult.scores.Fire}%, Earth:${wuXingResult.scores.Earth}%. Weak: ${wuXingResult.missingElement}. Zodiac: ${starSign}. Name: ${userName}.${height ? ` Height: ${height}cm.` : ''}${weight ? ` Weight: ${weight}kg.` : ''} Add analysis for these.`;
          }
      }

      const result = await callWithRetry(() => AIService.callAI(prompt, imageInputForAI, appConfig, userState.userId), 2, 1500, (retryMsg) => {
          if (isMounted.current) setLoadingMessage(retryMsg);
      });
      
      if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
      }
      if (!isMounted.current) return;

      setAnalysisProgress(100);
      setLoadingMessage("");
      await new Promise(resolve => setTimeout(resolve, 600));
      if (!isMounted.current) return;
      
      const newResultText = result || "Destiny unclear.";
      setResultText(newResultText);
      
      // Save to History via Backend
      if (userState.userId) {
          try {
              const responseData = await callBackendAPI('/history', {
                  userId: userState.userId,
                  resultText: newResultText,
                  gender,
                  name: userName,
                  birthDate,
                  readingType,
                  elements: wuXingResult
              });
              if (responseData && responseData.user) {
                  setUserState(prev => ({
                      ...prev,
                      freeFaceRemaining: responseData.user.freeFaceRemaining,
                      freePalmRemaining: responseData.user.freePalmRemaining,
                      trialStartDate: responseData.user.trialStartDate || prev.trialStartDate,
                      totalTests: responseData.user.totalTests !== undefined ? responseData.user.totalTests : prev.totalTests
                  }));
              }
          } catch (e) {
              console.warn("Failed to save history to backend", e);
          }
      }

      // Update UI state here for immediate feedback
      const newHistoryItem: HistoryRecord = {
          id: Date.now(),
          date: now.toLocaleDateString(),
          resultText: newResultText,
          elements: wuXingResult,
          name: userName,
          gender: gender,
          birthDate: birthDate || "Not Provided",
          readingType: readingType
      };
      // Optimistic Update
      setUserState(prev => {
          const todayStr = new Date().toISOString().split('T')[0];
          const newDaily = { ...(prev.dailyGenerations || {}) };
          newDaily[todayStr] = (newDaily[todayStr] || 0) + 1;
          const currentTotal = prev.totalTests !== undefined ? prev.totalTests : 0;
          
          return { 
              ...prev, 
              history: [newHistoryItem, ...(prev.history || [])].slice(0, 5),
              dailyGenerations: newDaily,
              lastGenerationDate: now.toISOString(),
              totalTests: currentTotal + 1
          };
      });
      
      setView('result');
    } catch (error: any) { 
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        setAnalysisProgress(0);
        setLoadingMessage("");
        
        console.error("Analysis Error:", error);
        const errorMsg = error?.message || String(error);
        
        // Graceful fallback to local Demo Mode for ALL errors (such as location block, missing API key, network timeout)
        const mockText = getMockResult(headers);
        setResultText(mockText);
        if (!calculatedElements) {
            setCalculatedElements({ 
                scores: { Metal: 22, Wood: 25, Water: 15, Fire: 18, Earth: 20 }, 
                missingElement: 'Water' 
            });
        }
        setView('result');
        console.warn(`[Analysis Fallback] ${errorMsg}. Switched to offline celestial mode.`);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speakTextRef.current.isSpeaking = false;
    speakTextRef.current.chunks = [];
    speakTextRef.current.index = 0;
    setIsSpeaking(false);
  };

  const startSpeaking = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean up markdown layout characters
    const cleanedText = text.replace(/[#*`~]/g, ' ').replace(/\s+/g, ' ');
    
    // Split the text into natural sentence-level chunks to prevent browser buffer distortion
    const sentenceBoundary = /([.!?。！？；;\n]+)/g;
    const rawChunks = cleanedText.split(sentenceBoundary);
    
    const chunks: string[] = [];
    let temp = "";
    for (const part of rawChunks) {
      if (!part) continue;
      if (part.trim().match(/^[.!?。！？；;\n]+$/)) {
        temp += part;
        if (temp.trim().length > 0) {
          chunks.push(temp.trim());
        }
        temp = "";
      } else {
        if (temp.trim().length > 0) {
          chunks.push(temp.trim());
          temp = "";
        }
        temp = part;
      }
    }
    if (temp.trim().length > 0) {
      chunks.push(temp.trim());
    }

    if (chunks.length === 0) return;

    speakTextRef.current = { chunks, index: 0, isSpeaking: true };
    setIsSpeaking(true);
    speakNextChunk();
  };

  const speakNextChunk = () => {
    const state = speakTextRef.current;
    if (!state.isSpeaking || state.index >= state.chunks.length) {
      setIsSpeaking(false);
      state.isSpeaking = false;
      return;
    }

    const chunkText = state.chunks[state.index];
    if (!chunkText || chunkText.trim().length === 0) {
      state.index++;
      speakNextChunk();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunkText);
    
    // Middle-aged calm, wise and magnetic tone values
    utterance.pitch = 0.82; // Deep and resonant
    utterance.rate = 0.85;  // Calm, deliberate, non-distorted pacing

    const voices = window.speechSynthesis.getVoices();
    
    // Determine the language prefix or the best match voiceCode
    const currentLangConfig = LANGUAGES.find(l => l.code === language);
    const targetVoiceCode = currentLangConfig?.voiceCode || 'en-US';
    
    // Choose voice based on user selected language
    let selectedVoice = null;
    
    if (targetVoiceCode.startsWith('zh')) {
        // Find high-quality Chinese voice
        const preferredZhKeywords = ['xiaoxiao', 'yunting', 'huihui', 'kangkang', 'yaoyao', 'google', 'liaoliao', 'standard', 'male', 'female'];
        for (const kw of preferredZhKeywords) {
            selectedVoice = voices.find(v => (v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().startsWith('cn') || v.lang.toLowerCase().startsWith('tw')) && v.name.toLowerCase().includes(kw));
            if (selectedVoice) break;
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => (v.lang.toLowerCase().startsWith('zh') || v.lang.toLowerCase().startsWith('cn') || v.lang.toLowerCase().startsWith('tw')));
        }
    } else {
        // Prioritize high-quality, magnetic foreign (English/US/UK) male voices
        const preferredMaleKeywords = [
          'google uk english male', 
          'microsoft david', 
          'david', 
          'guy', 
          'daniel', 
          'brian', 
          'andrew', 
          'male', 
          'natural'
        ];
        for (const kw of preferredMaleKeywords) {
          selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(kw));
          if (selectedVoice) break;
        }
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
        }
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = targetVoiceCode;
    }

    utterance.onend = () => {
      state.index++;
      speakNextChunk();
    };

    utterance.onerror = (e) => {
      console.warn("Speech Synthesis error", e);
      state.index++;
      speakNextChunk();
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      if (!resultText) return;
      startSpeaking(resultText);
    }
  };
  
  // Updated: Only used for loading from history list now, passes record to RenderHistoryView logic internally
  const handleLoadHistory = (record: HistoryRecord) => {
      // Logic handled inside RenderHistoryView now, this might not be needed or just reused
  };

  const handleUnsubscribe = async () => {
      try {
          const response = await fetch('/api/user/unsubscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: userState.id })
          });
          const data = await response.json();
          if (response.ok) {
              setUserState(prev => ({
                  ...prev,
                  isSubscribed: false,
                  subscriptionPlan: '',
                  subscribedAt: null,
                  subscriptionExpiresAt: null
              }));
              alert("Your active subscription has been manually cancelled successfully!");
          } else {
              alert(data.error || "Failed to cancel subscription.");
          }
      } catch (err: any) {
          console.error("Unsubscribe error:", err);
          alert("Failed to connect to the server: " + err.message);
      }
  };

  const handleOpenBalance = (aiAdvice?: string) => {
      setBalanceAiAdvice(aiAdvice); 
      setShowBalanceModal(true); 
  };

  const handleAddToCart = (product: Product) => { 
      setCart(prev => { 
          const existing = prev.find(item => item.product.id === product.id); 
          if (existing) { 
              return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item); 
          } 
          return [...prev, { product, quantity: 1 }]; 
      }); 
      setShowToast(true); 
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
          if (isMounted.current) setShowToast(false);
      }, 2000);
  };
  const handleRemoveFromCart = (productId: string) => { setCart(prev => prev.filter(item => item.product.id !== productId)); };
  
  const handleCartCheckout = (total: number) => {
      const cartPlan: any = { id: 'cart_checkout', title: 'Cart Checkout', price: `$${total.toFixed(2)}`, desc: 'Items from Spiritual Shop', isSub: false, category: 'cart_mixed' };
      setSelectedPlan(cartPlan); setShowPaymentModal(true);
  };

  const handleBuyProduct = (product: Product) => { setShowBalanceModal(false); setSelectedProduct(null); setSelectedPlan(product); setShowPaymentModal(true); };
  
  const handleViewProduct = (product: Product) => { 
      setPreviousPageConfig({ page: currentPage, view: view });
      setSelectedProduct(product); 
      setCurrentPage('product-detail'); 
      setView('start'); 
  };

  const handleExplore = (type?: 'face' | 'palm' | 'both' | 'shop') => {
      if (type === 'shop') {
          setCurrentPage('shop');
      } else if (type === 'palm' || type === 'face' || type === 'both') {
          setReadingType(type);
          setFaceImage(null);
          setPalmImage(null);
          setImage(null);
          setResultText("");
          if (type === 'both') {
              setBothStep('face');
          }
          setView('selection');
          setCurrentPage('analysis');
      } else {
          setCurrentPage('analysis');
      }
  };

  const handlePaymentSuccess = async (paymentDetails?: any, planOverride?: any) => { 
      const activePlan = planOverride || selectedPlan;
      if (!activePlan) return; 
      
      try {
          let orderItems = "";
          let total = 0;
          if (activePlan.id === 'cart_checkout') {
              orderItems = cart.map(c => `${c.product.defaultName} x${c.quantity}`).join(', ');
              total = cart.reduce((acc, c) => acc + (c.product.numericPrice * c.quantity), 0);
          } else {
              orderItems = 'defaultName' in activePlan ? (activePlan as Product).defaultName : (activePlan as Plan).title;
              total = parseFloat(activePlan.price.replace(/[^0-9.]/g, ''));
          }

          const shipping = paymentDetails?.shipping || {};
          const contact = paymentDetails?.contact || {};
          
          const newOrder: Partial<Order> = {
              customerName: shipping.name || 'Guest User',
              items: orderItems,
              total: total,
              shippingAddress: shipping.address ? `${shipping.address}, ${shipping.city}` : 'Digital',
              paymentMethod: paymentDetails?.method || 'unknown',
              email: contact.email || userState.email, // Use logged in email if available
              phone: contact.phone
          };
          
          // Call Backend OR Fallback
          await callBackendAPI('/orders', newOrder);

      } catch (e) {
          console.error("Failed to save order", e);
      }

      // Update Client State
      if (selectedServiceTier) {
          setUnlockedTiers(prev => [...prev, selectedServiceTier.id]);
      }

      if (activePlan.id === 'cart_checkout') { 
          setCart([]); 
          setCurrentPage('home'); 
          setView('start'); 
      } else if ('isSub' in activePlan || activePlan.id === 'single') { 
          if (activePlan.id === 'single') {
              setUserState(prev => ({ ...prev, hasPaidSingle: true })); 
          } else {
              setUserState(prev => ({ ...prev, isSubscribed: true })); 
          }
      }
      
      alert(t.success); 
      setShowPaymentModal(false); 
      setShowPaywall(false);
      if (currentPage === 'pricing') handleGoHome(); 
  };

  const handleSelectTierAndStart = (tier: ServiceTierOption) => {
      setSelectedServiceTier(tier);
      setReadingType(tier.type === 'combined' ? 'face' : tier.type);
      setCurrentPage('analysis');
      setView('selection');
  };

  const handleUnlockTier = (tier: ServiceTierOption) => {
      setSelectedPlan({
          id: tier.id,
          title: tier.title,
          price: tier.price,
          desc: tier.description,
          isSub: false
      });
      setShowPaymentModal(true);
  };
  
  const handleGoHome = () => { 
      stopCamera(); 
      window.speechSynthesis.cancel(); 
      setIsSpeaking(false); 
      setShowPaywall(false); 
      setShowBalanceModal(false); 
      setShowPaymentModal(false); 
      setSelectedProduct(null); 
      setCurrentPage('home'); 
      setView('start'); 
      setUploadProgress(0); 
      setAnalysisProgress(0); 
      setImage(null);
      setResultText("");
  };

  const getNavLinkStyle = (page: string) => ({ ...styles.navLink, color: currentPage === page ? theme.gold : theme.text, borderBottom: currentPage === page ? `2px solid ${theme.gold}` : 'none' });

  const triggerPayment = async (plan: Plan) => { 
      if (!userState.isLoggedIn) {
          alert(t.loginRequired || "Please login to subscribe.");
          setShowAuthModal(true);
          return;
      }

      if (plan.priceId) {
          try {
              const res = await fetch(`${API_BASE_URL}/create-checkout-session`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      priceId: plan.priceId,
                      email: userState.email,
                      userId: userState.userId,
                      planType: plan.id.includes('month') ? 'monthly' : (plan.id.includes('year') ? 'yearly' : 'single')
                  })
              });
              if (res.ok) {
                  const { url } = await res.json();
                  window.location.href = url; // Redirect to Stripe
                  return;
              }
          } catch (e) {
              console.error("Stripe Error:", e);
          }
      }

      setSelectedPlan(plan); 
      setShowPaymentModal(true); 
  };

  if (isAdminMode) {
      return (
          <div style={styles.appContainer}>
               <div style={{
                    padding: '20px', 
                    borderBottom: `1px solid ${theme.darkGold}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box'
               }}>
                    <div style={{width: '120px'}} />{/* Spacer */}
                    <h1 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '2rem', margin: 0, textAlign: 'center'}}>Mystic Admin</h1>
                    <button 
                         onClick={() => { window.location.hash = ''; setIsAdminMode(false); }} 
                         style={{
                              ...styles.secondaryButton, 
                              margin: 0,
                              borderColor: theme.gold,
                              color: theme.gold,
                              padding: '8px 16px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer'
                         }}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Site
                    </button>
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
             <span style={getNavLinkStyle('home')} onClick={() => { setCurrentPage('home'); setView('start'); }}>{t.home}</span>
             <span style={getNavLinkStyle('analysis')} onClick={() => { setCurrentPage('analysis'); setView('start'); }}>{t.navAnalysis}</span>
             <span style={getNavLinkStyle('pricing')} onClick={() => { setCurrentPage('pricing'); setView('start'); }}>{t.pricing}</span>
             <span style={getNavLinkStyle('shop')} onClick={() => { setCurrentPage('shop'); setView('start'); }}>{t.shop}</span>
             <span style={getNavLinkStyle('about')} onClick={() => { setCurrentPage('about'); setView('start'); }}>{t.about}</span>
             <div style={{position: 'relative', cursor: 'pointer', marginLeft: '10px', marginRight: '5px'}} onClick={() => { setCurrentPage('cart'); setView('start'); }}>
                 <i className="fas fa-shopping-cart" style={{color: theme.gold}}></i>
                 {cart.length > 0 && <span style={{position: 'absolute', top: '-8px', right: '-8px', background: '#c0392b', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cart.reduce((a,c) => a + c.quantity, 0)}</span>}
             </div>
             
             {/* LOGIN BUTTON / USER INFO */}
             {userState.isLoggedIn ? (
                 <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '10px'}}>
                     <div 
                         onClick={() => { setCurrentPage('history'); setView('start'); }}
                         style={{
                             display: 'flex', 
                             alignItems: 'center', 
                             gap: '8px', 
                             cursor: 'pointer', 
                             background: 'rgba(212, 175, 55, 0.12)', 
                             border: `1px solid ${theme.darkGold}`, 
                             borderRadius: '20px', 
                             padding: '4px 12px',
                             transition: 'background 0.3s'
                         }}
                         title="My Account: View ID, Cart, Orders, & Address Info"
                     >
                         <div style={{
                             width: '22px', 
                             height: '22px', 
                             borderRadius: '50%', 
                             background: theme.gold, 
                             color: '#000', 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center', 
                             fontWeight: 'bold', 
                             fontSize: '0.8rem'
                         }}>
                             {((userState.name || 'U')[0] || 'U').toUpperCase()}
                         </div>
                         <span style={{color: theme.gold, fontSize: '0.82rem', fontWeight: '500'}}>
                             {userState.name || 'Account'}
                         </span>
                     </div>
                     <i className="fas fa-sign-out-alt" style={{cursor: 'pointer', color: '#999', marginLeft: '5px', padding: '5px'}} onClick={handleLogout} title={t.logout}></i>
                 </div>
             ) : (
                 <span style={{...styles.navLink, marginLeft: '10px', color: theme.gold}} onClick={() => setShowAuthModal(true)}>
                     <i className="fas fa-user"></i> {t.login}
                 </span>
             )}

             <select style={{background: 'rgba(0,0,0,0.5)', color: theme.gold, border: '1px solid #555', borderRadius: '4px', padding: '2px', marginLeft: '10px'}} value={language} onChange={(e) => switchLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
             </select>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        {showToast && <div style={{position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', background: '#2ecc71', color: '#fff', padding: '15px 30px', borderRadius: '30px', zIndex: 3005, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', fontWeight: 'bold'}} className="fade-in"><i className="fas fa-check-circle"></i> {t.addToCart} - Success</div>}
        
        {showPaywall && <PaymentModal t={t} plan={{id: 'single', title: t.planSingle, price: t.planSinglePrice, desc: t.planSingleDesc, isSub: false}} onClose={() => setShowPaywall(false)} onSuccess={(d) => { handlePaymentSuccess(d, {id: 'single', title: t.planSingle, price: t.planSinglePrice, desc: t.planSingleDesc, isSub: false}); if (view === 'start') setView('selection'); }} />}
        {showPaymentModal && selectedPlan && <PaymentModal t={t} plan={selectedPlan} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />}
        {showBalanceModal && (<FiveElementsBalanceModal t={t} missingElement={calculatedElements ? calculatedElements.missingElement : 'Metal'} aiAdvice={balanceAiAdvice} onClose={() => setShowBalanceModal(false)} onBuyProduct={handleBuyProduct} />)}
        
        {/* AUTH MODAL */}
        {showAuthModal && <AuthModal t={t} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />}

        {currentPage === 'product-detail' && selectedProduct && (
            <div style={{...styles.heroSection, justifyContent: 'flex-start', paddingTop: '100px'}}>
                <ProductDetailModal 
                    key={selectedProduct.id} 
                    isPageMode={true} 
                    t={t} 
                    product={selectedProduct} 
                    onClose={() => {
                        if (previousPageConfig) {
                            setCurrentPage(previousPageConfig.page);
                            setView(previousPageConfig.view);
                            setPreviousPageConfig(null);
                        } else {
                            setCurrentPage('shop');
                        }
                    }} 
                    onAddToCart={() => handleAddToCart(selectedProduct)} 
                    onBuyNow={() => handleBuyProduct(selectedProduct)} 
                    onSwitchProduct={(p) => setSelectedProduct(p)} 
                />
            </div>
        )}

        {currentPage === 'home' && (
            <LandingPage t={t} homepageConfigs={homepageConfigs} onExplore={handleExplore} />
        )}

        {currentPage === 'analysis' && (
             <div style={{...styles.heroSection, paddingTop: '1rem'}}>
                {view === 'start' && <RenderStartView t={t} freeTrials={getDailyFreeRemaining()} isLoggedIn={userState.isLoggedIn} isPaidUser={Boolean(userState.isSubscribed || userState.hasPaidSingle)} freeFaceRemaining={userState.freeFaceRemaining} freePalmRemaining={userState.freePalmRemaining} daysRemaining={getDaysRemaining()} language={language} onStart={(type: 'face' | 'palm' | 'both') => { setReadingType(type); if (type === 'both') { setBothStep('face'); setFaceImage(null); setPalmImage(null); } else { setFaceImage(null); setPalmImage(null); } setView('selection'); }} />}
                {view === 'selection' && <RenderSelectionView 
                    t={t} readingType={readingType} bothStep={bothStep} gender={gender} dobYear={dobYear} dobMonth={dobMonth} dobDay={dobDay} dobHour={dobHour} dobMinute={dobMinute} dobSecond={dobSecond}
                    uploadProgress={uploadProgress} userName={userName} onSetUserName={setUserName} onSetGender={setGender} onSetDobYear={setDobYear} onSetDobMonth={setDobMonth} onSetDobDay={setDobDay} onSetDobHour={setDobHour} onSetDobMinute={setDobMinute} onSetDobSecond={setDobSecond}
                    faceImage={faceImage} palmImage={palmImage}
                    onClearFaceImage={() => { setFaceImage(null); setBothStep('face'); }}
                    onClearPalmImage={() => { setPalmImage(null); setBothStep('palm'); }}
                    onSubmitDualAnalysis={handleSubmitDualAnalysis}
                    onSubmitSingleAnalysis={handleSubmitSingleAnalysis}
                    onStartCamera={(mode?: 'face' | 'palm') => {
                        const targetMode = mode || (bothStep === 'palm' ? 'palm' : (readingType === 'palm' ? 'palm' : 'face'));
                        if (readingType === 'both') setBothStep(targetMode);
                        setActiveCameraSlot(targetMode);
                        startCamera(targetMode);
                    }} 
                    onUpload={(e: any, targetSlot?: 'face' | 'palm') => handleFileUpload(e, targetSlot)} 
                    onBack={() => setView('start')}
                    language={language} useAdvancedAnalysis={useAdvancedAnalysis} onToggleAdvanced={() => setUseAdvancedAnalysis(!useAdvancedAnalysis)}
                    height={height} onSetHeight={setHeight} weight={weight} onSetWeight={setWeight}
                />}
                {view === 'camera' && <RenderCameraView t={t} readingType={readingType} bothStep={bothStep} videoRef={videoRef} canvasRef={canvasRef} onStopCamera={() => { stopCamera(); setView('selection'); }} onCapture={capturePhoto} />}
                {view === 'analyzing' && <LoadingSpinner t={t} progress={analysisProgress} message={loadingMessage} />}
                {view === 'result' && <RenderResultView 
                    t={t} readingType={readingType} birthDate={birthDate} gender={gender} calculatedElements={calculatedElements} resultText={resultText} 
                    language={language} isSpeaking={isSpeaking} isTranslating={isTranslating} LANGUAGES={LANGUAGES}
                    onLanguageChange={(e: any) => switchLanguage(e.target.value)} onToggleSpeech={toggleSpeech} onAnalyzeAnother={() => { setView('selection'); setImage(null); setResultText(""); setBothStep('none'); setFaceImage(null); setPalmImage(null); }}
                    onBuyProduct={handleBuyProduct} onOpenBalance={handleOpenBalance} onViewProduct={handleViewProduct}
                    image={image}
                    faceImage={faceImage}
                    palmImage={palmImage}
                    selectedServiceTier={selectedServiceTier}
                    unlockedTiers={unlockedTiers}
                    onUnlockTier={handleUnlockTier}
                    isPaidUser={Boolean(userState.isSubscribed || userState.hasPaidSingle)}
                    isLoggedIn={Boolean(userState.isLoggedIn)}
                    daysRemaining={getDaysRemaining()}
                    onUnlockFullReport={() => {
                        const isDual = readingType === 'both';
                        const priceStr = isDual ? '$9.99' : '$6.99';
                        const reportTitle = isDual
                            ? (language === 'zh-TW' || language === 'zht' ? '面相+手相雙重互證 100% 深度精批報告' : language.startsWith('zh') ? '面相+手相双重互证 100% 深度精批报告' : 'Face + Palm Dual 100% Comprehensive Report')
                            : (readingType === 'palm'
                                ? (language === 'zh-TW' || language === 'zht' ? '掌紋全息 100% 深度精批報告' : language.startsWith('zh') ? '掌纹全息 100% 深度精批报告' : 'Palmistry 100% Comprehensive Report')
                                : (language === 'zh-TW' || language === 'zht' ? '面相全息 100% 深度精批報告' : language.startsWith('zh') ? '面相全息 100% 深度精批报告' : 'Face Physiognomy 100% Comprehensive Report'));

                        const targetPlan: Plan = { 
                            id: 'single', 
                            title: reportTitle, 
                            price: priceStr, 
                            desc: language === 'zh-TW' || language === 'zht' ? '解鎖全量命理精批與開運調理建議' : language.startsWith('zh') ? '解锁全量命理精批与开运调理建议' : 'Unlock full analysis and remedies', 
                            isSub: false 
                        };

                        if (!userState.isLoggedIn) {
                            setPendingPaymentPlan(targetPlan);
                            setShowAuthModal(true);
                        } else {
                            setSelectedPlan(targetPlan);
                            setShowPaymentModal(true);
                        }
                    }}
                    onOpenPricing={() => {
                        setCurrentPage('pricing');
                    }}
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
        {currentPage === 'pricing' && <div style={styles.heroSection}><PricingPage t={t} onSelectPlan={triggerPayment} onBack={() => setCurrentPage('analysis')} onClose={() => setCurrentPage('analysis')} /></div>}
        {currentPage === 'shop' && <div style={styles.heroSection}><ShopPage t={t} onViewProduct={handleViewProduct} /></div>}
        {currentPage === 'cart' && <div style={styles.heroSection}><CartPage t={t} cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCartCheckout} /></div>}
        {currentPage === 'about' && <div style={styles.heroSection}><AboutPage t={t} /></div>}
        {currentPage === 'privacy' && <div style={styles.heroSection}><PrivacyPolicy t={t} /></div>}
        {currentPage === 'terms' && <div style={styles.heroSection}><TermsOfService t={t} /></div>}
        {currentPage === 'refund' && <div style={styles.heroSection}><RefundPolicy t={t} /></div>}
        {currentPage === 'history' && (
            <div style={styles.heroSection}>
                <RenderHistoryView 
                    t={t} 
                    history={userState.history} 
                    onViewResult={handleLoadHistory} 
                    language={language}
                    isSpeaking={isSpeaking}
                    isTranslating={isTranslating}
                    LANGUAGES={LANGUAGES}
                    onLanguageChange={(e: any) => switchLanguage(e.target.value)}
                    onToggleSpeech={toggleSpeech}
                    onBuyProduct={handleBuyProduct}
                    onOpenBalance={handleOpenBalance}
                    onViewProduct={handleViewProduct}
                    userState={userState}
                    onProfileUpdate={(updatedUser: any) => {
                        setUserState(prev => ({
                            ...prev,
                            ...updatedUser
                        }));
                    }}
                    onUnsubscribe={handleUnsubscribe}
                    cart={cart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onCartCheckout={() => handleCartCheckout(cart.reduce((total, c) => total + (c.product.numericPrice * c.quantity), 0))}
                    onGoToShop={() => setCurrentPage('shop')}
                    onBack={() => { setCurrentPage('home'); setView('start'); }}
                    onClose={() => { setCurrentPage('home'); setView('start'); }}
                />
            </div>
        )}
      </div>
      <footer style={styles.footer}>
        <SocialLinks t={t} />
        <div style={{marginTop: '30px', marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap'}}>
            <span style={{cursor: 'pointer', color: theme.gold}} onClick={() => {setCurrentPage('privacy'); setView('start');}}>{t.privacy}</span>
            <span style={{cursor: 'pointer', color: theme.gold}} onClick={() => {setCurrentPage('terms'); setView('start');}}>{t.terms}</span>
            <span style={{cursor: 'pointer', color: theme.gold}} onClick={() => {setCurrentPage('refund'); setView('start');}}>{t.refundTitle}</span>
            <span style={{cursor: 'pointer', color: theme.gold}} onClick={() => { window.location.hash = '#admin'; setIsAdminMode(true); }}>
                <i className="fas fa-user-shield" style={{marginRight: '5px'}}></i>Admin Portal
            </span>
        </div>
        <div>&copy; {new Date().getFullYear()} {t.title}. {t.footerRight}</div>
      </footer>

      {!cookieConsent && (
          <div style={{
              position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
              maxWidth: '430px', width: '90%', padding: '20px',
              background: 'rgba(5, 5, 17, 0.98)', border: `1px solid ${theme.gold}`,
              borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              color: '#fff', fontSize: '0.85rem', lineHeight: '1.5'
          }} className="fade-in">
              <h4 style={{color: theme.gold, margin: '0 0 10px 0', fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem'}}>
                  <i className="fas fa-cookie-bite"></i> Cookie Consent & Google Analytics
              </h4>
              <p style={{margin: '0 0 15px 0', color: '#ccc', fontSize: '0.8rem'}}>
                  We use cookies and Google Analytics to analyze our site traffic and enhance your mystic personalized reading experience. By clicking "Accept All", you agree to our privacy standards.
              </p>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                  <button onClick={handleDeclineCookies} style={{background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>{t.declineCookies || "Decline"}</button>
                  <button onClick={handleAcceptCookies} style={{background: theme.gold, border: `1px solid ${theme.gold}`, color: '#000', fontWeight: 'bold', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>{t.acceptCookies || "Accept All"}</button>
              </div>
          </div>
      )}
    </div>
  );
};

const SocialLinks = ({ t }: { t: any }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
        <h3 style={{ color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', margin: 0 }}>{t.followUs}</h3>
        <div style={{ display: 'flex', gap: '25px' }}>
            <a href="#" style={{ color: '#fff', fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = theme.gold} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                <i className="fab fa-facebook"></i>
            </a>
            <a href="#" style={{ color: '#fff', fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = theme.gold} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                <i className="fab fa-instagram"></i>
            </a>
            <a href="#" style={{ color: '#fff', fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = theme.gold} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                <i className="fab fa-twitter"></i>
            </a>
            <a href="#" style={{ color: '#fff', fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = theme.gold} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                <i className="fab fa-youtube"></i>
            </a>
            <a href="#" style={{ color: '#fff', fontSize: '1.5rem', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = theme.gold} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                <i className="fab fa-tiktok"></i>
            </a>
        </div>
    </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
