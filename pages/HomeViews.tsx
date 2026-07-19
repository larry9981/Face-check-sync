
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { theme, styles } from '../theme';
import { BaguaSVG, FaceMapSVG } from '../components/Icons';
import { FiveElementsChart } from '../components/Charts';
import { getChineseZodiac, getWesternZodiac, calculateAge, handleImageError } from '../utils';
import { SHOP_PRODUCTS } from '../products';
import { HistoryRecord } from '../types';

export const LoadingSpinner = ({ t, progress, message }: { t: any, progress?: number, message?: string }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', width: '100%', maxWidth: '400px' }}>
    <div style={{...styles.baguaContainer, width: '100px', height: '100px', margin: '0 auto', animation: 'spin 1.5s linear infinite'}}>
       {BaguaSVG}
    </div>
    <h3 style={{ marginTop: '1rem', color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.5rem' }}>
      {t.analyzingTitle}
    </h3>
    <p style={{ fontSize: '1rem', color: '#888', fontStyle: 'italic', marginBottom: '20px', fontFamily: '"Space Grotesk", sans-serif' }}>
      {message || t.analyzingDesc}
    </p>
    
    {/* Analysis Progress Bar */}
    {typeof progress === 'number' && (
      <div style={{width: '100%', padding: '0 20px', boxSizing: 'border-box'}}>
        <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', border: `1px solid rgba(102, 192, 244, 0.25)`}}>
            <div style={{
                width: `${progress}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, #47BFFF, #1A44C2)`, 
                transition: 'width 0.1s linear',
                boxShadow: `0 0 10px rgba(102, 192, 244, 0.5)`
            }}></div>
        </div>
        <div style={{color: theme.gold, fontSize: '0.9rem', marginTop: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
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
        border: `1.5px solid ${theme.accent}`,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102,192,244,0.12) 0%, rgba(23,38,54,0.95) 100%)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
        boxShadow: '0 0 25px rgba(102, 192, 244, 0.22), inset 0 0 15px rgba(102, 192, 244, 0.05)',
        overflow: 'hidden' as const
    };

    return (
    <div style={{
      ...styles.glassPanel, 
      border: `2px solid rgba(102, 192, 244, 0.22)`, 
      padding: '4rem 2rem', 
      boxShadow: `0px 15px 50px rgba(0, 0, 0, 0.9), inset 0px 0px 35px rgba(102, 192, 244, 0.05)`, 
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #172636 0%, #171a21 100%)'
    }} className="glass-panel-mobile">
      
      {/* Decorative Celestial Corners */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', width: '25px', height: '25px', borderLeft: `2px solid ${theme.accent}`, borderTop: `2px solid ${theme.accent}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '15px', right: '15px', width: '25px', height: '25px', borderRight: `2px solid ${theme.accent}`, borderTop: `2px solid ${theme.accent}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '25px', borderLeft: `2px solid ${theme.accent}`, borderBottom: `2px solid ${theme.accent}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '25px', height: '25px', borderRight: `2px solid ${theme.accent}`, borderBottom: `2px solid ${theme.accent}`, opacity: 0.5 }} />

      {/* Rotating Background Astrolabe Watermark */}
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          opacity: 0.03,
          pointerEvents: 'none',
          animation: 'spin 120s linear infinite',
          zIndex: 0,
          color: theme.accent
      }}>
          {BaguaSVG}
      </div>

      {/* Floating Celestial Symbols in Background */}
      <div style={{ position: 'absolute', top: '20%', left: '8%', fontSize: '1.8rem', color: 'rgba(102,192,244,0.15)', fontFamily: '"Space Grotesk", sans-serif', userSelect: 'none' }}>☉</div>
      <div style={{ position: 'absolute', top: '20%', right: '8%', fontSize: '1.8rem', color: 'rgba(102,192,244,0.15)', fontFamily: '"Space Grotesk", sans-serif', userSelect: 'none' }}>☾</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '8%', fontSize: '1.8rem', color: 'rgba(102,192,244,0.15)', fontFamily: '"Space Grotesk", sans-serif', userSelect: 'none' }}>✧</div>
      <div style={{ position: 'absolute', bottom: '20%', right: '8%', fontSize: '1.8rem', color: 'rgba(102,192,244,0.15)', fontFamily: '"Space Grotesk", sans-serif', userSelect: 'none' }}>✦</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{...styles.baguaContainer, margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 20px rgba(102, 192, 244, 0.45))', width: '95px', height: '95px', animation: 'spin 20s linear infinite', color: theme.accent}}>
             {BaguaSVG}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', marginBottom: '10px', color: theme.accent }}>
              <span style={{ fontSize: '1.2rem', color: theme.accent }}>✧</span>
              <span style={{ fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif', color: '#66c0f4' }}>Celestial Destiny Chamber</span>
              <span style={{ fontSize: '1.2rem', color: theme.accent }}>✧</span>
          </div>
          <h1 style={{fontSize: '2.8rem', fontWeight: 700, marginBottom: '1.2rem', color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{t.heroTitle}</h1>
          <p style={{color: '#dfdfd5', marginBottom: '2.5rem', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', letterSpacing: '0.5px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.heroDesc}</p>
          
          <div className="home-cards-container" style={{display: 'flex', gap: '2.50rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%', position: 'relative', zIndex: 2}}>
              
              {/* FACE READING CARD */}
              <div style={{
                  flex: '1 1 290px', 
                  maxWidth: '330px',
                  background: 'linear-gradient(135deg, rgba(23, 38, 54, 0.9) 0%, rgba(17, 26, 38, 0.95) 100%)', 
                  border: `1.5px solid rgba(102, 192, 244, 0.22)`, 
                  borderRadius: '12px', 
                  padding: '35px 25px', 
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(102,192,244,0.02)'
              }} 
              onClick={() => onStart('face')}
              onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 15px 45px rgba(102, 192, 244, 0.35)`;
              }}
              onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(102, 192, 244, 0.22)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
              }}
              >
                  <div style={imageBoxStyle}>
                      <FaceMapSVG t={t} />
                  </div>
                  <h3 style={{color: theme.gold, fontSize: '1.45rem', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '1px', margin: '0 0 15px 0', textTransform: 'uppercase'}}>{t.startBtn}</h3>
                  <button style={{...styles.button, width: '100%', marginTop: 'auto', letterSpacing: '1px', fontWeight: 'bold'}}>{t.scanBtn}</button>
              </div>
    
              {/* PALM READING CARD */}
              <div style={{
                  flex: '1 1 290px', 
                  maxWidth: '330px',
                  background: 'linear-gradient(135deg, rgba(23, 38, 54, 0.9) 0%, rgba(17, 26, 38, 0.95) 100%)', 
                  border: `1.5px solid rgba(102, 192, 244, 0.22)`, 
                  borderRadius: '12px', 
                  padding: '35px 25px', 
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(102,192,244,0.02)'
              }}
              onClick={() => onStart('palm')}
              onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 15px 45px rgba(102, 192, 244, 0.35)`;
              }}
              onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(102, 192, 244, 0.22)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
              }}
              >
                  <div style={imageBoxStyle}>
                      <i className="fas fa-hand-sparkles" style={{fontSize: '6.5rem', color: theme.accent, textShadow: '0 0 20px rgba(102,192,244,0.6)', zIndex: 2}}></i>
                      {/* Mystical Pulse Animation */}
                      <div style={{position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width: '130px', height:'130px', borderRadius:'50%', border:`2px solid ${theme.accent}`, animation: 'mysticalPulse 3s infinite', opacity: 0.6}}></div>
                  </div>
                  <h3 style={{color: theme.gold, fontSize: '1.45rem', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '1px', margin: '0 0 15px 0', textTransform: 'uppercase'}}>{t.palmBtn}</h3>
                  <button style={{...styles.button, width: '100%', marginTop: 'auto', letterSpacing: '1px', fontWeight: 'bold'}}>{t.scanPalmBtn}</button>
              </div>
    
          </div>
      </div>

      <div style={{marginTop: '35px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '10px'}}>
              <div style={{fontSize: '0.9rem', color: theme.gold, fontWeight: 'bold', background: 'rgba(102, 192, 244, 0.08)', padding: '8px 22px', borderRadius: '25px', border: `1px solid rgba(102, 192, 244, 0.25)`, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}>
                  <i className="fas fa-calendar-alt" style={{marginRight: '8px', color: theme.accent}}></i>
                  {t.freeTrialsHint ? t.freeTrialsHint.replace('{count}', (daysRemaining !== undefined ? daysRemaining : 3).toString()) : `Free trial active (${daysRemaining !== undefined ? daysRemaining : 3} days remaining)`}
              </div>
              <div style={{fontSize: '0.9rem', color: theme.gold, fontWeight: 'bold', background: 'rgba(102, 192, 244, 0.08)', padding: '8px 22px', borderRadius: '25px', border: `1px solid rgba(102, 192, 244, 0.25)`, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'}}>
                  <i className="fas fa-magic" style={{marginRight: '8px', color: theme.accent}}></i>
                  {language === 'zh' ? `免费测试剩余: ${freeTrials}/10次` : language === 'zht' ? `免費測試剩餘: ${freeTrials}/10次` : `Free readings remaining: ${freeTrials}/10`}
              </div>
          </div>
          <div style={{fontSize: '0.8rem', color: '#888', marginTop: '5px', fontStyle: 'italic', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
              {language === 'zh' ? "✧ 全站用户享有自首次使用起3天免费试用，总计最多可进行10次测试 ✧" : language === 'zht' ? "✧ 全站用戶享有自首次使用起3天免費試用，總計最多可進行10次測試 ✧" : "✧ All users enjoy a 3-day free trial from first use, up to 10 total readings across the site ✧"}
          </div>
      </div>
    </div>
  );
};

export const RenderSelectionView = ({ t, readingType, gender, dobYear, dobMonth, dobDay, dobHour, dobMinute, dobSecond, uploadProgress, userName, onSetUserName, onSetGender, onSetDobYear, onSetDobMonth, onSetDobDay, onSetDobHour, onSetDobMinute, onSetDobSecond, onStartCamera, onUpload, onBack, language, useAdvancedAnalysis, onToggleAdvanced, height, onSetHeight, weight, onSetWeight }: any) => {
    const years = Array.from({length: 151}, (_, i) => 1900 + i);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const hours = Array.from({length: 24}, (_, i) => i);
    const minutesSeconds = Array.from({length: 60}, (_, i) => i);
    
    // Check if we should show Name Input (China context)
    const isPalm = readingType === 'palm';

    return (
      <div style={{...styles.glassPanel, border: `1px solid rgba(102, 192, 244, 0.22)`, position: 'relative'}} className="glass-panel-mobile">
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
              onMouseOver={(e) => e.currentTarget.style.color = theme.accent}
              onMouseOut={(e) => e.currentTarget.style.color = '#888'}
          >
              &times;
          </button>

          <h2 style={{color: theme.gold, marginBottom: '20px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.chooseMethod}</h2>
          <div style={{textAlign: 'left', marginBottom: '20px'}}>
              <h3 style={{color: theme.accent, fontSize: '1.05rem', borderBottom: '1px solid rgba(102, 192, 244, 0.15)', paddingBottom: '5px', marginBottom: '15px', fontFamily: '"Space Grotesk", sans-serif'}}>{t.profileTitle}</h3>
              
               {/* Advanced Analysis Checkbox */}
               <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px', cursor: 'pointer'}} onClick={onToggleAdvanced}>
                  <div style={{
                      width: '20px', height: '20px', 
                      border: `1px solid ${theme.accent}`, 
                      background: useAdvancedAnalysis ? theme.accent : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                      {useAdvancedAnalysis && <i className="fas fa-check" style={{color: '#05040a', fontSize: '0.8rem'}}></i>}
                  </div>
                  <span style={{color: theme.text, fontSize: '0.9rem', fontFamily: '"Space Grotesk", sans-serif'}}>{t.combineAnalysis}</span>
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

              <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                  <div style={{flex: 1}}>
                      <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.heightLabel}</label>
                      <input 
                         type="number" 
                         style={styles.formInput} 
                         value={height || ''} 
                         onChange={(e) => onSetHeight(e.target.value)} 
                         placeholder={t.heightPlaceholder}
                         min="1"
                      />
                  </div>
                  <div style={{flex: 1}}>
                      <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>{t.weightLabel}</label>
                      <input 
                         type="number" 
                         style={styles.formInput} 
                         value={weight || ''} 
                         onChange={(e) => onSetWeight(e.target.value)} 
                         placeholder={t.weightPlaceholder}
                         min="1"
                      />
                  </div>
              </div>

          </div>
          <button style={{...styles.button, width: '100%', color: '#fff'}} onClick={onStartCamera}>
            <i className={`fas ${isPalm ? 'fa-hand-sparkles' : 'fa-camera'}`}></i> {isPalm ? t.scanPalmBtn : t.scanBtn}
          </button>
          <div style={{marginTop: '15px', position: 'relative'}}>
            <button style={{...styles.secondaryButton, width: '100%'}} onClick={() => document.getElementById('file-upload')?.click()}>
               <i className="fas fa-upload"></i> {t.uploadBtn}
            </button>
            <input type="file" id="file-upload" accept="image/*" style={styles.input} onChange={onUpload} />
             {/* Upload Progress Bar */}
             {uploadProgress > 0 && (
                  <div style={{width: '100%', marginTop: '10px'}}>
                      <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'}}>
                          <div style={{width: `${uploadProgress}%`, height: '100%', background: theme.accent, transition: 'width 0.2s'}}></div>
                      </div>
                      <div style={{fontSize: '0.8rem', color: theme.accent, marginTop: '5px', textAlign: 'right'}}>{Math.round(uploadProgress)}%</div>
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
                        border: `1px solid ${theme.accent}`, 
                        borderRadius: '4px', 
                        color: theme.accent, 
                        padding: '8px 15px', 
                        cursor: 'pointer', 
                        zIndex: 20, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontFamily: '"Space Grotesk", sans-serif', 
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
                <i className="fas fa-user-lock" style={{fontSize: '3rem', color: theme.accent, marginBottom: '1rem'}}></i>
                <h2 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', marginBottom: '1rem'}}>Access Restricted</h2>
                <p style={{color: '#aaa', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: '1.6', fontFamily: '"Space Grotesk", sans-serif'}}>Please log in or sign up to save shipping addresses, manage subscriptions, secure your billing info, and view analytical palm/face reading logs.</p>
            </div>
        );
    }

    return (
        <div style={{...styles.glassPanel, maxWidth: '850px', width: '95%', padding: '2rem'}}>
            <h2 style={{color: theme.gold, textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif', marginBottom: '0.5rem'}}>{t.historyTitle || "Personal Dashboard"}</h2>
            <p style={{color: '#888', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: '"Space Grotesk", sans-serif'}}>Control center for your spiritual readings, transactions, and membership settings.</p>
            
            {/* Nav tabs bar */}
            <div style={{display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '5px'}}>
                <button 
                    type="button"
                    onClick={() => setSubTab('profile')}
                    style={{
                        padding: '12px 20px', background: 'transparent', border: 'none',
                        borderBottom: subTab === 'profile' ? `2px solid ${theme.accent}` : 'none',
                        color: subTab === 'profile' ? theme.accent : '#aaa',
                        fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.95rem'
                    }}
                >
                    <i className="fas fa-address-card" style={{marginRight: '8px'}}></i>Profile & Shipping Address
                </button>
                <button 
                    type="button"
                    onClick={() => setSubTab('orders')}
                    style={{
                        padding: '12px 20px', background: 'transparent', border: 'none',
                        borderBottom: subTab === 'orders' ? `2px solid ${theme.accent}` : 'none',
                        color: subTab === 'orders' ? theme.accent : '#aaa',
                        fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.95rem'
                    }}
                >
                    <i className="fas fa-receipt" style={{marginRight: '8px'}}></i>Billing & Subscriptions
                </button>
                <button 
                    type="button"
                    onClick={() => setSubTab('readings')}
                    style={{
                        padding: '12px 20px', background: 'transparent', border: 'none',
                        borderBottom: subTab === 'readings' ? `2px solid ${theme.accent}` : 'none',
                        color: subTab === 'readings' ? theme.accent : '#aaa',
                        fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.95rem'
                    }}
                >
                    <i className="fas fa-history" style={{marginRight: '8px'}}></i>Past Readings ({history.length})
                </button>
            </div>

            {subTab === 'profile' && (
                <form onSubmit={handleSaveAddress} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div style={{background: 'rgba(102,192,244,0.05)', padding: '15px', borderLeft: `3px solid ${theme.accent}`, marginBottom: '10px', borderRadius: '4px'}}>
                        <h4 style={{color: theme.accent, margin: '0 0 5px 0', fontSize: '1rem', fontFamily: '"Space Grotesk", sans-serif'}}>Logged In Account Status</h4>
                        <div style={{color: '#ddd', fontSize: '0.9rem', marginBottom: '4px', fontFamily: '"Space Grotesk", sans-serif'}}>Email: {userState.email}</div>
                        <div style={{color: theme.accent, fontSize: '0.85rem', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>Personal Account ID: <span style={{letterSpacing: '1px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff'}}>{userState.id || userState.userId}</span></div>
                        
                        {/* Welcome Free Quotas */}
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(102, 192, 244, 0.2)'}}>
                            <div style={{fontSize: '0.85rem', color: theme.accent, background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-smile"></i> {t.freeFaceRemainingText || "Free Welcome Face Readings"}: <span style={{color: '#fff', fontWeight: 'bold'}}>{userState.freeFaceRemaining !== undefined ? userState.freeFaceRemaining : 3}</span>
                            </div>
                            <div style={{fontSize: '0.85rem', color: theme.accent, background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-hand-paper"></i> {t.freePalmRemainingText || "Free Welcome Palm Readings"}: <span style={{color: '#fff', fontWeight: 'bold'}}>{userState.freePalmRemaining !== undefined ? userState.freePalmRemaining : 3}</span>
                            </div>
                        </div>
                    </div>

                    <h3 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', marginTop: '10px'}}>Contact Information</h3>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}} className="responsive-grid">
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>FIRST NAME</label>
                            <input 
                                type="text" placeholder="First Name" style={styles.formInput} 
                                value={firstNameDraft} onChange={e => setFirstNameDraft(e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>LAST NAME</label>
                            <input 
                                type="text" placeholder="Last Name" style={styles.formInput} 
                                value={lastNameDraft} onChange={e => setLastNameDraft(e.target.value)} required 
                            />
                        </div>
                    </div>

                    <h3 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', marginTop: '15px'}}>Shipping & Delivery Address</h3>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px'}} className="responsive-grid">
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>COUNTRY</label>
                            <input 
                                type="text" placeholder="e.g. United States" style={styles.formInput} 
                                value={countryDraft} onChange={e => setCountryDraft(e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>STATE / PROVINCE</label>
                            <input 
                                type="text" placeholder="e.g. California" style={styles.formInput} 
                                value={stateDraft} onChange={e => setStateDraft(e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>ZIP / POSTAL CODE</label>
                            <input 
                                type="text" placeholder="e.g. 90210" style={styles.formInput} 
                                value={zipCodeDraft} onChange={e => setZipCodeDraft(e.target.value)} required 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>STREET ADDRESS / ROAD ADDRESS</label>
                        <input 
                            type="text" placeholder="e.g. 123 Celestial Realm Boulevard" style={styles.formInput} 
                            value={streetAddressDraft} onChange={e => setStreetAddressDraft(e.target.value)} required 
                        />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}} className="responsive-grid">
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>BUILDING NAME</label>
                            <input 
                                type="text" placeholder="e.g. Jade Tower Alpha (Optional)" style={styles.formInput} 
                                value={buildingNameDraft} onChange={e => setBuildingNameDraft(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>ROOM / SUITE NUMBER</label>
                            <input 
                                type="text" placeholder="e.g. Suite 888 (Optional)" style={styles.formInput} 
                                value={roomNumberDraft} onChange={e => setRoomNumberDraft(e.target.value)} 
                            />
                        </div>
                    </div>

                    {saveStatus === 'success' && (
                        <div style={{padding: '10px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                            <i className="fas fa-check-circle"></i> Shipping profiles & address coordinates updated successfully!
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div style={{padding: '10px', background: 'rgba(231,76,60,0.15)', color: '#e74c3c', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
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
                        <h3 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', margin: '0 0 15px 0'}}>Membership Plan</h3>
                        <div style={{background: 'rgba(102, 192, 244, 0.03)', border: `1px solid rgba(102, 192, 244, 0.25)`, borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
                            <div>
                                <div style={{fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                    <i className="fas fa-crown" style={{color: theme.accent}}></i> 
                                    {userState.isSubscribed ? "Daily Membership Subscription" : "Standard Guest Plan"}
                                </div>
                                <div style={{fontSize: '0.85rem', color: '#888', marginTop: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
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
                                    fontSize: '0.85rem',
                                    fontFamily: '"Space Grotesk", sans-serif'
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
                        <h3 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px', margin: '0 0 15px 0'}}>Purchase Transactions Logs</h3>
                        
                        {loadingOrders ? (
                            <div style={{textAlign: 'center', padding: '20px', color: theme.accent}}><i className="fas fa-spinner fa-spin"></i> Retrieving Ledger...</div>
                        ) : orders.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '20px', border: '1px dashed rgba(102, 192, 244, 0.2)', borderRadius: '8px', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>
                                No transaction invoices registered yet for {userState.email}.
                            </div>
                        ) : (
                            <div style={{overflowX: 'auto', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#ccc', fontFamily: '"Space Grotesk", sans-serif'}}>
                                    <thead>
                                        <tr style={{background: 'rgba(102, 192, 244, 0.1)', borderBottom: '1px solid rgba(102, 192, 244, 0.15)'}}>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.accent}}>Invoice ID</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.accent}}>Item Ordered</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.accent}}>Total Paid</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.accent}}>Date</th>
                                            <th style={{padding: '12px 15px', textAlign: 'left', color: theme.accent}}>Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, idx) => (
                                            <tr key={idx} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                                                <td style={{padding: '10px 15px', fontWeight: 'bold'}}>{order.orderId}</td>
                                                <td style={{padding: '10px 15px'}}>{order.items}</td>
                                                <td style={{padding: '10px 15px', color: theme.accent, fontWeight: 'bold'}}>${parseFloat(order.total || 0).toFixed(2)}</td>
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
                    <div style={{textAlign: 'center', color: '#aaa', padding: '2rem', fontFamily: '"Space Grotesk", sans-serif'}}>{t.noHistory}</div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {history.map((record: HistoryRecord) => (
                            <div key={record.id} style={{
                                background: 'rgba(0,0,0,0.3)', 
                                border: `1px solid rgba(102, 192, 244, 0.25)`, 
                                borderRadius: '8px', 
                                padding: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '10px',
                                fontFamily: '"Space Grotesk", sans-serif'
                            }}>
                                <div>
                                    <div style={{color: theme.accent, fontWeight: 'bold'}}>{record.name || (record.gender === 'male' ? t.genderMale : t.genderFemale)}</div>
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
                                        border: `1px solid ${theme.accent}`, 
                                        color: theme.accent, 
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
    const accentColor = theme.accent;
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
                   borderRadius: isPalm ? '15px' : '50% 50% 45% 45%',
                   border: `2.5px solid ${theme.accent}`,
                   boxShadow: `0 0 25px ${theme.accent}`
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
                           textShadow: `0 0 20px ${theme.accent}`,
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

export const RenderResultView = ({ t, readingType, birthDate, gender, calculatedElements, resultText, language, isSpeaking, isTranslating, LANGUAGES, onLanguageChange, onToggleSpeech, onAnalyzeAnother, onBuyProduct, onOpenBalance, onViewProduct, image }: any) => {
    const [sliderIndex, setSliderIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'slider' | 'full'>('slider');
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [pdfDownloading, setPdfDownloading] = useState(false);

    const age = calculateAge(birthDate);
    const zodiac = getChineseZodiac(birthDate);
    const starSign = getWesternZodiac(birthDate);
    const zodiacName = zodiac ? (t[`zodiac${zodiac}`] || zodiac) : "";
    const starSignName = starSign ? (t[`star${starSign}`] || starSign) : "";
    const missingElement = calculatedElements?.missingElement || 'Metal';

    // Premium image prompts
    const zodiacImg = zodiac ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`exquisite glowing golden oriental zodiac ${zodiac} animal spirit, ancient Chinese ink wash watercolor painting style with floating sparkles, deep cosmic starry night background`)}?width=300&height=300&nologo=true` : "";
    const starSignImg = starSign ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`celestial western constellation sign ${starSign} spirit guardian, glowing stardust nebula, detailed sacred geometry, gold and deep indigo`)}?width=300&height=300&nologo=true` : "";

    // Generate personalized recommended products
    const recommendedProducts = React.useMemo(() => {
        let matched = SHOP_PRODUCTS.filter(p => p.zodiac === zodiac || p.zodiac === starSign || p.element === missingElement);
        if (matched.length === 0) matched = SHOP_PRODUCTS;
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

    // Bazi Element Details
    const elementScores = calculatedElements?.scores || { Metal: 20, Wood: 20, Water: 20, Fire: 20, Earth: 20 };

    // Dynamic Astrological Generator for structured slides
    const reportData = React.useMemo(() => {
        const isZH = language && language.startsWith('zh');
        
        // Dynamic fables depending on the missing/weak element
        const fables = {
            Metal: {
                title: isZH ? "干将莫邪与太白金星" : "The Sword of Absolute Alignment",
                text: isZH ? "昔日名匠在昆仑山麓炼剑，因炉火缺金，神剑难成。太白金星降临，指点引西方庚辛金气注入。剑成之日，天地清明，扫尽邪气。此故事寓意您的命盘需要补充‘金’之刚毅与决断，以锋芒破除混沌，稳固前行。" : "An ancient ironsmith sought to forge the Sword of Order, but the furnace lacked metallic alignment. A star celestial descended, channeling West Metal energy. The resulting blade cleared all environmental static. Your chart requires this Metal focus to pierce through confusion."
            },
            Wood: {
                title: isZH ? "建木通天与神农尝百草" : "The Cosmic Tree of Longevity",
                text: isZH ? "远古天地混沌，神农氏在东方种下神木‘建木’。建木吸纳日月精华，舒展枝叶连通神界，带来无限生机。此故事揭示补充‘木’之生命力能助您激发元气，开启灵感，在逆境中如古木般坚韧破土，开枝散叶。" : "In the dawn epoch, a celestial sage planted the Seed of Life in the east. It grew into a cosmic tree connecting earth and stars, channeling healing wood essence. This reveals that reinforcing your Wood element will rejuvenate your bio-energetic growth and unlock organic abundance."
            },
            Water: {
                title: isZH ? "大禹治水与江河奔流" : "The Stream of Endless Adaptability",
                text: isZH ? "洪荒时期，江河泛滥。大禹不随流堵截，而是顺应水性，疏导百川入海，最终成就万世生机。水流无形却能穿石。这告诉我们，您命盘中‘水’的充盈能带来极致的变通与智慧，以柔克刚，让财源如奔流江水般源源不断。" : "During the great floods, a master of rivers did not block the tides but aligned with their nature, directing water to the oceans. Water is soft yet carves stone. Nurturing your Water element invites supreme adaptability, allowing your wealth to flow unimpeded like clean mountain streams."
            },
            Fire: {
                title: isZH ? "燧人氏取火与丹凤朝阳" : "The Flame of Spiritual Awakening",
                text: isZH ? "远古黑夜漫长，燧人氏感悟星象，钻木取火，为世间带来光明与温暖，百邪不敢近。丹凤飞临火海，浴火重生。此故事寓意您命盘需要‘火’之能量，点燃热情、勇气与社交磁场，以温暖耀眼的光芒吸引贵人。" : "To banish eternal night, an ancient philosopher aligned with cosmic friction, sparkled the primordial flame, and brought warmth and light. A phoenix rose from the fire, ascending to the sun. This symbolizes that your path requires Fire energy to burn away self-doubt and ignite your charismatic resonance."
            },
            Earth: {
                title: isZH ? "女娲造人与泰山安石" : "The Sovereign Jade Earth",
                text: isZH ? "开天辟地之初，大地空旷。女娲娘娘抟黄土造人，落地皆成生机，大地因而稳固富饶。泰山之石，安稳承载万物。此故事寓意您的命理需要‘土’之稳固与信用，如大地般厚德载物，能稳稳承载并守住一生财富。" : "At the beginning of spatial form, the sovereign matrix was empty. The Goddess combined pure clay with river essence, stabilizing the physical world. This represents that cultivating Earth energy within your chart anchors your core foundation and guarantees you hold on to your assets."
            }
        }[missingElement as keyof typeof fables] || {
            title: isZH ? "太极阴阳之平衡" : "The Way of Yin-Yang Harmony",
            text: isZH ? "万物负阴而抱阳，冲气以为和。天地万物皆在五行流动之中，盈缺本是常态，调和即是天命。" : "Everything carries yin and embraces yang. Energy flows constantly through elemental transitions. Achieving equilibrium within your temporal coordinate is the highest purpose of destiny."
        };

        const list = [
            {
                id: 'aura',
                title: isZH ? "🔮 综合命格与玄学气场" : "🔮 Aura & Destiny Portal",
                illustrationType: 'aura' as const,
                content: isZH 
                  ? `根据您的面相或手相特征，您的气场呈现出尊贵的**紫金祥云气场**。在宇宙全息能量场中，这代表您天生具有敏锐的直觉和强烈的气场感召力。当前天命星轨正处于能量上升轨道，神光内敛。您的生命元气充沛，但需注意在日常行事中避免情绪急躁，保持气场的中正与平和，如此便能自然化解外界煞气，吸引祥瑞磁场。`
                  : `According to your biometric scans, your aura radiates a rare **Imperial Purple & Gold resonance**. In the cosmic energy web, this indicates high-frequency intuition and spatial authority. Your celestial vectors are currently on an ascending transit. Your bio-photons are highly active, though managing energetic restlessness is recommended to keep your spiritual core balanced and naturally repel static forces.`
            },
            {
                id: 'elements',
                title: isZH ? "⚖️ 五行相生相克精细分析" : "⚖️ Wu Xing Five Elements Process",
                illustrationType: 'wuxing' as const,
                content: isZH
                  ? `经过对您出生时间与形相格局的深度解析，得出您的五行精细占比：金（${elementScores.Metal}%）、木（${elementScores.Wood}%）、水（${elementScores.Water}%）、火（${elementScores.Fire}%）、土（${elementScores.Earth}%）。
                  
                  您命格中**最弱的五行元素为「${t[`element${missingElement}`] || missingElement}」**。在五行生克中，金克木、木克土、土克水、水克火、火克金。因为「${t[`element${missingElement}`] || missingElement}」气微，导致您的生命链条在这一环出现能量衰退和传导受阻。需要通过日常穿戴、膳食、和居家风水摆件来全力调和，方能重构完整的五行太极循环。`
                  : `A precise breakdown of your birth coordinates and facial topography reveals your Wu Xing distribution: Metal (${elementScores.Metal}%), Wood (${elementScores.Wood}%), Water (${elementScores.Water}%), Fire (${elementScores.Fire}%), Earth (${elementScores.Earth}%).
                  
                  Your **weakest and missing elemental anchor is 「${t[`element${missingElement}`] || missingElement}」**. In cosmic metaphysics, elements generate and overcome each other in a continuous chain. The depletion of ${missingElement} acts as a spiritual bottleneck, restricting your career and energy flow. Restoring this elemental node will complete your bio-energetic circuit.`
            },
            {
                id: 'zodiac',
                title: isZH ? "🌌 本命星盘与天命星象" : "🌌 Zodiac & Constellation Alignment",
                illustrationType: 'zodiac' as const,
                content: isZH
                  ? `您的本命属相为**${zodiacName}**，本命星座为**${starSignName}**。
                  
                  在东方十二地支与西方黄道十二宫的双重映射下，您的灵魂图谱中流淌着${zodiacName}的稳健与${starSignName}的独特灵性。当前岁星运转至您的福德宫，天体引力波与您的生物电磁场产生了积极的共振。星象预示着近三个月内，您将迎来一波意识的觉醒与天启，若能抓住这次星象位移，将实现阶层或心智的跃迁。`
                  : `Your Chinese Zodiac animal is the **${zodiacName}** and your Western astrological sign is **${starSignName}**.
                  
                  The dual alignment of Chinese earthly branches and Western constellations reveals a highly responsive spiritual architecture. Jupiter's current transit through your Luck House creates a powerful constructive interference with your personal magnetic field. Astrological indicators suggest that over the next ninety days, celestial alignments will provide key revelations to elevate your position.`
            },
            {
                id: 'personality',
                title: isZH ? "🧠 性格特质与精神潜能" : "🧠 Personality & Cognitive Potential",
                illustrationType: 'personality' as const,
                content: isZH
                  ? `面相与掌纹显示出您具有**双重性格维度**。在外您表现出坚韧、独立和强烈的责任感，是他人眼中值得信赖的支柱；而在内心深处，您保留着敏感、理想主义与对精神自由的极度渴望。您的大脑量子神经网络蕴藏着巨大的直觉创造力。
                  
                  **性格隐患**：有时容易陷入自我怀疑和过度思虑（内耗），在关键决断时由于追求完美而错失良机。建议通过意念冥想和五行调和来打破心智枷锁，释放深层精神潜能。`
                  : `Your facial structures and palm pathways indicate a highly refined **dual personality**. Externally, you display formidable resilience, independence, and a keen sense of duty, serving as a beacon of trust. Internally, you preserve deep empathy, high idealism, and a thirst for spiritual freedom. Your cognitive aura possesses profound intuitive creativity.
                  
                  **Vulnerability Alert**: You are susceptible to mental over-processing and self-imposed anxiety. This search for perfection can delay execution. Harmonizing your missing elements will release these energetic locks and unleash your true potential.`
            },
            {
                id: 'wealth',
                title: isZH ? "💰 八字财运与事业腾飞" : "💰 Career & Wealth Trajectory",
                illustrationType: 'wealth' as const,
                content: isZH
                  ? `在财运方面，您的命盘中「财源」与「官禄」双星暗拱。您的财富格局属于**“厚积薄发型”**。前半生多为辛苦耕耘、积累经验与人脉的阶段，中晚年将迎来大运爆发。
                  
                  **财富过程分析**：您的财帛宫（鼻翼/掌心财线）气色红润，表明正财稳固，适合在专业领域深耕。然而由于命局中缺${t[`element${missingElement}`] || missingElement}，偏财偏弱，不宜盲目进行高风险投资。
                  
                  **黄金事业期**：在未来的28岁、35岁、42岁、51岁，您的命盘将迎来天干地支合汇的财大运，届时只要顺应运势，果断突破，便能实现财富与社会地位的成倍翻番。`
                  : `In financial terms, your celestial chart shows your Wealth Star and Career Star complementing each other. Your financial signature is **\"Stable Growth with Late Peaks\"**. Your early years focus on skill tempering and building alliances, laying the foundation for significant financial expansions later.
                  
                  **Wealth Dynamics**: Your abundance centers display healthy vital flow, indicating steady career income. However, because of your missing ${missingElement} energy, speculative or high-risk investments should be approached with extreme caution.
                  
                  **Golden Transits**: Ages 28, 35, 42, and 51 represent major cosmic portals where the heavenly stems align with your earth branches, unlocking exceptional opportunities to double your wealth.`
            },
            {
                id: 'marriage',
                title: isZH ? "❤️ 婚恋情缘与家族宿命" : "❤️ Marriage & Family Resonance",
                illustrationType: 'marriage' as const,
                content: isZH
                  ? `您的婚姻宫与红鸾星相呼应，一生感情运势偏向**“细水长流”**。在恋爱或婚姻中，您极度重视灵魂的契合与情绪价值的共鸣。您是一位体贴、忠诚且愿意为家庭付出深沉爱意的伴侣。
                  
                  **家庭状态分析**：宿命中，您的家庭常有贵人气氛，家人能为您提供坚实的心理避风港。但需要注意的是，由于水火相克或金木不调的潜在磁场影响，偶尔会与伴侣因琐事产生沟通隔阂。学会“以柔克刚”，多站在对方立场考虑，能使家族气运更加兴旺，福泽绵延至下一代。`
                  : `Your Marriage Palace resonates with the Red Star of Affinity, indicating a romantic pathway characterized by **\"Deep Devotion and Mutual Grace\"**. In relationships, you prioritize soul compatibility and shared growth. You are a deeply loyal, caring, and protective partner.
                  
                  **Family Dynamic**: Your home environment acts as a vital spiritual sanctuary. However, subtle elemental friction can occasionally spark minor communications gaps. Practicing active listening and emotional soft-landing will keep your family sanctuary filled with high-frequency peace.`
            },
            {
                id: 'social',
                title: isZH ? "🤝 社交人脉与贵人星宿" : "🤝 Social Resonance & Allies",
                illustrationType: 'social' as const,
                content: isZH
                  ? `在社交关系中，您拥有独特的**“磁石效应”**。虽然您不喜谄媚，但您的真诚、靠谱和专业素养，会自然而然地吸引志同道合、高层次的朋友凝聚在您身边。
                  
                  **贵人测算结果**：在您的天命星盘中，“天乙贵人”与“国印贵人”双星守护。这意味着您在面临人生重大抉择或陷入困境时，总会有年长、有社会地位的贵人出现，为您指点迷津或提供资源。您一生的贵人多属相为**鼠、龙、蛇**，在与这些属相的人合作时，您的事业运势将得到最大幅度的加持。`
                  : `In social circles, you possess an innate **\"Magnetic Resonance\"**. While you disfavor superficial charm, your integrity and natural competence attract high-quality, visionary allies into your orbit.
                  
                  **Noble Benefactor Mapping**: Your natal map is guarded by Celestial Helpers. This guarantees that during difficult transits or forks in the road, prominent mentors will appear to guide you. Allies born under the signs of the **Rat, Dragon, or Snake** will harmonize best with your energy.`
            },
            {
                id: 'health',
                title: isZH ? "🩺 脏腑元气与健康命理" : "🩺 Health & Vitality Meridian Map",
                illustrationType: 'health' as const,
                content: isZH
                  ? `中医五行理论中，五脏对应五行：肝属木、心属火、脾属土、肺属金、肾属水。
                  
                  **健康过程与结果分析**：您的最弱五行元素为「${t[`element${missingElement}`] || missingElement}」，根据全息对应，这暗示您的生命系统中对应的**脏腑（如 ${
                    missingElement === 'Metal' ? '肺部、大肠及呼吸系统' :
                    missingElement === 'Wood' ? '肝脏、胆囊及眼部经络' :
                    missingElement === 'Water' ? '肾脏、膀胱及泌尿系统' :
                    missingElement === 'Fire' ? '心脏、小肠及心血管循环' :
                    '脾脏、胃部及消化系统'
                  }）**元气容易匮乏或受郁。在季节交替或工作高压时期，这些部位最易出现亚健康信号（如疲惫、气血滞留等）。必须注重作息调理，通过补充特定的天然食材与适当的水分，强化身体的防御机能。`
                  : `In holistic medicine, your bodily organs correspond directly to the Five Elements: Liver-Wood, Heart-Fire, Spleen-Earth, Lungs-Metal, and Kidneys-Water.
                  
                  **Vitality & Meridian Analysis**: Since your weakest element is 「${t[`element${missingElement}`] || missingElement}」, your biological system is more vulnerable in the corresponding **meridians (${
                    missingElement === 'Metal' ? 'Lungs, Large Intestine, and Respiratory tract' :
                    missingElement === 'Wood' ? 'Liver, Gallbladder, and Optical paths' :
                    missingElement === 'Water' ? 'Kidneys, Bladder, and Endocrine flow' :
                    missingElement === 'Fire' ? 'Heart, Small Intestine, and Cardiovascular cycle' :
                    'Spleen, Stomach, and Digestive system'
                  })**. During high-stress transits or seasonal shifts, these areas are prone to fatigue. Prioritize balanced sleep, specific whole foods, and organic hydration to shield your vital field.`
            },
            {
                id: 'fengshui',
                title: isZH ? "🧭 奇门风水与玄妙寓言" : "🧭 Geomantic Feng Shui & Fables",
                illustrationType: 'fengshui' as const,
                content: isZH
                  ? `风水是人与环境磁场的共振。针对您的命理格局，您的居家与办公环境风水至关重要。建议将您的常用座位、睡床朝向调整至**“${
                    missingElement === 'Metal' ? '西方（金气充盈之地）' :
                    missingElement === 'Wood' ? '东方（朝阳木气汇聚）' :
                    missingElement === 'Water' ? '北方（玄武坎水聚财）' :
                    missingElement === 'Fire' ? '南方（九紫离火旺气）' :
                    '西南/东北（中央坤土承载）'
                  }”**，这能协助您每天在无形中吸纳天地灵气，补足命理缺陷。`
                  : `Feng Shui is the cosmic science of resonance between your bio-field and your environment. To optimize your personal matrix, align your desk, bed, and common resting positions to face the **${
                    missingElement === 'Metal' ? 'West (strengthening Metal order)' :
                    missingElement === 'Wood' ? 'East (gathering rejuvenating Wood energy)' :
                    missingElement === 'Water' ? 'North (accumulating abundant Water wealth)' :
                    missingElement === 'Fire' ? 'South (igniting vibrant Fire opportunities)' :
                    'Southwest or Northeast (anchoring Earth stability)'
                  }**, allowing you to unconsciously absorb auspicious vital forces throughout your daily life.`,
                fableTitle: fables.title,
                fableText: fables.text
            },
            {
                id: 'remedy',
                title: isZH ? "📜 避灾解厄、转运与补救" : "📜 Remedial Seals & Protective Advice",
                illustrationType: 'remedy' as const,
                content: isZH
                  ? `天道虽有盈缺，但事在人为，玄学之妙在于“趋吉避凶”。以下为针对您命运低谷或潜在挑战的**独家秘传转运避灾方案**：`
                  : `While destiny contains variations, we possess the free will and metaphysical tools to neutralize negative transits. Here is your **personalized remedial program to bypass obstacles**:`,
                warningText: isZH
                  ? `【避灾警告】：注意未来六个月内，当水木气重或流月犯太岁时，切勿与人发生口舌之争，避免签订任何未经律师审核的巨额合同。出行注意防范高空坠物及关节拉伤。`
                  : `[AVOIDANCE WARNING]: Over the next 180 days, avoid entering speculative financial partnerships, signing unverified contracts, or engaging in hostile confrontations. Guard your joints and respiratory wellness.`,
                remedyText: isZH
                  ? `【解厄法门与防护】：
                  1. **辟邪膳食**：多食用${
                    missingElement === 'Metal' ? '百合、银耳、白萝卜等白色润肺食材' :
                    missingElement === 'Wood' ? '菠菜、西兰花、绿茶等青色护肝食品' :
                    missingElement === 'Water' ? '黑芝麻、黑豆、桑葚等黑色补肾食物' :
                    missingElement === 'Fire' ? '红豆、番茄、枸杞等红色养心温补食材' :
                    '南瓜、小米、山药等黄色益脾暖胃食品'
                  }。
                  2. **居家开运**：在您办公桌的${
                    missingElement === 'Metal' ? '正西方摆放一个黄铜葫芦或金属文昌塔' :
                    missingElement === 'Wood' ? '正东方摆放三株富贵竹或绿植盆栽' :
                    missingElement === 'Water' ? '正北方摆放一个黑曜石流水喷泉' :
                    missingElement === 'Fire' ? '正南方挂一盏红色中国结或暖光台灯' :
                    '中央或东北方摆放一块天然黄水晶球'
                  }。
                  3. **护身秘宝**：随身佩戴**「${t[`element${missingElement}`] || missingElement}属性的开运转运手链/吊坠」**（如${
                    missingElement === 'Metal' ? '白水晶、黄金、白银制品' :
                    missingElement === 'Wood' ? '绿幽灵、孔雀石、檀木佛珠' :
                    missingElement === 'Water' ? '黑曜石、蓝宝石、海蓝宝' :
                    missingElement === 'Fire' ? '红玛瑙、石榴石、红碧玺' :
                    '黄水晶、虎眼石、琥珀'
                  }），它们能与您的微弱脉搏产生电磁谐振，全天候保护您的能量场不受外界浊气侵扰。`
                  : `[REMEDIAL COUNTERMEASURES]:
                  1. **Alchemical Nutrition**: Actively consume ${
                    missingElement === 'Metal' ? 'pears, white fungus, lotus root, and radishes to nurture lung energy' :
                    missingElement === 'Wood' ? 'spinach, broccoli, green tea, and leafy greens to detoxify liver channels' :
                    missingElement === 'Water' ? 'black sesame seeds, black beans, and seaweed to replenish kidney reservoir' :
                    missingElement === 'Fire' ? 'tomatoes, goji berries, red beans, and warm spices to fortify heart vitality' :
                    'pumpkin, sweet potato, millet, and ginger to warm spleen and stomach channels'
                  }.
                  2. **Spatial Activators**: Position a ${
                    missingElement === 'Metal' ? 'brass gourd or metal pagoda in the West of your office' :
                    missingElement === 'Wood' ? 'lucky green bamboo plant in the East of your living room' :
                    missingElement === 'Water' ? 'obsidian tabletop water fountain in the North of your study' :
                    missingElement === 'Fire' ? 'red talisman, glowing warm light, or artwork in the South' :
                    'natural yellow citrine crystal sphere in the Center or Northeast'
                  }.
                  3. **Amulet Transmitters**: Wear **「${t[`element${missingElement}`] || missingElement} alignment crystals」** (such as ${
                    missingElement === 'Metal' ? 'clear quartz, gold, or silver artifacts' :
                    missingElement === 'Wood' ? 'green phantom quartz, malachite, or sandalwood' :
                    missingElement === 'Water' ? 'obsidian, black tourmaline, or aquamarine' :
                    missingElement === 'Fire' ? 'red agate, garnet, or pink tourmaline' :
                    'yellow citrine, tiger\'s eye, or amber'
                  }) to stabilize your bio-electric field and buffer against negative environmental static.`
            }
        ];
        return list;
    }, [language, elementScores, missingElement, zodiacName, starSignName, t]);

    // Handle PDF Generation using jsPDF
    const generatePDF = async () => {
        if (pdfDownloading) return;
        setPdfDownloading(true);
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - 2 * margin;

            // Page 1: Title & Cover
            doc.setFillColor(11, 21, 36); // Dark Blue Celestial Background
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            
            // Draw golden border
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(1.5);
            doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
            doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

            // Cover graphics - simple mystical circles
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.5);
            doc.circle(pageWidth / 2, 80, 45, 'S');
            doc.circle(pageWidth / 2, 80, 43, 'S');
            doc.circle(pageWidth / 2, 80, 20, 'S');
            
            // Draw central cross lines
            doc.line(pageWidth / 2 - 45, 80, pageWidth / 2 + 45, 80);
            doc.line(pageWidth / 2, 80 - 45, pageWidth / 2, 80 + 45);

            // Title Texts
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.text("CELESTIAL DESTINY MAP", pageWidth / 2, 145, { align: 'center' });
            
            doc.setTextColor(212, 175, 55); // Gold
            doc.setFontSize(14);
            doc.text("QUANTUM BIOMETRIC DESTINY REPORT", pageWidth / 2, 155, { align: 'center' });

            // Subject Details Card Box
            doc.setFillColor(23, 38, 54);
            doc.roundedRect(20, 175, pageWidth - 40, 75, 4, 4, 'F');
            doc.setDrawColor(102, 192, 244);
            doc.setLineWidth(0.5);
            doc.roundedRect(20, 175, pageWidth - 40, 75, 4, 4, 'S');

            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text("SUBJECT PROFILE DETAILS", pageWidth / 2, 190, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(200, 200, 200);
            doc.text(`Biometric Scan Method: ${readingType === 'face' ? 'Physiognomy (Face)' : 'Chiromancy (Palm)'}`, 30, 205);
            doc.text(`Subject Birth Date: ${birthDate || "N/A"}`, 30, 213);
            doc.text(`Computed Age: ${age} years`, 30, 221);
            doc.text(`Gender Identity: ${gender === 'male' ? 'Male' : 'Female'}`, 30, 229);
            doc.text(`Zodiac Sign: ${zodiacName} (${starSignName})`, 30, 237);

            // Footer of cover
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(8);
            doc.text("Generated by Celestial Biometrics - AI Astrologer Engine", pageWidth / 2, 280, { align: 'center' });

            // Helper to wrap & draw text over multiple pages safely
            const drawWrappedText = (text: string, x: number, startY: number, maxW: number, lineH: number) => {
                const lines = doc.splitTextToSize(text, maxW);
                let currentY = startY;
                for (let i = 0; i < lines.length; i++) {
                    if (currentY > pageHeight - 20) {
                        doc.addPage();
                        // Draw header and line
                        doc.setDrawColor(212, 175, 55);
                        doc.setLineWidth(0.5);
                        doc.line(margin, 12, pageWidth - margin, 12);
                        doc.setTextColor(150, 150, 150);
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(8);
                        doc.text("CELESTIAL DESTINY MAP - INDIVIDUAL ARCHIVE", margin, 10);
                        
                        currentY = 20;
                    }
                    doc.setTextColor(60, 60, 60);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10.5);
                    doc.text(lines[i], x, currentY);
                    currentY += lineH;
                }
                return currentY;
            };

            // Loop and add subsequent reports on clean pages
            reportData.forEach((section) => {
                doc.addPage();
                
                // Draw Golden Page Header Border
                doc.setDrawColor(212, 175, 55);
                doc.setLineWidth(0.5);
                doc.line(margin, 15, pageWidth - margin, 15);
                
                doc.setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(`SECTION: ${section.title}`, margin, 12);

                // Section Title Block
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(15);
                doc.setTextColor(11, 21, 36);
                doc.text(section.title, margin, 28);
                
                // Content text drawing
                let cursorY = drawWrappedText(section.content, margin, 38, contentWidth, 6);

                // Render specific section highlights / diagrams in PDF
                if (section.id === 'elements') {
                    cursorY += 10;
                    doc.setFillColor(240, 245, 250);
                    doc.roundedRect(margin, cursorY, contentWidth, 35, 3, 3, 'F');
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(11);
                    doc.setTextColor(212, 175, 55);
                    doc.text("CELESTIAL ELEMENTS BREAKDOWN", margin + 10, cursorY + 10);

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(50, 50, 50);
                    doc.text(`Metal: ${calculatedElements.Metal}%`, margin + 15, cursorY + 18);
                    doc.text(`Wood: ${calculatedElements.Wood}%`, margin + 65, cursorY + 18);
                    doc.text(`Water: ${calculatedElements.Water}%`, margin + 115, cursorY + 18);
                    doc.text(`Fire: ${calculatedElements.Fire}%`, margin + 15, cursorY + 26);
                    doc.text(`Earth: ${calculatedElements.Earth}%`, margin + 65, cursorY + 26);
                    doc.text(`Weakest Element: ${missingElement}`, margin + 115, cursorY + 26);
                }

                if (section.fableTitle && section.fableText) {
                    cursorY += 10;
                    doc.setFillColor(254, 250, 240); // Antique parchment style
                    doc.roundedRect(margin, cursorY, contentWidth, 55, 4, 4, 'F');
                    doc.setDrawColor(212, 175, 55);
                    doc.setLineWidth(0.5);
                    doc.roundedRect(margin, cursorY, contentWidth, 55, 4, 4, 'S');

                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(11);
                    doc.setTextColor(212, 175, 55);
                    doc.text(`Ancient Fable: ${section.fableTitle}`, margin + 10, cursorY + 10);
                    
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(9.5);
                    doc.setTextColor(80, 80, 80);
                    drawWrappedText(section.fableText, margin + 10, cursorY + 17, contentWidth - 20, 5);
                }

                if (section.id === 'remedy') {
                    if (section.warningText) {
                        cursorY += 8;
                        doc.setFillColor(255, 235, 235); // Alert warning style
                        doc.roundedRect(margin, cursorY, contentWidth, 22, 3, 3, 'F');
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(10);
                        doc.setTextColor(180, 40, 40);
                        doc.text("DESTINY WARNING INDEX", margin + 10, cursorY + 7);
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(9);
                        doc.setTextColor(80, 80, 80);
                        drawWrappedText(section.warningText, margin + 10, cursorY + 13, contentWidth - 20, 5);
                        cursorY += 24;
                    }

                    if (section.remedyText) {
                        cursorY += 4;
                        doc.setFillColor(235, 248, 240); // Safe alignment green style
                        doc.roundedRect(margin, cursorY, contentWidth, 55, 4, 4, 'F');
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(11);
                        doc.setTextColor(30, 130, 70);
                        doc.text("SUGGESTED DEFENSE & PROTECTIVE ACTIONS", margin + 10, cursorY + 8);
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(9.5);
                        doc.setTextColor(50, 50, 50);
                        drawWrappedText(section.remedyText, margin + 10, cursorY + 15, contentWidth - 20, 5);
                    }
                }

                // Page numbering footer
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text("Celestial Biometrics Destiny Archive | Page " + doc.getNumberOfPages(), pageWidth / 2, pageHeight - 8, { align: 'center' });
            });

            // Save the document
            doc.save(`Celestial_Destiny_Report_${birthDate || 'Subject'}.pdf`);
        } catch (err) {
            console.error("PDF Export Failure:", err);
            alert("PDF Generation error: " + err);
        } finally {
            setPdfDownloading(false);
        }
    };

    // Rendering Active Illustration for each section - compact and space-efficient
    const renderActiveIllustration = (type: string) => {
        switch (type) {
            case 'aura':
                return (
                    <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '12px', border: '1px solid rgba(102, 192, 244, 0.4)', background: '#090d16', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                        {image ? (
                            <img src={image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Subject Biometrics" />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#555' }}>
                                <i className={`fas ${readingType === 'face' ? 'fa-user-circle' : 'fa-hand-paper'}`} style={{ fontSize: '2.5rem', color: 'rgba(102,192,244,0.15)', marginBottom: '4px' }} />
                                <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: '"Space Grotesk", sans-serif' }}>Biometric Frame Active</div>
                            </div>
                        )}
                        
                        {/* Scanning beam animation */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #47BFFF, transparent)',
                            boxShadow: '0 0 10px #47BFFF',
                            animation: 'scanLine 3s linear infinite'
                        }} />

                        {/* Interactive overlay dots for Face Palace Annotation */}
                        {readingType === 'face' ? (
                            <>
                                <button id="dot-tianting" style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#ffdd57', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #ffdd57', outline: 'none' }} onClick={() => setSelectedNode('tianting')} />
                                <button id="dot-caibo" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #2ecc71', outline: 'none' }} onClick={() => setSelectedNode('caibo')} />
                                <button id="dot-spouse-l" style={{ position: 'absolute', top: '40%', left: '35%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#e74c3c', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #e74c3c', outline: 'none' }} onClick={() => setSelectedNode('spouse')} />
                                <button id="dot-spouse-r" style={{ position: 'absolute', top: '40%', left: '65%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#e74c3c', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #e74c3c', outline: 'none' }} onClick={() => setSelectedNode('spouse')} />
                                <button id="dot-dige" style={{ position: 'absolute', top: '80%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#3498db', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #3498db', outline: 'none' }} onClick={() => setSelectedNode('dige')} />
                            </>
                        ) : (
                            /* Palm Line Annotations */
                            <>
                                <button id="dot-life" style={{ position: 'absolute', top: '70%', left: '42%', width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #2ecc71' }} onClick={() => setSelectedNode('life')} />
                                <button id="dot-head" style={{ position: 'absolute', top: '52%', left: '52%', width: '10px', height: '10px', borderRadius: '50%', background: '#ffdd57', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #ffdd57' }} onClick={() => setSelectedNode('head')} />
                                <button id="dot-heart" style={{ position: 'absolute', top: '35%', left: '65%', width: '10px', height: '10px', borderRadius: '50%', background: '#e74c3c', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #e74c3c' }} onClick={() => setSelectedNode('heart')} />
                                <button id="dot-fate" style={{ position: 'absolute', top: '58%', left: '32%', width: '10px', height: '10px', borderRadius: '50%', background: '#3498db', border: '1.5px solid #fff', cursor: 'pointer', boxShadow: '0 0 6px #3498db' }} onClick={() => setSelectedNode('fate')} />
                            </>
                        )}

                        {/* Interactive popup display */}
                        {selectedNode && (
                            <div style={{ position: 'absolute', bottom: '5px', left: '5px', right: '5px', background: 'rgba(5, 12, 22, 0.98)', border: '1px solid #47BFFF', borderRadius: '6px', padding: '6px 10px', zIndex: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', alignItems: 'center' }}>
                                    <span style={{ color: theme.gold, fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        {selectedNode === 'tianting' && (language.startsWith('zh') ? "额头 (Tianting)" : "Forehead (Tianting)")}
                                        {selectedNode === 'caibo' && (language.startsWith('zh') ? "鼻梁 (Caibo)" : "Nose (Caibo)")}
                                        {selectedNode === 'spouse' && (language.startsWith('zh') ? "眼角 (Spouse)" : "Eyes (Spouse)")}
                                        {selectedNode === 'dige' && (language.startsWith('zh') ? "地阁 (Dige)" : "Chin (Dige)")}
                                        {selectedNode === 'life' && (language.startsWith('zh') ? "生命线" : "Life Line")}
                                        {selectedNode === 'head' && (language.startsWith('zh') ? "智慧线" : "Wisdom Line")}
                                        {selectedNode === 'heart' && (language.startsWith('zh') ? "感情线" : "Heart Line")}
                                        {selectedNode === 'fate' && (language.startsWith('zh') ? "事业线" : "Career Line")}
                                    </span>
                                    <button style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', padding: 0 }} onClick={() => setSelectedNode(null)}>×</button>
                                </div>
                                <p style={{ fontSize: '0.7rem', color: '#eee', margin: 0, lineHeight: '1.3' }}>
                                    {selectedNode === 'tianting' && (language.startsWith('zh') ? "额头高耸莹润，代表早年有长辈关照，学术悟性极高，易得神明保佑，适宜考学及官禄升迁。" : "High forehead indicates strong early guidance, academic intuition, and high career advancement potential.")}
                                    {selectedNode === 'caibo' && (language.startsWith('zh') ? "鼻头圆润丰隆，主中晚年财运极其旺盛。地支中土气稳固，能锁存金钱资产。" : "Fleshy nose bridges secure solid financial growth and abundance in your mid-to-late life stages.")}
                                    {selectedNode === 'spouse' && (language.startsWith('zh') ? "夫妻宫平满无纹侵，表明配偶温和贤惠，两人灵魂频率相近，能和睦相处。" : "Smooth corners indicate harmonious spousal contracts, warm family values, and high soul affinity.")}
                                    {selectedNode === 'dige' && (language.startsWith('zh') ? "地阁丰厚，晚年运势安稳。家宅田产广阔，根基扎实，寿命绵长，一生平安。" : "Strong chin structures point to deep assets, absolute personal stability, and serene later years.")}
                                    {selectedNode === 'life' && (language.startsWith('zh') ? "掌心生命线弧度开阔，不中断，象征生物元气极其旺盛，能逢凶化吉。" : "Wide, continuous life line represents robust physical energy, high vitality, and recovery power.")}
                                    {selectedNode === 'head' && (language.startsWith('zh') ? "智慧线深长且向下倾斜，提示您极具哲学深度，决策理智客观。" : "Deep, slanted head line represents exceptional analytical capability and calm, objective decision-making.")}
                                    {selectedNode === 'heart' && (language.startsWith('zh') ? "感情线直达食指下方，说明重情重义，感情纯粹，与爱人灵魂深深契合。" : "Clear heart line indicates pure-hearted devotion, emotional intelligence, and excellent empathy.")}
                                    {selectedNode === 'fate' && (language.startsWith('zh') ? "事业线由掌底延伸向上，说明凭借自身才智 and 贵人引路实现人生腾飞。" : "Strong fate line shows career self-reliance, with major breakthroughs at ages 35 and 48.")}
                                </p>
                            </div>
                        )}
                        <div style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '3px', fontSize: '0.65rem', color: '#aaa' }}>
                            {language.startsWith('zh') ? "点击高亮节点" : "Click dots"}
                        </div>
                    </div>
                );
            case 'wuxing':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(5, 12, 22, 0.4)', borderRadius: '12px', padding: '8px 12px', border: '1px solid rgba(102, 192, 244, 0.15)', width: '100%' }}>
                        <div style={{ transform: 'scale(0.75)', margin: '-28px 0' }}>
                            <FiveElementsChart elements={calculatedElements} t={t} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px', width: '100%' }}>
                            <svg viewBox="0 0 240 40" width="100%" height="30" style={{ maxWidth: '220px' }}>
                                <g stroke="rgba(102,192,244,0.3)" strokeWidth="0.5">
                                    <circle cx="20" cy="20" r="10" fill="rgba(241,196,15,0.1)" stroke="#F1C40F" strokeWidth="1" />
                                    <circle cx="65" cy="20" r="10" fill="rgba(46,204,113,0.1)" stroke="#2ECC71" strokeWidth="1" />
                                    <circle cx="110" cy="20" r="10" fill="rgba(52,152,219,0.1)" stroke="#3498DB" strokeWidth="1" />
                                    <circle cx="155" cy="20" r="10" fill="rgba(231,76,60,0.1)" stroke="#E74C3C" strokeWidth="1" />
                                    <circle cx="200" cy="20" r="10" fill="rgba(211,84,0,0.1)" stroke="#D35400" strokeWidth="1" />
                                </g>
                                <text x="20" y="23" fill="#F1C40F" fontSize="8" fontWeight="bold" textAnchor="middle">{t.elementMetal}</text>
                                <text x="65" y="23" fill="#2ECC71" fontSize="8" fontWeight="bold" textAnchor="middle">{t.elementWood}</text>
                                <text x="110" y="23" fill="#3498DB" fontSize="8" fontWeight="bold" textAnchor="middle">{t.elementWater}</text>
                                <text x="155" y="23" fill="#E74C3C" fontSize="8" fontWeight="bold" textAnchor="middle">{t.elementFire}</text>
                                <text x="200" y="23" fill="#D35400" fontSize="8" fontWeight="bold" textAnchor="middle">{t.elementEarth}</text>
                            </svg>
                        </div>
                    </div>
                );
            case 'zodiac':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '4px', flexWrap: 'wrap' }}>
                        {zodiacImg && (
                            <div style={{ textAlign: 'center', background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '6px 10px', minWidth: '80px' }}>
                                <img src={zodiacImg} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #d4af37', boxShadow: '0 0 10px rgba(212,175,55,0.3)', margin: '0 auto' }} alt="Zodiac Sign" referrerPolicy="no-referrer" onError={(e) => handleImageError(e, zodiacName || 'zodiac')} />
                                <div style={{ color: theme.gold, fontWeight: 'bold', marginTop: '4px', fontSize: '0.75rem' }}>{zodiacName}</div>
                                <div style={{ fontSize: '0.65rem', color: '#bbb' }}>{t.chineseZodiac}</div>
                            </div>
                        )}
                        {starSignImg && (
                            <div style={{ textAlign: 'center', background: 'rgba(102,192,244,0.03)', border: '1px solid rgba(102,192,244,0.2)', borderRadius: '8px', padding: '6px 10px', minWidth: '80px' }}>
                                <img src={starSignImg} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #66c0f4', boxShadow: '0 0 10px rgba(102,192,244,0.3)', margin: '0 auto' }} alt="Star Sign" referrerPolicy="no-referrer" onError={(e) => handleImageError(e, starSignName || 'constellation')} />
                                <div style={{ color: '#66c0f4', fontWeight: 'bold', marginTop: '4px', fontSize: '0.75rem' }}>{starSignName}</div>
                                <div style={{ fontSize: '0.65rem', color: '#bbb' }}>{t.westernZodiac}</div>
                            </div>
                        )}
                    </div>
                );
            case 'personality':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90px', width: '100%', background: 'radial-gradient(circle, rgba(102,192,244,0.1) 0%, transparent 70%)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1.5px dashed #66c0f4', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 12s linear infinite' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(102,192,244,0.2)', border: '1px solid #66c0f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-brain" style={{ fontSize: '1.2rem', color: '#fff', textShadow: '0 0 8px #66c0f4' }} />
                            </div>
                        </div>
                    </div>
                );
            case 'wealth':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(5, 12, 22, 0.3)', borderRadius: '8px', padding: '10px 15px', border: '1px solid rgba(102, 192, 244, 0.12)', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-coins" style={{ fontSize: '1.8rem', color: '#d4af37', textShadow: '0 0 8px #d4af37' }} />
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#ccc', fontStyle: 'italic' }}>{language.startsWith('zh') ? "财运高峰年龄" : "Wealth Peaks"}</div>
                                <div style={{ color: theme.gold, fontWeight: 'bold', fontSize: '0.95rem' }}>28, 35, 42, 51 {language.startsWith('zh') ? "岁" : "Years"}</div>
                            </div>
                        </div>
                    </div>
                );
            case 'marriage':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', height: '80px', width: '100%' }}>
                        <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(231,76,60,0.12)', border: '1px solid #e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-venus" style={{ fontSize: '1rem', color: '#e74c3c' }} />
                        </div>
                        <div style={{ width: '40px', height: '1.5px', background: 'linear-gradient(90deg, #e74c3c, #9b59b6, #e74c3c)', animation: 'pulse 2s infinite' }} />
                        <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(155,89,182,0.12)', border: '1px solid #9b59b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-mars" style={{ fontSize: '1rem', color: '#9b59b6' }} />
                        </div>
                    </div>
                );
            case 'social':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px', width: '100%' }}>
                        <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>{language.startsWith('zh') ? "相合贵人属相" : "Harmonic Guardian Zodiacs"}</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['Rat', 'Dragon', 'Snake'].map((z, idx) => (
                                <div key={idx} style={{ background: 'rgba(102, 192, 244, 0.08)', border: '1px solid rgba(102,192,244,0.2)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', color: '#66c0f4', fontWeight: 'bold' }}>
                                    {t[`zodiac${z}`] || z}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'health':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: 'rgba(5, 12, 22, 0.3)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(102, 192, 244, 0.12)', width: '100%' }}>
                        <i className="fas fa-heartbeat" style={{ fontSize: '1.8rem', color: '#e74c3c', animation: 'heartbeat 1.5s infinite' }} />
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#888' }}>{language.startsWith('zh') ? "元气薄弱系统" : "Vulnerable System"}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.gold }}>
                                {missingElement === 'Metal' ? (language.startsWith('zh') ? '呼吸系统及大肠经' : 'Respiratory & Lung') :
                                 missingElement === 'Wood' ? (language.startsWith('zh') ? '眼部经络及肝脏' : 'Ocular & Liver') :
                                 missingElement === 'Water' ? (language.startsWith('zh') ? '肾脏及内分泌循环' : 'Kidneys & Endocrine') :
                                 missingElement === 'Fire' ? (language.startsWith('zh') ? '心血管及小肠经络' : 'Cardiovascular & Heart') :
                                 (language.startsWith('zh') ? '消化系统及脾胃功能' : 'Spleen & Stomach')}
                            </div>
                        </div>
                    </div>
                );
            case 'fengshui':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(5,12,22,0.3)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', padding: '10px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <i className="fas fa-compass" style={{ fontSize: '1.2rem', color: '#d4af37', animation: 'spin 15s linear infinite' }} />
                            <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 'bold' }}>{language.startsWith('zh') ? "命理大吉方位" : "Auspicious Direction"}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem', color: theme.gold, fontWeight: 'bold' }}>
                            {missingElement === 'Metal' ? (language.startsWith('zh') ? '正西方 (庚辛金)' : 'West (Metal Anchor)') :
                             missingElement === 'Wood' ? (language.startsWith('zh') ? '正东方 (甲乙木)' : 'East (Wood Anchor)') :
                             missingElement === 'Water' ? (language.startsWith('zh') ? '正北方 (壬癸水)' : 'North (Water Anchor)') :
                             missingElement === 'Fire' ? (language.startsWith('zh') ? '正南方 (丙丁火)' : 'South (Fire Anchor)') :
                             (language.startsWith('zh') ? '中央、东北、西南' : 'Center, NE, SW')}
                        </div>
                    </div>
                );
            case 'remedy':
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', width: '100%' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1.5px solid #d4af37', background: 'rgba(212,175,55,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 18s linear infinite', boxShadow: '0 0 10px rgba(212,175,55,0.15)' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-yin-yang" style={{ fontSize: '1.2rem', color: '#d4af37' }} />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const formatMarkdown = (text: string) => {
        if (!text) return "";
        return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #66c0f4; text-shadow: 0 0 8px rgba(102, 192, 244, 0.4); font-weight: bold;">$1</strong>')
                   .replace(/## (.*)/g, '<h3 style="color:#66c0f4;border-bottom:1.5px solid rgba(102, 192, 244, 0.3);padding-bottom:6px;margin-top:28px;font-family:\\"Space Grotesk\\", sans-serif;text-shadow: 0 0 10px rgba(102, 192, 244, 0.4);letter-spacing: 1px;">$1</h3>')
                   .replace(/\n/g, '<br/>');
    };

    const activeSlide = reportData[sliderIndex];

    return (
        <div style={{ width: '95%', maxWidth: '820px', margin: '0 auto', paddingBottom: '3rem', position: 'relative' }}>
            
            {/* Subject info box */}
            <div style={{ background: 'linear-gradient(135deg, rgba(23, 38, 54, 0.9) 0%, rgba(17, 26, 38, 0.95) 100%)', padding: '15px 20px', borderRadius: '12px', border: `2px solid rgba(102, 192, 244, 0.3)`, marginBottom: '25px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)', position: 'relative' }}>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ color: '#999', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif' }}>{t.ageLabel}</div>
                    <div style={{ fontSize: '1.3rem', color: theme.accent, fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif' }}>{age}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(102, 192, 244, 0.2)', height: '30px', alignSelf: 'center' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ color: '#999', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif' }}>{t.genderLabel}</div>
                    <div style={{ fontSize: '1.3rem', color: theme.accent, fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif' }}>{gender === 'male' ? t.genderMale : t.genderFemale}</div>
                </div>
                {birthDate && (
                    <>
                        <div style={{ width: '1px', background: 'rgba(102, 192, 244, 0.2)', height: '30px', alignSelf: 'center' }} />
                        <div style={{ textAlign: 'center', minWidth: '150px' }}>
                            <div style={{ color: '#999', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Space Grotesk", sans-serif' }}>{t.dobLabel}</div>
                            <div style={{ fontSize: '1.2rem', color: theme.accent, fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif' }}>{birthDate}</div>
                        </div>
                    </>
                )}
            </div>

            {/* Mode Selector & Print Actions toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(23, 38, 54, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(102,192,244,0.3)' }}>
                    <button onClick={() => setViewMode('slider')} style={{ background: viewMode === 'slider' ? 'rgba(102, 192, 244, 0.2)' : 'transparent', color: viewMode === 'slider' ? theme.accent : '#aaa', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>
                        🎚️ {language.startsWith('zh') ? "滑动窗口" : "Slide Deck"}
                    </button>
                    <button onClick={() => setViewMode('full')} style={{ background: viewMode === 'full' ? 'rgba(102, 192, 244, 0.2)' : 'transparent', color: viewMode === 'full' ? theme.accent : '#aaa', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>
                        📄 {language.startsWith('zh') ? "完整报告" : "Full Report"}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select style={{ background: 'rgba(0,0,0,0.5)', color: theme.accent, border: `1px solid rgba(102,192,244,0.3)`, borderRadius: '4px', padding: '6px 10px', fontSize: '0.8rem', fontFamily: '"Space Grotesk", sans-serif', cursor: 'pointer' }} value={language} onChange={onLanguageChange}>
                        {LANGUAGES.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                    
                    <button onClick={onToggleSpeech} style={{ background: 'rgba(102, 192, 244, 0.1)', border: `1px solid ${theme.accent}`, borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.accent, cursor: 'pointer', transition: 'all 0.2s' }}>
                        {isSpeaking ? <i className="fas fa-stop-circle"></i> : <i className="fas fa-volume-up"></i>}
                    </button>

                    <button onClick={generatePDF} disabled={pdfDownloading} style={{ background: 'linear-gradient(135deg, #FFB300 0%, #D4AF37 100%)', color: '#111', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: pdfDownloading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }} className="hover:scale-105 active:scale-95 transition-transform">
                        {pdfDownloading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-file-pdf" />}
                        {pdfDownloading ? (language.startsWith('zh') ? '导出中...' : 'Exporting...') : (language.startsWith('zh') ? '下载PDF' : 'Download PDF')}
                    </button>
                </div>
            </div>

            {/* RESULTS VIEWPORT CONTAINER */}
            <div style={{ ...styles.resultContainer, border: `2px solid rgba(102, 192, 244, 0.3)`, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(23, 38, 54, 0.95) 0%, rgba(17, 26, 38, 0.98) 100%)', boxShadow: '0 15px 50px rgba(0, 0, 0, 0.9)', padding: '25px', position: 'relative', overflow: 'hidden' }}>
                
                {isTranslating ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: theme.accent }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
                        <div style={{ marginTop: '10px', fontFamily: '"Space Grotesk", sans-serif' }}>{t.translating}</div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'slider' ? (
                            /* SLIDING CAROUSEL DECK */
                            <div>
                                {/* Stepper Progress Indicators */}
                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '15px', borderBottom: '1px solid rgba(102,192,244,0.15)' }} className="hide-scrollbar">
                                    {reportData.map((sec, idx) => (
                                        <button key={sec.id} onClick={() => setSliderIndex(idx)} style={{ background: sliderIndex === idx ? 'rgba(102, 192, 244, 0.25)' : 'rgba(0,0,0,0.3)', border: sliderIndex === idx ? `1px solid ${theme.accent}` : '1px solid rgba(102,192,244,0.1)', color: sliderIndex === idx ? theme.accent : '#aaa', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>
                                            {sec.title.split(' ')[0]} {sec.title.split(' ').slice(1).join(' ').substring(0, 4)}...
                                        </button>
                                    ))}
                                </div>

                                {/* Active Slide Content Box */}
                                <div style={{ minHeight: '340px' }} className="fade-in">
                                    <h3 style={{ color: theme.accent, borderBottom: '1px solid rgba(102,192,244,0.25)', paddingBottom: '8px', marginBottom: '15px', fontFamily: '"Space Grotesk", sans-serif', textShadow: '0 0 8px rgba(102,192,244,0.4)' }}>
                                        {activeSlide.title}
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1.2fr 1fr', gap: '20px', alignItems: 'start' }} className="grid md:grid-cols-2">
                                        {/* Left Side: Graphic / Illustration */}
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                            {renderActiveIllustration(activeSlide.illustrationType)}
                                        </div>

                                        {/* Right Side: Analytical Texts */}
                                        <div>
                                            <p style={{ fontSize: '0.95rem', color: '#F4EAD4', lineHeight: '1.6', margin: '0 0 15px 0' }} dangerouslySetInnerHTML={{ __html: formatMarkdown(activeSlide.content) }} />

                                            {/* Dynamic Sub-boxes inside carousel card */}
                                            {activeSlide.fableTitle && activeSlide.fableText && (
                                                <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '12px', marginTop: '12px' }}>
                                                    <div style={{ color: theme.gold, fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>📜 {activeSlide.fableTitle}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#ddd', fontStyle: 'italic', lineHeight: '1.5' }}>{activeSlide.fableText}</div>
                                                </div>
                                            )}

                                            {activeSlide.warningText && (
                                                <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                                                    <i className="fas fa-exclamation-triangle" style={{ color: '#e74c3c', marginTop: '3px' }} />
                                                    <div style={{ fontSize: '0.8rem', color: '#ffb3b3', lineHeight: '1.4' }}>{activeSlide.warningText}</div>
                                                </div>
                                            )}

                                            {activeSlide.remedyText && (
                                                <div style={{ background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                                                    <i className="fas fa-shield-alt" style={{ color: '#2ecc71', marginTop: '3px' }} />
                                                    <div style={{ fontSize: '0.8rem', color: '#b3ffcc', lineHeight: '1.4' }}>{activeSlide.remedyText}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Carousel Navigation Arrows */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid rgba(102,192,244,0.15)', paddingTop: '15px' }}>
                                    <button onClick={() => setSliderIndex(prev => Math.max(0, prev - 1))} disabled={sliderIndex === 0} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(102,192,244,0.2)', color: sliderIndex === 0 ? '#555' : theme.accent, padding: '8px 16px', borderRadius: '4px', cursor: sliderIndex === 0 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s' }}>
                                        ← {language.startsWith('zh') ? "上一个" : "Previous"}
                                    </button>
                                    <span style={{ color: '#aaa', fontSize: '0.85rem', alignSelf: 'center', fontFamily: '"Space Grotesk", sans-serif' }}>
                                        {sliderIndex + 1} / {reportData.length}
                                    </span>
                                    <button onClick={() => setSliderIndex(prev => Math.min(reportData.length - 1, prev + 1))} disabled={sliderIndex === reportData.length - 1} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(102,192,244,0.2)', color: sliderIndex === reportData.length - 1 ? '#555' : theme.accent, padding: '8px 16px', borderRadius: '4px', cursor: sliderIndex === reportData.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s' }}>
                                        {language.startsWith('zh') ? "下一个" : "Next"} →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* CLASSIC FULL REPORT SCROLL VIEW */
                            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {reportData.map((sec, idx) => (
                                    <div key={sec.id} style={{ borderBottom: idx < reportData.length - 1 ? '1px solid rgba(102,192,244,0.15)' : 'none', paddingBottom: '25px' }}>
                                        <h3 style={{ color: theme.accent, borderBottom: '1px solid rgba(102,192,244,0.2)', paddingBottom: '6px', marginBottom: '15px', fontFamily: '"Space Grotesk", sans-serif' }}>
                                            {sec.title}
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1.2fr 1fr', gap: '20px', alignItems: 'center' }} className="grid md:grid-cols-2">
                                            <div>
                                                <p style={{ fontSize: '0.95rem', color: '#F4EAD4', lineHeight: '1.6', margin: 0 }} dangerouslySetInnerHTML={{ __html: formatMarkdown(sec.content) }} />
                                                
                                                {sec.fableTitle && sec.fableText && (
                                                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '12px', marginTop: '12px' }}>
                                                        <div style={{ color: theme.gold, fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>📜 {sec.fableTitle}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#ddd', fontStyle: 'italic', lineHeight: '1.5' }}>{sec.fableText}</div>
                                                    </div>
                                                )}

                                                {sec.warningText && (
                                                    <div style={{ background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', display: 'flex', gap: '10px' }}>
                                                        <i className="fas fa-exclamation-triangle" style={{ color: '#e74c3c', marginTop: '3px' }} />
                                                        <div style={{ fontSize: '0.8rem', color: '#ffb3b3' }}>{sec.warningText}</div>
                                                    </div>
                                                )}

                                                {sec.remedyText && (
                                                    <div style={{ background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.2)', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', display: 'flex', gap: '10px' }}>
                                                        <i className="fas fa-shield-alt" style={{ color: '#2ecc71', marginTop: '3px' }} />
                                                        <div style={{ fontSize: '0.8rem', color: '#b3ffcc' }}>{sec.remedyText}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                {renderActiveIllustration(sec.illustrationType)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* RECOMMENDED REMEDIAL PRODUCTS */}
            <div style={{ marginTop: '2.5rem', background: 'rgba(23, 38, 54, 0.6)', border: `1px solid rgba(102, 192, 244, 0.3)`, borderRadius: '12px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <h3 style={{ textAlign: 'center', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', margin: '0 0 5px 0', textShadow: '0 0 8px rgba(102, 192, 244, 0.4)' }}>{t.recommendedProducts}</h3>
                <p style={{ textAlign: 'center', color: '#ccc', fontStyle: 'italic', marginBottom: '20px', fontSize: '0.9rem', fontFamily: '"Space Grotesk", sans-serif' }}>
                   {t.luckyElement}: <span style={{ color: theme.accent, fontWeight: 'bold' }}>{t[`element${missingElement}`] || missingElement}</span>
                </p>
                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {recommendedProducts.map(prod => {
                        const prodName = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacName) : prod.defaultName;
                        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=200&height=200&nologo=true&seed=${prod.id}`;
                        return (
                            <div key={prod.id} style={{ minWidth: '170px', background: 'rgba(17, 26, 38, 0.8)', border: `1px solid rgba(102, 192, 244, 0.3)`, borderRadius: '8px', padding: '12px', textAlign: 'center', transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} className="hover:border-cyan-400 group">
                                <div style={{ cursor: 'pointer' }} onClick={() => onViewProduct(prod)}>
                                    <img src={imgUrl} style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(102, 192, 244, 0.15)', transition: 'transform 0.3s' }} className="group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" onError={(e) => handleImageError(e, prod.id)} />
                                    <div style={{ fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', margin: '8px 0 4px 0', height: '36px', overflow: 'hidden', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', fontFamily: '"Space Grotesk", sans-serif' }}>{prodName}</div>
                                    <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '8px', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif' }}>{prod.price}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
                                    <button style={{ ...styles.button, padding: '6px 12px', fontSize: '0.8rem', minWidth: 'auto', margin: 0, width: '100%', borderRadius: '4px' }} onClick={() => onBuyProduct(prod)}>{t.buyNow}</button>
                                    <button style={{ background: 'rgba(102, 192, 244, 0.1)', color: theme.accent, border: '1px solid rgba(102, 192, 244, 0.4)', padding: '5px 10px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', width: '100%', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold' }} onClick={() => onViewProduct(prod)} className="hover:bg-cyan-500/20">{t.viewDetails || "View Details"}</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
               <button style={styles.button} onClick={onAnalyzeAnother}>{t.analyzeAnother}</button>
            </div>
        </div>
    );
};
