
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { BaguaSVG, FaceMapSVG } from '../components/Icons';
import { FiveElementsChart } from '../components/Charts';
import { getChineseZodiac, getWesternZodiac, calculateAge } from '../utils';
import { SHOP_PRODUCTS } from '../products';
import { HistoryRecord } from '../types';

export const LoadingSpinner = ({ t, progress, message }: { t: any, progress?: number, message?: string }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', width: '100%', maxWidth: '400px' }}>
    <div style={{...styles.baguaContainer, width: '100px', height: '100px', margin: '0 auto', animation: 'spin 1.5s linear infinite'}}>
       {BaguaSVG}
    </div>
    <h3 style={{ marginTop: '1rem', color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.5rem' }}>
      {t.analyzingTitle}
    </h3>
    <p style={{ fontSize: '1rem', color: '#888', fontStyle: 'italic', marginBottom: '20px' }}>
      {message || t.analyzingDesc}
    </p>
    
    {/* Analysis Progress Bar */}
    {typeof progress === 'number' && (
      <div style={{width: '100%', padding: '0 20px', boxSizing: 'border-box'}}>
        <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${theme.darkGold}`}}>
            <div style={{
                width: `${progress}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, ${theme.darkGold}, #ffd700)`, 
                transition: 'width 0.1s linear',
                boxShadow: `0 0 10px ${theme.darkGold}`
            }}></div>
        </div>
        <div style={{color: theme.gold, fontSize: '0.9rem', marginTop: '8px', fontFamily: 'Cinzel, serif'}}>
            {Math.round(progress)}%
        </div>
      </div>
    )}
  </div>
);

