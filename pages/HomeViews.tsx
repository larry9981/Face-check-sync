
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
                transition: 'width 0.2s ease-out',
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

export const RenderStartView = ({ t, freeTrials, onStart }: { t: any, freeTrials: number, onStart: (type: 'face' | 'palm') => void }) => {
    const boxSize = '200px'; 
    const imageBoxStyle = {
        width: boxSize, 
        height: boxSize, 
        border: `1px solid ${theme.gold}`,
        borderRadius: '4px',
        background: 'rgba(0,0,0,0.3)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box' as const,
        position: 'relative' as const
    };

    return (
    <div style={{...styles.glassPanel, border: `1px solid ${theme.darkGold}`, boxShadow: `0 0 20px rgba(212, 175, 55, 0.15)`}} className="glass-panel-mobile">
      <div style={{...styles.baguaContainer, margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px #d4af37)'}}>
         {BaguaSVG}
      </div>
      <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', color: theme.gold}}>{t.heroTitle}</h1>
      <p style={{color: '#ccc', marginBottom: '2rem', fontSize: '1.1rem'}}>{t.heroDesc}</p>
      
      <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px'}}>
          
          {/* FACE READING CARD */}
          <div style={{
              flex: '1 1 280px', 
              maxWidth: '320px',
              background: 'rgba(5, 5, 20, 0.6)', 
              border: `1px solid ${theme.darkGold}`, 
              borderRadius: '8px', 
              padding: '30px', 
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
          }} 
          onClick={() => onStart('face')}
          onMouseOver={(e) => {
              e.currentTarget.style.borderColor = theme.gold;
              e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseOut={(e) => {
              e.currentTarget.style.borderColor = theme.darkGold;
              e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
              <div style={imageBoxStyle}>
                  <FaceMapSVG t={t} />
              </div>
              <h3 style={{color: theme.gold, fontSize: '1.4rem', margin: '0 0 15px 0'}}>{t.startBtn}</h3>
              <button style={{...styles.button, width: '100%', marginTop: 'auto'}}>{t.scanBtn}</button>
          </div>

          {/* PALM READING CARD */}
          <div style={{
              flex: '1 1 280px', 
              maxWidth: '320px',
              background: 'rgba(5, 5, 20, 0.6)', 
              border: `1px solid ${theme.darkGold}`, 
              borderRadius: '8px', 
              padding: '30px', 
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
          }}
          onClick={() => onStart('palm')}
          onMouseOver={(e) => {
              e.currentTarget.style.borderColor = theme.gold;
              e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseOut={(e) => {
              e.currentTarget.style.borderColor = theme.darkGold;
              e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
              <div style={imageBoxStyle}>
                  <i className="fas fa-hand-sparkles" style={{fontSize: '6rem', color: theme.gold, textShadow: '0 0 10px rgba(212,175,55,0.5)', zIndex: 2}}></i>
                  {/* Mystical Pulse Animation */}
                  <div style={{position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width: '120px', height:'120px', borderRadius:'50%', border:`2px solid ${theme.gold}`, animation: 'mysticalPulse 3s infinite', opacity: 0.5}}></div>
              </div>
              <h3 style={{color: theme.gold, fontSize: '1.4rem', margin: '0 0 15px 0'}}>{t.palmBtn}</h3>
              <button style={{...styles.button, width: '100%', marginTop: 'auto'}}>{t.scanPalmBtn}</button>
          </div>

      </div>

      <div style={{marginTop: '25px', fontSize: '0.8rem', color: '#888'}}>
          {t.freeTrialsHint.replace('{count}', freeTrials.toString())}
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

export const RenderHistoryView = ({ t, history, onViewResult }: { t: any, history: HistoryRecord[], onViewResult: (r: HistoryRecord) => void }) => {
    return (
        <div style={{...styles.glassPanel, maxWidth: '800px', width: '95%'}}>
            <h2 style={{color: theme.gold, textAlign: 'center', fontFamily: 'Cinzel, serif', marginBottom: '2rem'}}>{t.historyTitle}</h2>
            
            {history.length === 0 ? (
                <div style={{textAlign: 'center', color: '#aaa', padding: '2rem'}}>{t.noHistory}</div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {history.map((record) => (
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
                                <div style={{fontSize: '0.8rem', color: '#aaa'}}>
                                   {t.elementMetal}: {record.elements?.scores?.Metal ?? '?'}% | {t.elementWood}: {record.elements?.scores?.Wood ?? '?'}%
                                </div>
                            </div>
                            <button 
                                onClick={() => onViewResult(record)} 
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
               <video ref={videoRef} autoPlay playsInline muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)'}}></video>
               <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
               
               {/* Traditional Mystical Overlay */}
               <div className="mystical-scan-frame" style={{width: isPalm ? '280px' : '240px', height: isPalm ? '380px' : '320px'}}></div>

               {/* Countdown Overlay */}
               {countdown > 0 && (
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
                   </div>
               )}
           </div>
           
           <div style={{
               padding: '15px 20px', 
               background: '#050511', 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               borderTop: `1px solid ${accentColor}`,
               flexShrink: 0
           }}>
               <button style={{...styles.secondaryButton, marginTop: 0, padding: '10px 30px', fontSize: '0.9rem', borderColor: accentColor, color: accentColor}} onClick={onStopCamera}>{t.cancelBtn}</button>
           </div>
        </div>
    );
};

export const RenderResultView = ({ t, readingType, birthDate, gender, calculatedElements, resultText, language, isSpeaking, isTranslating, LANGUAGES, onLanguageChange, onToggleSpeech, onAnalyzeAnother, onBuyProduct, onOpenBalance }: any) => {
    const age = calculateAge(birthDate);
    const zodiac = getChineseZodiac(birthDate);
    const starSign = getWesternZodiac(birthDate);
    const zodiacName = zodiac ? (t[`zodiac${zodiac}`] || zodiac) : "";
    const starSignName = starSign ? (t[`star${starSign}`] || starSign) : "";
    const zodiacImg = zodiac ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`mystical golden chinese zodiac ${zodiac} statue dark background`)}?width=300&height=300&nologo=true` : "";
    const starSignImg = starSign ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`mystical zodiac sign ${starSign} astrology symbol golden`)}?width=300&height=300&nologo=true` : "";
    const missingElement = calculatedElements?.missingElement || 'Metal';
    const recommendedProducts = SHOP_PRODUCTS.slice(0, 3); 
    const isPalm = readingType === 'palm';

    const formatMarkdown = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/## (.*)/g, '<h3 style="color:#8a6e2f;border-bottom:1px solid #d4af37;padding-bottom:5px;margin-top:20px;font-family:Cinzel, serif;">$1</h3>')
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
    const elementsHeaderSearch = `## ⚖️ ${t.reportHeaderElements}`;
    
    let auraSection = mainContent;
    let elementsAndRest = "";
    let splitSuccess = false;

    if (calculatedElements && mainContent.includes(elementsHeaderSearch)) {
        const parts = mainContent.split(elementsHeaderSearch);
        if (parts.length > 1) {
            auraSection = parts[0];
            // We removed the header with split, so we add the text content after it.
            // We will render the Header manually, then Chart, then the rest.
            elementsAndRest = parts.slice(1).join(elementsHeaderSearch); 
            splitSuccess = true;
        }
    }

    return (
        <div style={{width: '95%', maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem'}}>
            <div style={{background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: `1px solid ${theme.gold}`, marginBottom: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px'}}>
                <div style={{textAlign: 'center'}}>
                    <div style={{color: '#888', fontSize: '0.8rem'}}>{t.ageLabel}</div>
                    <div style={{fontSize: '1.2rem', color: theme.gold}}>{age}</div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <div style={{color: '#888', fontSize: '0.8rem'}}>{t.genderLabel}</div>
                    <div style={{fontSize: '1.2rem', color: theme.gold}}>{gender === 'male' ? t.genderMale : t.genderFemale}</div>
                </div>
                {birthDate && (
                    <div style={{textAlign: 'center'}}>
                        <div style={{color: '#888', fontSize: '0.8rem'}}>{t.dobLabel}</div>
                        <div style={{fontSize: '1.2rem', color: theme.gold}}>{birthDate}</div>
                    </div>
                )}
            </div>
            
            <div style={{...styles.resultContainer, border: `1px solid ${theme.gold}`}} className="result-container-mobile">
                <div style={{...styles.toolbar, borderColor: 'rgba(138, 110, 47, 0.2)'}}>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <select style={{background: 'transparent', color: theme.darkGold, border: 'none', fontFamily: 'Cinzel, serif', cursor: 'pointer'}} value={language} onChange={onLanguageChange}>
                            {LANGUAGES.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                        <button onClick={onToggleSpeech} style={{background: 'transparent', border: 'none', color: theme.darkGold, cursor: 'pointer', fontSize: '1.2rem'}}>
                            {isSpeaking ? <i className="fas fa-stop-circle"></i> : <i className="fas fa-volume-up"></i>}
                        </button>
                    </div>
                </div>

                {/* 1. Zodiac Images at Top - Only show if available */}
                {(zodiac || starSign) && (
                    <>
                        <h3 style={{textAlign: 'center', color: '#8a6e2f', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginTop: '10px', fontFamily:'Cinzel, serif'}}>{t.zodiacTitle}</h3>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '10px', marginBottom: '30px'}}>
                            {zodiac && (
                                <div style={{textAlign: 'center'}}>
                                    <img src={zodiacImg} style={{width: '100px', height: '100px', borderRadius: '50%', border: `2px solid ${theme.darkGold}`}} />
                                    <div style={{fontWeight: 'bold', color: '#5d4037'}}>{zodiacName}</div>
                                    <div style={{fontSize: '0.8rem', color: '#888'}}>{t.chineseZodiac}</div>
                                </div>
                            )}
                            {starSign && (
                                <div style={{textAlign: 'center'}}>
                                    <img src={starSignImg} style={{width: '100px', height: '100px', borderRadius: '50%', border: `2px solid ${theme.darkGold}`}} />
                                    <div style={{fontWeight: 'bold', color: '#5d4037'}}>{starSignName}</div>
                                    <div style={{fontSize: '0.8rem', color: '#888'}}>{t.westernZodiac}</div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <h2 style={{textAlign: 'center', color: '#8a6e2f', fontFamily: 'Cinzel, serif', marginTop: 0}}>{t.resultTitle}</h2>
                
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
                                        <h3 style={{color:'#8a6e2f', borderBottom:'1px solid #d4af37', paddingBottom:'5px', marginTop:'20px', fontFamily:'Cinzel, serif'}}>
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
                                        <h3 style={{color:'#8a6e2f', borderBottom:'1px solid #d4af37', paddingBottom:'5px', marginTop:'20px', fontFamily:'Cinzel, serif'}}>
                                             ⚖️ {t.reportHeaderElements}
                                        </h3>
                                        <FiveElementsChart elements={calculatedElements} t={t} />
                                    </>
                                )}
                                <div className="fade-in" dangerouslySetInnerHTML={{ __html: formatMarkdown(mainContent) }} />
                            </>
                        )}
                        
                        {/* Master Optimization Button (Replaces content) */}
                        <div style={{textAlign: 'center', marginTop: '30px', marginBottom: '20px', borderTop: '1px solid #ddd', paddingTop: '20px'}}>
                            <button style={{...styles.button, width: '100%', padding: '15px', fontSize: '1.1rem'}} onClick={handleAdviceClick}>
                                <i className="fas fa-magic"></i> {t.masterOptimizationBtn || "Master Optimization Advice"}
                            </button>
                        </div>
                   </>
                )}

            </div>
            
            <div style={{marginTop: '2rem'}}>
                <h3 style={{textAlign: 'center', color: theme.gold, fontFamily: 'Cinzel, serif'}}>{t.recommendedProducts}</h3>
                <p style={{textAlign: 'center', color: '#ccc', fontStyle: 'italic', marginBottom: '20px'}}>
                   {t.luckyElement}: <span style={{color: theme.gold, fontWeight: 'bold'}}>{t[`element${missingElement}`] || missingElement}</span>
                </p>
                <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                    {recommendedProducts.map(prod => {
                        const prodName = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacName) : prod.defaultName;
                        // Seed recommended product images too for speed
                        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=200&height=200&nologo=true&seed=${prod.id}`;
                        return (
                            <div key={prod.id} style={{minWidth: '160px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
                                <img src={imgUrl} style={{width: '100%', borderRadius: '4px'}} loading="lazy" />
                                <div style={{fontSize: '0.9rem', color: theme.gold, margin: '5px 0', height: '40px', overflow: 'hidden'}}>{prodName}</div>
                                <div style={{fontWeight: 'bold', marginBottom: '5px'}}>{prod.price}</div>
                                <button style={{...styles.button, padding: '5px 10px', fontSize: '0.8rem', marginTop: '5px', minWidth: 'auto'}} onClick={() => onBuyProduct(prod)}>{t.buyNow}</button>
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