export const RenderStartView = ({ t, freeTrials, onStart, isLoggedIn, freeFaceRemaining, freePalmRemaining, daysRemaining, language }: { t: any, freeTrials: number, onStart: (type: 'face' | 'palm') => void, isLoggedIn?: boolean, freeFaceRemaining?: number, freePalmRemaining?: number, daysRemaining?: number, language?: string }) => {
    const boxSize = '200px'; 
    const imageBoxStyle = {
        width: boxSize, 
        height: boxSize, 
        border: `1.5px solid ${theme.gold}`,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(11,8,6,0.85) 100%)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.15), inset 0 0 15px rgba(212, 175, 55, 0.05)',
        overflow: 'hidden' as const
    };

    return (
    <div style={{
      ...styles.glassPanel, 
      border: `2px solid ${theme.gold}`, 
      padding: '4rem 2rem', 
      boxShadow: `0px 15px 50px rgba(0, 0, 0, 0.8), inset 0px 0px 30px rgba(212, 175, 55, 0.05)`, 
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #0d0908 0%, #060404 100%)'
    }} className="glass-panel-mobile">
      
      {/* Decorative Traditional Border Patterns */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', width: '25px', height: '25px', borderLeft: `2px solid ${theme.gold}`, borderTop: `2px solid ${theme.gold}`, opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '25px', height: '25px', borderRight: `2px solid ${theme.gold}`, borderTop: `2px solid ${theme.gold}`, opacity: 0.8 }} />
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '25px', height: '25px', borderLeft: `2px solid ${theme.gold}`, borderBottom: `2px solid ${theme.gold}`, opacity: 0.8 }} />
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '25px', height: '25px', borderRight: `2px solid ${theme.gold}`, borderBottom: `2px solid ${theme.gold}`, opacity: 0.8 }} />

      {/* Rotating Background Bagua Watermark */}
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          opacity: 0.02,
          pointerEvents: 'none',
          animation: 'spin 120s linear infinite',
          zIndex: 0,
          color: theme.gold
      }}>
          {BaguaSVG}
      </div>

      {/* Floating Taoist Symbols in Background */}
      <div style={{ position: 'absolute', top: '20%', left: '8%', fontSize: '1.5rem', color: 'rgba(212,175,55,0.06)', fontFamily: 'SimSun, serif', userSelect: 'none' }}>乾</div>
      <div style={{ position: 'absolute', top: '20%', right: '8%', fontSize: '1.5rem', color: 'rgba(212,175,55,0.06)', fontFamily: 'SimSun, serif', userSelect: 'none' }}>坤</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '8%', fontSize: '1.5rem', color: 'rgba(212,175,55,0.06)', fontFamily: 'SimSun, serif', userSelect: 'none' }}>巽</div>
      <div style={{ position: 'absolute', bottom: '20%', right: '8%', fontSize: '1.5rem', color: 'rgba(212,175,55,0.06)', fontFamily: 'SimSun, serif', userSelect: 'none' }}>震</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{...styles.baguaContainer, margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.7))', width: '95px', height: '95px', animation: 'spin 20s linear infinite'}}>
             {BaguaSVG}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', marginBottom: '10px', color: theme.gold }}>
              <span style={{ fontSize: '1.2rem' }}>☯</span>
              <span style={{ fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}>Celestial Destiny Chamber</span>
              <span style={{ fontSize: '1.2rem' }}>☯</span>
          </div>
          <h1 style={{fontSize: '2.8rem', fontWeight: 700, marginBottom: '1.2rem', color: theme.gold, fontFamily: 'Cinzel, Georgia, SimSun, serif', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{t.heroTitle}</h1>
          <p style={{color: '#dfdfd5', marginBottom: '2.5rem', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', letterSpacing: '0.5px'}}>{t.heroDesc}</p>
          
          <div className="home-cards-container" style={{display: 'flex', gap: '2.50rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%', position: 'relative', zIndex: 2}}>
              
              {/* FACE READING CARD */}
              <div style={{
                  flex: '1 1 290px', 
                  maxWidth: '330px',
                  background: 'linear-gradient(135deg, rgba(20, 15, 10, 0.95) 0%, rgba(6, 4, 12, 0.98) 100%)', 
                  border: `1.5px solid ${theme.darkGold}`, 
                  borderRadius: '12px', 
                  padding: '35px 25px', 
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(212,175,55,0.02)'
              }} 
              onClick={() => onStart('face')}
              onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme.gold;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 15px 45px rgba(212, 175, 55, 0.35)`;
              }}
              onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = theme.darkGold;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
              }}
              >
                  <div style={imageBoxStyle}>
                      <FaceMapSVG t={t} />
                  </div>
                  <h3 style={{color: theme.gold, fontSize: '1.45rem', fontFamily: 'Cinzel, Georgia, SimSun, serif', letterSpacing: '1px', margin: '0 0 15px 0', textTransform: 'uppercase'}}>{t.startBtn}</h3>
                  <button style={{...styles.button, width: '100%', marginTop: 'auto', letterSpacing: '1px', fontWeight: 'bold', border: `1px solid ${theme.gold}`}}>{t.scanBtn}</button>
              </div>
    
              {/* PALM READING CARD */}
              <div style={{
                  flex: '1 1 290px', 
                  maxWidth: '330px',
                  background: 'linear-gradient(135deg, rgba(20, 15, 10, 0.95) 0%, rgba(6, 4, 12, 0.98) 100%)', 
                  border: `1.5px solid ${theme.darkGold}`, 
                  borderRadius: '12px', 
                  padding: '35px 25px', 
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(212,175,55,0.02)'
              }}
              onClick={() => onStart('palm')}
              onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme.gold;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 15px 45px rgba(212, 175, 55, 0.35)`;
              }}
              onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = theme.darkGold;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
              }}
              >
                  <div style={imageBoxStyle}>
                      <i className="fas fa-hand-sparkles" style={{fontSize: '6.5rem', color: theme.gold, textShadow: '0 0 20px rgba(212,175,55,0.7)', zIndex: 2}}></i>
                      {/* Mystical Pulse Animation */}
                      <div style={{position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width: '130px', height:'130px', borderRadius:'50%', border:`2px solid ${theme.gold}`, animation: 'mysticalPulse 3s infinite', opacity: 0.6}}></div>
                  </div>
                  <h3 style={{color: theme.gold, fontSize: '1.45rem', fontFamily: 'Cinzel, Georgia, SimSun, serif', letterSpacing: '1px', margin: '0 0 15px 0', textTransform: 'uppercase'}}>{t.palmBtn}</h3>
                  <button style={{...styles.button, width: '100%', marginTop: 'auto', letterSpacing: '1px', fontWeight: 'bold', border: `1px solid ${theme.gold}`}}>{t.scanPalmBtn}</button>
              </div>
    
          </div>
      </div>

      <div style={{marginTop: '35px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '10px'}}>
              <div style={{fontSize: '0.9rem', color: theme.gold, fontWeight: 'bold', background: 'rgba(212,175,55,0.08)', padding: '8px 22px', borderRadius: '25px', border: `1px solid ${theme.darkGold}`, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}>
                  <i className="fas fa-calendar-alt" style={{marginRight: '8px', color: theme.gold}}></i>
                  {t.freeTrialsHint ? t.freeTrialsHint.replace('{count}', (daysRemaining !== undefined ? daysRemaining : 3).toString()) : `免费试用期 (剩余: ${daysRemaining !== undefined ? daysRemaining : 3}天)`}
              </div>
              <div style={{fontSize: '0.9rem', color: theme.gold, fontWeight: 'bold', background: 'rgba(212,175,55,0.08)', padding: '8px 22px', borderRadius: '25px', border: `1px solid ${theme.darkGold}`, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}>
                  <i className="fas fa-magic" style={{marginRight: '8px', color: theme.gold}}></i>
                  {language === 'zh' ? `免费测试剩余: ${freeTrials}/10次` : language === 'zht' ? `免費測試剩餘: ${freeTrials}/10次` : `Free readings remaining: ${freeTrials}/10`}
              </div>
          </div>
          <div style={{fontSize: '0.8rem', color: '#888', marginTop: '5px', fontStyle: 'italic', textAlign: 'center'}}>
              {language === 'zh' ? "☯ 全站用户享有自首次使用起3天免费试用，总计最多可进行10次测试 ☯" : language === 'zht' ? "☯ 全站用戶享有自首次使用起3天免費試用，總計最多可進行10次測試 ☯" : "☯ All users enjoy a 3-day free trial from first use, up to 10 total readings across the site ☯"}
          </div>
      </div>
    </div>
  );
};

export const RenderSelectionView = ({ t, readingType, gender, dobYear, dobMonth, dobDay, dobHour, dobMinute, dobSecond, uploadProgress, userName, onSetUserName, onSetGender, onSetDobYear, onSetDobMonth, onSetDobDay, onSetDobHour, onSetDobMinute, onSetDobSecond, onStartCamera, onUpload, onBack, language, useAdvancedAnalysis, onToggleAdvanced }: any) => {
    const years = Array.from({length: 151}, (_, i) => 1900 + i);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const hours = Array.from({length: 24}, (_, i) => i);
    const minutesSeconds = Array.from({length: 60}, (_, i) => i);
    
    // Check if we should show Name Input (China context)
    const isPalm = readingType === 'palm';

    return (
      <div style={{...styles.glassPanel, border: `1px solid ${theme.gold}`, position: 'relative'}} className="glass-panel-mobile">
          {/* Top Right Close Button */}
          <button 
              onClick={onBack} 
              style={{
                  position: 'absolute', 
                  top: '15px', 
                  right: '15px', 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#888', 
                  fontSize: '1.8rem', 
                  cursor: 'pointer',
                  zIndex: 10,
                  padding: 0,
                  lineHeight: 1
              }}
              onMouseOver={(e) => e.currentTarget.style.color = theme.gold}
              onMouseOut={(e) => e.currentTarget.style.color = '#888'}
          >
              &times;
          </button>

          <h2 style={{color: theme.gold, marginBottom: '20px', fontFamily: 'Cinzel, serif'}}>{t.chooseMethod}</h2>
          <div style={{textAlign: 'left', marginBottom: '20px'}}>
              <h3 style={{color: theme.darkGold, fontSize: '1rem', borderBottom: '1px solid rgba(138, 110, 47, 0.3)', paddingBottom: '5px', marginBottom: '15px'}}>{t.profileTitle}</h3>
              
               {/* Advanced Analysis Checkbox */}
               <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px', cursor: 'pointer'}} onClick={onToggleAdvanced}>
                  <div style={{
                      width: '20px', height: '20px', 
                      border: `1px solid ${theme.gold}`, 
                      background: useAdvancedAnalysis ? theme.gold : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                      {useAdvancedAnalysis && <i className="fas fa-check" style={{color: '#000', fontSize: '0.8rem'}}></i>}
                  </div>
                  <span style={{color: theme.text, fontSize: '0.9rem'}}>{t.combineAnalysis}</span>
               </div>

              {useAdvancedAnalysis && (
                  <div className="fade-in">
                      <div style={{marginBottom: '15px'}}>
                          <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.nameLabel}</label>
                          <input 
                            type="text" 
                            style={styles.formInput} 
                            value={userName} 
                            onChange={(e) => onSetUserName(e.target.value)} 
                            placeholder={t.nameLabel}
                          />
                      </div>

                      <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                           <div style={{flex: 2}}>
                               <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.dateYear}</label>
                               <select style={styles.formInput} value={dobYear} onChange={(e) => onSetDobYear(e.target.value)}>
                                   <option value="">{t.dateYear}</option>
                                   {years.map(y => <option key={y} value={y}>{y}</option>)}
                               </select>
                           </div>
                           <div style={{flex: 1}}>
                               <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.dateMonth}</label>
                               <select style={styles.formInput} value={dobMonth} onChange={(e) => onSetDobMonth(e.target.value)}>
                                   <option value="">{t.dateMonth}</option>
                                   {months.map(m => <option key={m} value={m}>{m}</option>)}
                               </select>
                           </div>
                           <div style={{flex: 1}}>
                               <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.dateDay}</label>
                               <select style={styles.formInput} value={dobDay} onChange={(e) => onSetDobDay(e.target.value)}>
                                   <option value="">{t.dateDay}</option>
                                   {days.map(d => <option key={d} value={d}>{d}</option>)}
                               </select>
                           </div>
                      </div>
                      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                           <div style={{flex: 1}}>
                               <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.timeHour}</label>
                               <select style={styles.formInput} value={dobHour} onChange={(e) => onSetDobHour(e.target.value)}>
                                   {hours.map(h => <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>)}
                               </select>
                           </div>
                           <div style={{flex: 1}}>
                               <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.timeMinute}</label>
                               <select style={styles.formInput} value={dobMinute} onChange={(e) => onSetDobMinute(e.target.value)}>
                                   {minutesSeconds.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                               </select>
                           </div>
                           <div style={{flex: 1}}>
                               <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.timeSecond}</label>
                               <select style={styles.formInput} value={dobSecond} onChange={(e) => onSetDobSecond(e.target.value)}>
                                   {minutesSeconds.map(s => <option key={s} value={s}>{s.toString().padStart(2, '0')}</option>)}
                               </select>
                           </div>
                      </div>
                  </div>
              )}

              <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                  <div style={{flex: 1}}>
                      <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.genderLabel}</label>
                      <select style={styles.formInput} value={gender} onChange={(e) => onSetGender(e.target.value)}>
                          <option value="male">{t.genderMale}</option>
                          <option value="female">{t.genderFemale}</option>
                      </select>
                  </div>
              </div>

          </div>
          <button style={{...styles.button, width: '100%', background: styles.button.background, color: '#050511'}} onClick={onStartCamera}>
            <i className={`fas ${isPalm ? 'fa-hand-sparkles' : 'fa-camera'}`}></i> {isPalm ? t.scanPalmBtn : t.scanBtn}
          </button>
          <div style={{marginTop: '15px', position: 'relative'}}>
            <button style={{...styles.secondaryButton, width: '100%', borderColor: theme.darkGold, color: theme.darkGold}} onClick={() => document.getElementById('file-upload')?.click()}>
               <i className="fas fa-upload"></i> {t.uploadBtn}
            </button>
            <input type="file" id="file-upload" accept="image/*" style={styles.input} onChange={onUpload} />
             {/* Upload Progress Bar */}
             {uploadProgress > 0 && (
                  <div style={{width: '100%', marginTop: '10px'}}>
                      <div style={{width: '100%', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden'}}>
                          <div style={{width: `${uploadProgress}%`, height: '100%', background: theme.gold, transition: 'width 0.2s'}}></div>
                      </div>
                      <div style={{fontSize: '0.8rem', color: theme.gold, marginTop: '5px', textAlign: 'right'}}>{Math.round(uploadProgress)}%</div>
                  </div>
              )}
          </div>
          {/* Back Button Removed from Bottom */}
      </div>
    );
};

export const RenderHistoryView = ({ t, history, onViewResult, language, isSpeaking, isTranslating, LANGUAGES, onLanguageChange, onToggleSpeech, onBuyProduct, onOpenBalance, userState, onProfileUpdate, onUnsubscribe, cart, onRemoveFromCart, onCartCheckout, onGoToShop, onViewProduct }: any) => {
    // Local state to manage showing detail view inside history tab
    const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
    const [subTab, setSubTab] = useState<'profile' | 'orders' | 'readings'>('profile');

    // Address draft state, initialized from userState
    const [firstNameDraft, setFirstNameDraft] = useState(userState?.firstName || '');
    const [lastNameDraft, setLastNameDraft] = useState(userState?.lastName || '');
    const [countryDraft, setCountryDraft] = useState(userState?.country || '');
    const [stateDraft, setStateDraft] = useState(userState?.state || '');
    const [zipCodeDraft, setZipCodeDraft] = useState(userState?.zipCode || '');
    const [streetAddressDraft, setStreetAddressDraft] = useState(userState?.streetAddress || '');
    const [buildingNameDraft, setBuildingNameDraft] = useState(userState?.buildingName || '');
    const [roomNumberDraft, setRoomNumberDraft] = useState(userState?.roomNumber || '');

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (userState) {
            setFirstNameDraft(userState.firstName || '');
            setLastNameDraft(userState.lastName || '');
            setCountryDraft(userState.country || '');
            setStateDraft(userState.state || '');
            setZipCodeDraft(userState.zipCode || '');
            setStreetAddressDraft(userState.streetAddress || '');
            setBuildingNameDraft(userState.buildingName || '');
            setRoomNumberDraft(userState.roomNumber || '');
        }
    }, [userState]);

    useEffect(() => {
        if (userState?.isLoggedIn && userState?.userId) {
            setLoadingOrders(true);
            fetch(`/api/user/orders/${userState.userId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setOrders(data);
                    }
                    setLoadingOrders(false);
                })
                .catch(err => {
                    console.error("Failed to load orders:", err);
                    setLoadingOrders(false);
                });
        }
    }, [userState?.isLoggedIn, userState?.userId, subTab]);

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userState?.isLoggedIn || !userState?.userId) return;
        setIsSaving(true);
        setSaveStatus('');
        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userState.userId,
                    firstName: firstNameDraft,
                    lastName: lastNameDraft,
                    country: countryDraft,
                    state: stateDraft,
                    zipCode: zipCodeDraft,
                    streetAddress: streetAddressDraft,
                    buildingName: buildingNameDraft,
                    roomNumber: roomNumberDraft
                })
            });
            const data = await res.json();
            if (res.ok && data.success && data.user) {
                setSaveStatus('success');
                if (onProfileUpdate) {
                    onProfileUpdate(data.user);
                }
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus(''), 4000);
        }
    };

    if (selectedRecord) {
        return (
            <div style={{width: '100%', maxWidth: '800px', position: 'relative'}}>
                <button 
                    onClick={() => setSelectedRecord(null)}
                    style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '10px', 
                        background: 'rgba(0,0,0,0.6)', 
                        border: `1px solid ${theme.gold}`, 
                        borderRadius: '4px', 
                        color: theme.gold, 
                        padding: '8px 15px', 
                        cursor: 'pointer', 
                        zIndex: 20, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontFamily: 'Cinzel, serif', 
                        fontSize: '0.9rem'
                    }}
                >
                    <i className="fas fa-arrow-left"></i> {t.backBtn}
                </button>
                <div style={{marginTop: '40px'}}>
                    <RenderResultView 
                        t={t}
                        readingType={selectedRecord.readingType || 'face'}
                        birthDate={selectedRecord.birthDate}
                        gender={selectedRecord.gender}
                        calculatedElements={selectedRecord.elements}
                        resultText={selectedRecord.resultText}
                        language={language}
                        isSpeaking={isSpeaking}
                        isTranslating={isTranslating}
                        LANGUAGES={LANGUAGES}
                        onLanguageChange={onLanguageChange}
                        onToggleSpeech={onToggleSpeech}
                        onAnalyzeAnother={() => setSelectedRecord(null)}
                        onBuyProduct={onBuyProduct}
                        onOpenBalance={onOpenBalance}
                        onViewProduct={onViewProduct}
                    />
                </div>
            </div>
        );
    }

    if (!userState?.isLoggedIn) {
        return (
            <div style={{...styles.glassPanel, maxWidth: '800px', width: '95%', textAlign: 'center', padding: '3rem 2rem'}}>
                <i className="fas fa-user-lock" style={{fontSize: '3rem', color: theme.gold, marginBottom: '1rem'}}></i>
                <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', marginBottom: '1rem'}}>Access Restricted</h2>
                <p style={{color: '#aaa', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: '1.6'}}>Please log in or sign up to save shipping addresses, manage subscriptions, secure your billing info, and view analytical palm/face reading logs.</p>
            </div>
        );
    }

    return (
        <div style={{...styles.glassPanel, maxWidth: '850px', width: '95%', padding: '2rem'}}>
            <h2 style={{color: theme.gold, textAlign: 'center', fontFamily: 'Cinzel, serif', marginBottom: '0.5rem'}}>{t.historyTitle || "Personal Dashboard"}</h2>
            <p style={{color: '#888', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem'}}>Control center for your spiritual readings, transactions, and membership settings.</p>
            
            {/* Nav tabs bar */}
            <div style={{display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '5px'}}>
                <button 
                    type="button"
                    onClick={() => setSubTab('profile')}
                    style={{
                        padding: '12px 20px', background: 'transparent', border: 'none',
                        borderBottom: subTab === 'profile' ? `2px solid ${theme.gold}` : 'none',
                        color: subTab === 'profile' ? theme.gold : '#aaa',
                        fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontSize: '0.95rem'
                    }}
                >
                    <i className="fas fa-address-card" style={{marginRight: '8px'}}></i>Profile & Shipping Address
                </button>
                <button 
                    type="button"
                    onClick={() => setSubTab('orders')}
                    style={{
                        padding: '12px 20px', background: 'transparent', border: 'none',
                        borderBottom: subTab === 'orders' ? `2px solid ${theme.gold}` : 'none',
                        color: subTab === 'orders' ? theme.gold : '#aaa',
                        fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontSize: '0.95rem'
                    }}
                >
                    <i className="fas fa-receipt" style={{marginRight: '8px'}}></i>Billing & Subscriptions
                </button>
                <button 
                    type="button"
                    onClick={() => setSubTab('readings')}
                    style={{
                        padding: '12px 20px', background: 'transparent', border: 'none',
                        borderBottom: subTab === 'readings' ? `2px solid ${theme.gold}` : 'none',
                        color: subTab === 'readings' ? theme.gold : '#aaa',
                        fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontSize: '0.95rem'
                    }}
                >
                    <i className="fas fa-history" style={{marginRight: '8px'}}></i>Past Readings ({history.length})
                </button>
            </div>

            {subTab === 'profile' && (
                <form onSubmit={handleSaveAddress} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div style={{background: 'rgba(212,175,55,0.05)', padding: '15px', borderLeft: `3px solid ${theme.gold}`, marginBottom: '10px', borderRadius: '4px'}}>
                        <h4 style={{color: theme.gold, margin: '0 0 5px 0', fontSize: '1rem'}}>Logged In Account Status</h4>
                        <div style={{color: '#ddd', fontSize: '0.9rem', marginBottom: '4px'}}>Email: {userState.email}</div>
                        <div style={{color: theme.gold, fontSize: '0.85rem', marginBottom: '8px'}}>Personal Account ID: <span style={{letterSpacing: '1px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff'}}>{userState.id || userState.userId}</span></div>
                        
                        {/* Welcome Free Quotas */}
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(212, 175, 55, 0.2)'}}>
                            <div style={{fontSize: '0.85rem', color: theme.gold, background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <i className="fas fa-smile"></i> {t.freeFaceRemainingText || "Free Welcome Face Readings"}: <span style={{color: '#fff', fontWeight: 'bold'}}>{userState.freeFaceRemaining !== undefined ? userState.freeFaceRemaining : 3}</span>
                            </div>
                            <div style={{fontSize: '0.85rem', color: theme.gold, background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <i className="fas fa-hand-paper"></i> {t.freePalmRemainingText || "Free Welcome Palm Readings"}: <span style={{color: '#fff', fontWeight: 'bold'}}>{userState.freePalmRemaining !== undefined ? userState.freePalmRemaining : 3}</span>
                            </div>
                        </div>
                    </div>

                    <h3 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', marginTop: '10px'}}>Contact Information</h3>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}} className="responsive-grid">
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>FIRST NAME</label>
                            <input 
                                type="text" placeholder="First Name" style={styles.formInput} 
                                value={firstNameDraft} onChange={e => setFirstNameDraft(e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>LAST NAME</label>
                            <input 
                                type="text" placeholder="Last Name" style={styles.formInput} 
                                value={lastNameDraft} onChange={e => setLastNameDraft(e.target.value)} required 
                            />
                        </div>
                    </div>

                    <h3 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', marginTop: '15px'}}>Shipping & Delivery Address</h3>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px'}} className="responsive-grid">
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>COUNTRY</label>
                            <input 
                                type="text" placeholder="e.g. United States" style={styles.formInput} 
                                value={countryDraft} onChange={e => setCountryDraft(e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>STATE / PROVINCE</label>
                            <input 
                                type="text" placeholder="e.g. California" style={styles.formInput} 
                                value={stateDraft} onChange={e => setStateDraft(e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>ZIP / POSTAL CODE</label>
                            <input 
                                type="text" placeholder="e.g. 90210" style={styles.formInput} 
                                value={zipCodeDraft} onChange={e => setZipCodeDraft(e.target.value)} required 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>STREET ADDRESS / ROAD ADDRESS</label>
                        <input 
                            type="text" placeholder="e.g. 123 Celestial Realm Boulevard" style={styles.formInput} 
                            value={streetAddressDraft} onChange={e => setStreetAddressDraft(e.target.value)} required 
                        />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}} className="responsive-grid">
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>BUILDING NAME</label>
                            <input 
                                type="text" placeholder="e.g. Jade Tower Alpha (Optional)" style={styles.formInput} 
                                value={buildingNameDraft} onChange={e => setBuildingNameDraft(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px'}}>ROOM / SUITE NUMBER</label>
                            <input 
                                type="text" placeholder="e.g. Suite 888 (Optional)" style={styles.formInput} 
                                value={roomNumberDraft} onChange={e => setRoomNumberDraft(e.target.value)} 
                            />
                        </div>
                    </div>

                    {saveStatus === 'success' && (
                        <div style={{padding: '10px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center'}}>
                            <i className="fas fa-check-circle"></i> Shipping profiles & address coordinates updated successfully!
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div style={{padding: '10px', background: 'rgba(231,76,60,0.15)', color: '#e74c3c', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center'}}>
                            <i className="fas fa-times-circle"></i> Error updating database profiles. Try again.
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSaving}
                        style={{...styles.button, maxWidth: '250px', alignSelf: 'center', marginTop: '10px'}}
                    >
                        {isSaving ? "Saving Profiles..." : "Save Delivery Settings"}
                    </button>
                </form>
            )}

            {subTab === 'orders' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                    
                    {/* Active Shopping Cart Overview (Requirement #6) */}
                    <div>
                        <h3 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', margin: '0 0 15px 0'}}>Active Shopping Cart</h3>
                        {(!cart || cart.length === 0) ? (
                            <div style={{background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255, 255, 255, 0.15)', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#888'}}>
                                Your mystical shopping cart is currently empty.
                                {onGoToShop && (
                                    <button 
                                        type="button" 
                                        onClick={onGoToShop} 
                                        style={{...styles.secondaryButton, display: 'block', margin: '15px auto 0 auto', padding: '6px 12px', fontSize: '0.8rem'}}
                                    >
                                        Browse Amulets Shop
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{background: 'rgba(212,175,55,0.03)', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', padding: '20px'}}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                                    {cart.map((item: any) => (
                                        <div key={item.product.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px'}}>
                                            <div>
                                                <span style={{color: '#fff', fontWeight: 'bold'}}>{item.product.defaultName}</span>
                                                <span style={{color: theme.gold, marginLeft: '10px'}}>x{item.quantity}</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                                <span style={{fontWeight: 'bold', color: theme.gold}}>${(item.product.numericPrice * item.quantity).toFixed(2)}</span>
                                                {onRemoveFromCart && (
                                                    <button 
                                                        onClick={() => onRemoveFromCart(item.product.id)}
                                                        style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.9rem'}}
                                                        title="Remove item"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
                                    <div style={{fontSize: '1.1rem', color: '#fff'}}>Total Match: <span style={{color: theme.gold, fontWeight: 'bold'}}>${cart.reduce((total: any, c: any) => total + (c.product.numericPrice * c.quantity), 0).toFixed(2)}</span></div>
                                    {onCartCheckout && (
                                        <button 
                                            onClick={onCartCheckout}
                                            style={{...styles.button, padding: '10px 20px', minWidth: '150px', fontSize: '0.95rem', marginTop: 0}}
                                        >
                                            <i className="fas fa-shopping-bag" style={{marginRight: '8px'}}></i> Checkout Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subscription Sub-section (Requirement #6) */}
                    <div>
                        <h3 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', margin: '0 0 15px 0'}}>Membership Plan</h3>
                        <div style={{background: 'rgba(212,175,55,0.03)', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
                            <div>
                                <div style={{fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <i className="fas fa-crown" style={{color: theme.gold}}></i> 
                                    {userState.isSubscribed ? "Daily Membership Subscription" : "Standard Guest Plan"}
                                </div>
                                <div style={{fontSize: '0.85rem', color: '#888', marginTop: '5px'}}>
                                    {userState.isSubscribed ? `Membership Tier: ${userState.subscriptionPlan || 'Premium Access'}` : "Upgrade to unlimited readings, fast priority AI queues and detailed product discounts."}
                                </div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'}}>
                                <span style={{
                                    background: userState.isSubscribed ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255,255,255,0.05)',
                                    color: userState.isSubscribed ? '#2ecc71' : '#888',
                                    padding: '5px 12px',
                                    borderRadius: '15px',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>
                                    {userState.isSubscribed ? 'ACTIVE MEMBER' : 'FREE ACCOUNT'}
                                </span>
                                {userState.isSubscribed && onUnsubscribe && (
                                    <button 
                                        onClick={() => {
                                            if (confirm("Are you sure you want to manually cancel your active subscription? You will lose premium priority AI benefits.")) {
                                                onUnsubscribe();
                                            }
                                        }}
                                        style={{...styles.secondaryButton, gridRow: 1, borderColor: '#e74c3c', color: '#e74c3c', marginTop: 0, padding: '5px 10px', fontSize: '0.8rem'}}
                                    >
                                        Cancel Subscription
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Orders History Sub-section */}
                    <div>
                        <h3 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', margin: '0 0 15px 0'}}>Purchase Transactions Logs</h3>
                        
                        {loadingOrders ? (
                            <div style={{textAlign: 'center', padding: '20px', color: theme.gold}}><i className="fas fa-spinner fa-spin"></i> Retrieving Ledger...</div>
                        ) : orders.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '20px', border: '1px dashed #444', borderRadius: '8px', color: '#888'}}>
                                No transaction invoices registered yet for {userState.email}.
                            </div>
                        ) : (
                            <div style={{overflowX: 'auto', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#ccc'}}>
                                    <thead>
                                        <tr style={{background: 'rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.gold}}>Invoice ID</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.gold}}>Item Ordered</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.gold}}>Total Paid</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.gold}}>Date</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.gold}}>Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, idx) => (
                                            <tr key={idx} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                                                <td style={{padding: '10px 15px', fontWeight: 'bold'}}>{order.orderId}</td>
                                                <td style={{padding: '10px 15px'}}>{order.items}</td>
                                                <td style={{padding: '10px 15px', color: theme.gold, fontWeight: 'bold'}}>${parseFloat(order.total || 0).toFixed(2)}</td>
                                                <td style={{padding: '10px 15px'}}>{new Date(order.date).toLocaleDateString()}</td>
                                                <td style={{padding: '10px 15px'}}>
                                                    <span style={{textTransform: 'uppercase', fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px'}}>
                                                        {order.paymentMethod || 'Credit Card'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            )}

            {subTab === 'readings' && (
                history.length === 0 ? (
                    <div style={{textAlign: 'center', color: '#aaa', padding: '2rem'}}>{t.noHistory}</div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {history.map((record: HistoryRecord) => (
                            <div key={record.id} style={{
                                background: 'rgba(0,0,0,0.3)', 
                                border: `1px solid ${theme.darkGold}`, 
                                borderRadius: '8px', 
                                padding: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}>
                                <div>
                                    <div style={{color: theme.gold, fontWeight: 'bold'}}>{record.name || (record.gender === 'male' ? t.genderMale : t.genderFemale)}</div>
                                    <div style={{fontSize: '0.8rem', color: '#888'}}>{t.dateLabel}: {record.date}</div>
                                    {record.readingType === 'palm' ? (
                                        <div style={{fontSize: '0.8rem', color: '#aaa'}}>
                                            <i className="fas fa-hand-sparkles"></i> {t.palmBtn}
                                        </div>
                                    ) : (
                                        <div style={{fontSize: '0.8rem', color: '#aaa'}}>
                                            {record.elements ? (
                                                <>
                                                    {t.elementMetal}: {record.elements.scores.Metal}% | {t.elementWood}: {record.elements.scores.Wood}%
                                                </>
                                            ) : (
                                                <span>{t.startBtn}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedRecord(record)} 
                                    style={{
                                        background: 'transparent', 
                                        border: `1px solid ${theme.gold}`, 
                                        color: theme.gold, 
                                        padding: '5px 15px', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {t.viewResult}
                                </button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export const RenderCameraView = ({ t, readingType, videoRef, canvasRef, onStopCamera, onCapture }: any) => {
    const isPalm = readingType === 'palm';
    const accentColor = theme.gold;
    const [countdown, setCountdown] = useState(5);

    // Auto-capture countdown logic
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Countdown finished, capture automatically
            onCapture();
        }
    }, [countdown, onCapture]);

    return (
        <div style={{
            ...styles.glassPanel, 
            maxWidth: '500px', 
            width: '95%', 
            padding: '0', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '650px', 
            maxHeight: '90vh',
            margin: '0 auto',
            border: `1px solid ${accentColor}`,
            boxShadow: `0 0 20px rgba(212, 175, 55, 0.2)`
        }}>
           <div style={{flex: 1, position: 'relative', background: '#000', overflow: 'hidden'}}>
               {/* Important: playsInline for iOS, muted for autoplay policy */}
               <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        // Only mirror if it's Face reading (Front camera)
                        transform: !isPalm ? 'scaleX(-1)' : 'none'
                    }}
                ></video>
               <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
               
               {/* Traditional Mystical Overlay */}
               <div className="mystical-scan-frame" style={{
                   width: isPalm ? '300px' : '240px', 
                   height: isPalm ? '450px' : '320px',
                   borderRadius: isPalm ? '15px' : '50% 50% 45% 45%'
               }}></div>

               {/* Countdown Overlay */}
               {countdown > 0 ? (
                   <div style={{
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       width: '100%',
                       height: '100%',
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       justifyContent: 'center',
                       background: 'rgba(0,0,0,0.3)',
                       zIndex: 20
                   }}>
                       <div style={{
                           fontSize: '6rem', 
                           color: '#fff', 
                           textShadow: `0 0 20px ${theme.gold}`,
                           fontFamily: 'Cinzel, serif',
                           fontWeight: 'bold',
                           animation: 'pulse 1s infinite'
                       }}>
                           {countdown}
                       </div>
                       <div style={{
                           color: theme.gold,
                           marginTop: '10px',
                           fontFamily: 'Cinzel, serif',
                           fontSize: '1.2rem',
                           letterSpacing: '2px'
                       }}>
                           SCANNING...
                       </div>
                       <button 
                            onClick={() => setCountdown(0)}
                            style={{
                                marginTop: '30px',
                                background: 'rgba(212, 175, 55, 0.2)',
                                border: `1px solid ${theme.gold}`,
                                color: theme.gold,
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontFamily: 'Cinzel, serif'
                            }}
                       >
                           {t.captureBtn}
                       </button>
                   </div>
               ) : (
                   /* Manual Capture Button when countdown is 0 (if it didn't auto-capture yet) */
                   <div style={{position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 30}}>
                        <button 
                            onClick={onCapture}
                            style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: 'white',
                                border: `5px solid ${theme.gold}`,
                                cursor: 'pointer',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                            }}
                        ></button>
                   </div>
               )}
           </div>
           
           <div style={{
               padding: '15px 20px', 
               background: '#050511', 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center', 
               borderTop: `1px solid ${accentColor}`,
               flexShrink: 0
           }}>
               <button style={{...styles.secondaryButton, marginTop: 0, padding: '10px 20px', fontSize: '0.8rem', borderColor: accentColor, color: accentColor}} onClick={onStopCamera}>{t.cancelBtn}</button>
               <div style={{color: '#888', fontSize: '0.8rem', fontStyle: 'italic'}}>{t.snapPhoto}</div>
           </div>
        </div>
    );
};

export const RenderResultView = ({ t, readingType, birthDate, gender, calculatedElements, resultText, language, isSpeaking, isTranslating, LANGUAGES, onLanguageChange, onToggleSpeech, onAnalyzeAnother, onBuyProduct, onOpenBalance, onViewProduct }: any) => {
    const age = calculateAge(birthDate);
    const zodiac = getChineseZodiac(birthDate);
    const starSign = getWesternZodiac(birthDate);
    const zodiacName = zodiac ? (t[`zodiac${zodiac}`] || zodiac) : "";
    const starSignName = starSign ? (t[`star${starSign}`] || starSign) : "";
    
    // Premium artistic, mystical, and high-fantasy image prompts for Zodiac and Constellations
    const zodiacImg = zodiac ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`exquisite glowing golden oriental zodiac ${zodiac} animal spirit, ancient Chinese ink wash watercolor painting style with floating sparkles, deep cosmic starry night background, celestial and metaphysical vibe, fantasy illustration`)}?width=300&height=300&nologo=true` : "";
    const starSignImg = starSign ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`celestial western constellation sign ${starSign} spirit guardian, glowing stardust nebula, detailed sacred geometry background, high fantasy astrology art, vibrant gold and deep indigo colors`)}?width=300&height=300&nologo=true` : "";
    const missingElement = calculatedElements?.missingElement || 'Metal';
    
    // Personalized recommended products that match zodiac, star sign, or missing element
    const recommendedProducts = React.useMemo(() => {
        let matched = SHOP_PRODUCTS.filter(p => p.zodiac === zodiac || p.zodiac === starSign || p.element === missingElement);
        if (matched.length === 0) {
            matched = SHOP_PRODUCTS;
        }
        const selected: any[] = [];
        const categories = ['bracelet', 'pendant', 'necklace', 'amulet'];
        for (const cat of categories) {
            const found = matched.find(p => p.category === cat && !selected.some(s => s.id === p.id));
            if (found) selected.push(found);
            if (selected.length >= 3) break;
        }
        while (selected.length < 3 && matched.length > 0) {
            const found = matched.find(p => !selected.some(s => s.id === p.id));
            if (!found) break;
            selected.push(found);
        }
        return selected.slice(0, 3);
    }, [zodiac, starSign, missingElement]);

    const formatMarkdown = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FFFdd0; text-shadow: 0 0 8px rgba(255, 221, 100, 0.4); font-weight: bold;">$1</strong>')
                   .replace(/## (.*)/g, '<h3 style="color:#D4AF37;border-bottom:1.5px solid rgba(212, 175, 55, 0.5);padding-bottom:6px;margin-top:28px;font-family:Cinzel, Georgia, SimSun, serif;text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);letter-spacing: 1px;">$1</h3>')
                   .replace(/\n/g, '<br/>');
    };

    // Use specific regex to find the Master's Advice section to "hide" it from main view
    const adviceRegex = /## 📜.*(?:\r\n|\r|\n)/;
    
    // Split text to separate the content BEFORE the advice
    let mainContent = resultText || "";
    const splitMatch = mainContent.match(adviceRegex);
    let adviceContent = "";
    
    if (splitMatch && splitMatch.index !== undefined) {
         adviceContent = mainContent.substring(splitMatch.index); // Keep advice for modal extraction later
         mainContent = mainContent.substring(0, splitMatch.index); // Remove from main view
    }

    const handleAdviceClick = () => {
        // Extract raw advice text to pass to modal
        const textToPass = adviceContent.replace(/## 📜.*(?:\r\n|\r|\n)/, '').trim();
        onOpenBalance(textToPass);
    };

    // --- REORDERING LOGIC FOR AURA -> CHART -> ELEMENTS TEXT ---
    // The "Five Elements" header is the split point.
    // Ensure we use the translated header key for splitting if possible, 
    // but fallback to known English structure if translation fails or text is raw.
    const elementsHeaderSearch = `## ⚖️`; 
    
    let auraSection = mainContent;
    let elementsAndRest = "";
    let splitSuccess = false;

    if (calculatedElements && mainContent.includes(elementsHeaderSearch)) {
        const parts = mainContent.split(elementsHeaderSearch);
        if (parts.length > 1) {
            auraSection = parts[0];
            // Re-add the icon/header manually in render
            elementsAndRest = parts.slice(1).join(elementsHeaderSearch); 
            splitSuccess = true;
        }
    }

    return (
        <div style={{
            width: '95%', 
            maxWidth: '820px', 
            margin: '0 auto', 
            paddingBottom: '3rem',
            position: 'relative'
        }}>
            
            {/* Masterfully Polished Header Badge */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(15, 10, 25, 0.9) 0%, rgba(5, 3, 10, 0.95) 100%)', 
                padding: '20px', 
                borderRadius: '12px', 
                border: `2px solid ${theme.gold}`, 
                marginBottom: '25px', 
                display: 'flex', 
                justifyContent: 'space-around', 
                flexWrap: 'wrap', 
                gap: '15px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(212, 175, 55, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Micro corner decorations */}
                <div style={{ position: 'absolute', top: '5px', left: '5px', width: '12px', height: '12px', borderLeft: `1px solid ${theme.gold}`, borderTop: `1px solid ${theme.gold}`, opacity: 0.7 }} />
                <div style={{ position: 'absolute', top: '5px', right: '5px', width: '12px', height: '12px', borderRight: `1px solid ${theme.gold}`, borderTop: `1px solid ${theme.gold}`, opacity: 0.7 }} />
                <div style={{ position: 'absolute', bottom: '5px', left: '5px', width: '12px', height: '12px', borderLeft: `1px solid ${theme.gold}`, borderBottom: `1px solid ${theme.gold}`, opacity: 0.7 }} />
                <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '12px', height: '12px', borderRight: `1px solid ${theme.gold}`, borderBottom: `1px solid ${theme.gold}`, opacity: 0.7 }} />

                <div style={{textAlign: 'center', minWidth: '80px'}}>
                    <div style={{color: '#999', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase'}}>{t.ageLabel}</div>
                    <div style={{fontSize: '1.4rem', color: theme.gold, fontWeight: 'bold', fontFamily: 'Cinzel, serif', textShadow: '0 0 5px rgba(212,175,55,0.4)'}}>{age}</div>
                </div>
                <div style={{width: '1px', background: 'rgba(212, 175, 55, 0.2)', height: '40px', alignSelf: 'center'}} />
                <div style={{textAlign: 'center', minWidth: '80px'}}>
                    <div style={{color: '#999', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase'}}>{t.genderLabel}</div>
                    <div style={{fontSize: '1.4rem', color: theme.gold, fontWeight: 'bold', fontFamily: 'Cinzel, Georgia, SimSun, serif', textShadow: '0 0 5px rgba(212,175,55,0.4)'}}>{gender === 'male' ? t.genderMale : t.genderFemale}</div>
                </div>
                {birthDate && (
                    <>
                        <div style={{width: '1px', background: 'rgba(212, 175, 55, 0.2)', height: '40px', alignSelf: 'center'}} />
                        <div style={{textAlign: 'center', minWidth: '150px'}}>
                            <div style={{color: '#999', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase'}}>{t.dobLabel}</div>
                            <div style={{fontSize: '1.3rem', color: theme.gold, fontWeight: 'bold', fontFamily: 'Cinzel, serif', textShadow: '0 0 5px rgba(212,175,55,0.4)'}}>{birthDate}</div>
                        </div>
                    </>
                )}
            </div>
            
            <div style={{
                ...styles.resultContainer, 
                border: `2.5px solid ${theme.gold}`,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(20, 12, 35, 0.95) 0%, rgba(6, 4, 12, 0.98) 100%)',
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(212, 175, 55, 0.08)',
                padding: '40px 30px',
                position: 'relative',
                overflow: 'hidden'
            }} className="result-container-mobile">

                {/* Corner Accents */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', width: '30px', height: '30px', borderLeft: `2.5px solid ${theme.gold}`, borderTop: `2.5px solid ${theme.gold}` }} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', width: '30px', height: '30px', borderRight: `2.5px solid ${theme.gold}`, borderTop: `2.5px solid ${theme.gold}` }} />
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '30px', height: '30px', borderLeft: `2.5px solid ${theme.gold}`, borderBottom: `2.5px solid ${theme.gold}` }} />
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '30px', height: '30px', borderRight: `2.5px solid ${theme.gold}`, borderBottom: `2.5px solid ${theme.gold}` }} />

                <div style={{...styles.toolbar, borderColor: 'rgba(212, 175, 55, 0.25)', marginBottom: '25px', position: 'relative', zIndex: 10}}>
                    <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                        <select style={{background: 'rgba(0,0,0,0.5)', color: theme.gold, border: `1px solid ${theme.darkGold}`, borderRadius: '4px', padding: '4px 8px', fontSize: '0.85rem', fontFamily: 'Cinzel, Georgia, SimSun, serif', cursor: 'pointer'}} value={language} onChange={onLanguageChange}>
                            {LANGUAGES.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                        <button onClick={onToggleSpeech} style={{background: 'rgba(212, 175, 55, 0.1)', border: `1px solid ${theme.gold}`, borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.gold, cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s'}} className="hover:bg-amber-500/20">
                            {isSpeaking ? <i className="fas fa-stop-circle"></i> : <i className="fas fa-volume-up"></i>}
                        </button>
                    </div>
                </div>

                {/* 1. Zodiac Images at Top - Only show if available */}
                {(zodiac || starSign) && (
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{textAlign: 'center', color: theme.gold, borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '8px', marginTop: '10px', fontFamily:'Cinzel, Georgia, SimSun, serif', fontSize: '1.4rem', textShadow: '0 0 8px rgba(212, 175, 55, 0.5)', letterSpacing: '2px'}}>☯ {t.zodiacTitle} ☯</h3>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '15px', marginBottom: '30px'}}>
                            {zodiac && (
                                <div style={{textAlign: 'center'}}>
                                    <img src={zodiacImg} style={{width: '90px', height: '90px', borderRadius: '50%', border: `2px solid ${theme.gold}`, boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'}} />
                                    <div style={{fontWeight: 'bold', color: theme.gold, marginTop: '5px'}}>{zodiacName}</div>
                                    <div style={{fontSize: '0.8rem', color: '#ccc'}}>{t.chineseZodiac}</div>
                                </div>
                            )}
                            {starSign && (
                                <div style={{textAlign: 'center'}}>
                                    <img src={starSignImg} style={{width: '90px', height: '90px', borderRadius: '50%', border: `2px solid ${theme.gold}`, boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'}} />
                                    <div style={{fontWeight: 'bold', color: theme.gold, marginTop: '5px'}}>{starSignName}</div>
                                    <div style={{fontSize: '0.8rem', color: '#ccc'}}>{t.westernZodiac}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Mystical Cosmic Portal Banner */}
                <div style={{width: '100%', height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '25px', position: 'relative', border: `1px solid rgba(212, 175, 55, 0.4)`, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'}}>
                    <img 
                        src={`https://image.pollinations.ai/prompt/${encodeURIComponent("gorgeous spiritual celestial portal with glowing golden sacred geometry constellations, high fantasy art style, deep purple and gold starry nebula, cinematic lighting, 16:9, digital painting, high resolution")}?width=800&height=320&nologo=true`}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                        alt="Celestial Portal"
                    />
                    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(6, 4, 12, 0.95) 100%)'}} />
                    <div style={{position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '90%'}}>
                        <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.8rem', margin: 0, textShadow: '0 0 10px rgba(212, 175, 55, 0.8)'}}>{t.resultTitle}</h2>
                    </div>
                </div>
                
                {isTranslating ? (
                    <div style={{textAlign:'center', padding:'40px', color: theme.darkGold}}>
                        <i className="fas fa-spinner fa-spin" style={{fontSize: '2rem'}}></i>
                        <div style={{marginTop:'10px'}}>{t.translating}</div>
                    </div>
                ) : (
                   <>
                        {/* 
                           CUSTOM LAYOUT LOGIC:
                           1. Aura (First Section)
                           2. Five Elements Header
                           3. Pie Chart
                           4. Five Elements Text & Rest
                        */}
                        
                        {splitSuccess ? (
                            <>
                                {/* 1. Aura Section */}
                                <div className="fade-in" dangerouslySetInnerHTML={{ __html: formatMarkdown(auraSection) }} />
                                
                                {/* 2. Header & 3. Chart */}
                                {calculatedElements && (
                                    <>
                                        <h3 style={{color: theme.gold, borderBottom:`1px solid rgba(212, 175, 55, 0.4)`, paddingBottom:'5px', marginTop:'20px', fontFamily:'Cinzel, serif', textShadow: '0 0 5px rgba(212, 175, 55, 0.3)'}}>
                                             ⚖️ {t.reportHeaderElements}
                                        </h3>
                                        <FiveElementsChart elements={calculatedElements} t={t} />
                                    </>
                                )}

                                {/* 4. Elements Text & Rest */}
                                <div className="fade-in" dangerouslySetInnerHTML={{ __html: formatMarkdown(elementsAndRest) }} />
                            </>
                        ) : (
                            /* Fallback if split failed (e.g. prompt text mismatch) */
                            <>
                                {calculatedElements && (
                                    <>
                                        <h3 style={{color: theme.gold, borderBottom:`1px solid rgba(212, 175, 55, 0.4)`, paddingBottom:'5px', marginTop:'20px', fontFamily:'Cinzel, serif', textShadow: '0 0 5px rgba(212, 175, 55, 0.3)'}}>
                                             ⚖️ {t.reportHeaderElements}
                                        </h3>
                                        <FiveElementsChart elements={calculatedElements} t={t} />
                                    </>
                                )}
                                <div className="fade-in" dangerouslySetInnerHTML={{ __html: formatMarkdown(mainContent) }} />
                            </>
                        )}
                        
                        {/* Master Optimization Button (Replaces content) */}
                        <div style={{textAlign: 'center', marginTop: '30px', marginBottom: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '20px'}}>
                            <button style={{...styles.button, width: '100%', padding: '15px', fontSize: '1.1rem'}} onClick={handleAdviceClick}>
                                <i className="fas fa-magic"></i> {t.masterOptimizationBtn || "Master Optimization Advice"}
                            </button>
                        </div>
                   </>
                )}

            </div>
            
            <div style={{marginTop: '2.5rem', background: 'rgba(18, 9, 31, 0.6)', border: `1px solid rgba(212, 175, 55, 0.3)`, borderRadius: '12px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
                <h3 style={{textAlign: 'center', color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.4rem', margin: '0 0 5px 0', textShadow: '0 0 8px rgba(212, 175, 55, 0.4)'}}>{t.recommendedProducts}</h3>
                <p style={{textAlign: 'center', color: '#ccc', fontStyle: 'italic', marginBottom: '20px', fontSize: '0.9rem'}}>
                   {t.luckyElement}: <span style={{color: theme.gold, fontWeight: 'bold'}}>{t[`element${missingElement}`] || missingElement}</span>
                </p>
                <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                    {recommendedProducts.map(prod => {
                        const prodName = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacName) : prod.defaultName;
                        // Seed recommended product images too for speed
                        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=200&height=200&nologo=true&seed=${prod.id}`;
                        return (
                            <div key={prod.id} style={{minWidth: '170px', background: 'rgba(6, 4, 12, 0.8)', border: `1px solid rgba(212, 175, 55, 0.3)`, borderRadius: '8px', padding: '12px', textAlign: 'center', transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}} className="hover:border-amber-400 group">
                                <div style={{cursor: 'pointer'}} onClick={() => onViewProduct(prod)}>
                                    <img src={imgUrl} style={{width: '100%', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.15)', transition: 'transform 0.3s'}} className="group-hover:scale-105" loading="lazy" />
                                    <div style={{fontSize: '0.85rem', color: theme.gold, fontWeight: 'bold', margin: '8px 0 4px 0', height: '36px', overflow: 'hidden', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical'}}>{prodName}</div>
                                    <div style={{fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontSize: '0.95rem'}}>{prod.price}</div>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px'}}>
                                    <button style={{...styles.button, padding: '6px 12px', fontSize: '0.8rem', minWidth: 'auto', margin: 0, width: '100%', borderRadius: '4px'}} onClick={() => onBuyProduct(prod)}>{t.buyNow}</button>
                                    <button style={{background: 'rgba(212, 175, 55, 0.1)', color: theme.gold, border: '1px solid rgba(212, 175, 55, 0.4)', padding: '5px 10px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', width: '100%'}} onClick={() => onViewProduct(prod)} className="hover:bg-amber-500/20">{t.viewDetails || "View Details"}</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
               <button style={styles.button} onClick={onAnalyzeAnother}>{t.analyzeAnother}</button>
            </div>
        </div>
    );
};
