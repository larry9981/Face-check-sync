
import React from 'react';
import { theme, styles } from '../theme';
import { BaguaSVG, FaceMapSVG } from '../components/Icons';
import { FiveElementsChart } from '../components/Charts';
import { getChineseZodiac, getWesternZodiac, calculateAge } from '../utils';
import { SHOP_PRODUCTS } from '../products';

export const LoadingSpinner = ({ t, progress }: { t: any, progress?: number }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', width: '100%', maxWidth: '400px' }}>
    <div style={{...styles.baguaContainer, width: '100px', height: '100px', margin: '0 auto', animation: 'spin 1.5s linear infinite'}}>
       {BaguaSVG}
    </div>
    <h3 style={{ marginTop: '1rem', color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.5rem' }}>
      {t.analyzingTitle}
    </h3>
    <p style={{ fontSize: '1rem', color: '#888', fontStyle: 'italic', marginBottom: '20px' }}>
      {t.analyzingDesc}
    </p>
    
    {/* Analysis Progress Bar */}
    {typeof progress === 'number' && (
      <div style={{width: '100%', padding: '0 20px', boxSizing: 'border-box'}}>
        <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${theme.darkGold}`}}>
            <div style={{
                width: `${progress}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, ${theme.darkGold}, ${theme.gold})`, 
                transition: 'width 0.2s ease-out',
                boxShadow: `0 0 10px ${theme.gold}`
            }}></div>
        </div>
        <div style={{color: theme.gold, fontSize: '0.9rem', marginTop: '8px', fontFamily: 'Cinzel, serif'}}>
            {Math.round(progress)}%
        </div>
      </div>
    )}
  </div>
);

export const RenderStartView = ({ t, freeTrials, onStart }: { t: any, freeTrials: number, onStart: () => void }) => (
    <div style={styles.glassPanel} className="glass-panel-mobile">
      <div style={{...styles.baguaContainer, margin: '0 auto 1.5rem'}}>
         {BaguaSVG}
      </div>
      <h1 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '1rem'}}>{t.heroTitle}</h1>
      <p style={{color: '#ccc', marginBottom: '2rem', fontSize: '1.1rem'}}>{t.heroDesc}</p>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
          <FaceMapSVG t={t} />
      </div>
      <button style={styles.button} onClick={onStart}>{t.startBtn}</button>
      <div style={{marginTop: '15px', fontSize: '0.8rem', color: '#888'}}>
          {t.freeTrialsHint.replace('{count}', freeTrials.toString())}
      </div>
    </div>
);

export const RenderSelectionView = ({ t, gender, dobYear, dobMonth, dobDay, dobHour, dobMinute, dobSecond, uploadProgress, onSetGender, onSetDobYear, onSetDobMonth, onSetDobDay, onSetDobHour, onSetDobMinute, onSetDobSecond, onStartCamera, onUpload, onBack }: any) => {
    const years = Array.from({length: 151}, (_, i) => 1900 + i);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const hours = Array.from({length: 24}, (_, i) => i);
    const minutesSeconds = Array.from({length: 60}, (_, i) => i);

    return (
      <div style={styles.glassPanel} className="glass-panel-mobile">
          <h2 style={{color: theme.gold, marginBottom: '20px', fontFamily: 'Cinzel, serif'}}>{t.chooseMethod}</h2>
          <div style={{textAlign: 'left', marginBottom: '20px'}}>
              <h3 style={{color: theme.darkGold, fontSize: '1rem', borderBottom: '1px solid rgba(138, 110, 47, 0.3)', paddingBottom: '5px', marginBottom: '15px'}}>{t.profileTitle}</h3>
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
          <button style={{...styles.button, width: '100%'}} onClick={onStartCamera}>
            <i className="fas fa-camera"></i> {t.scanBtn}
          </button>
          <div style={{marginTop: '15px', position: 'relative'}}>
            <button style={{...styles.secondaryButton, width: '100%'}} onClick={() => document.getElementById('file-upload')?.click()}>
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
          <button style={{...styles.secondaryButton, border: 'none', color: '#666', marginTop: '20px', fontSize: '0.8rem'}} onClick={onBack}>
              {t.backBtn}
          </button>
      </div>
    );
};

export const RenderCameraView = ({ t, videoRef, canvasRef, onStopCamera, onCapture }: any) => (
    <div style={{
        ...styles.glassPanel, 
        maxWidth: '500px', // Reduced width for portrait feel on PC
        width: '95%', 
        padding: '0', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '650px', // Fixed height to ensure visibility
        maxHeight: '90vh',
        margin: '0 auto'
    }}>
       <div style={{flex: 1, position: 'relative', background: '#000', overflow: 'hidden'}}>
           <video ref={videoRef} autoPlay playsInline muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)'}}></video>
           <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
           {/* Face Guide Overlay - Narrower */}
           <div style={{
               position: 'absolute', 
               top: '50%', 
               left: '50%', 
               transform: 'translate(-50%, -50%)', 
               width: '220px', 
               height: '320px', 
               border: `2px dashed ${theme.gold}`, 
               borderRadius: '50% 50% 60% 60%', 
               opacity: 0.6, 
               boxShadow: `0 0 50px ${theme.gold} inset`
           }}></div>
           {/* Crosshairs */}
           <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '1px', background: theme.gold, opacity: 0.3}}></div>
           <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', height: '100%', width: '1px', background: theme.gold, opacity: 0.3}}></div>
       </div>
       <div style={{
           padding: '15px 20px', 
           background: '#050511', 
           display: 'flex', 
           justifyContent: 'space-between', 
           alignItems: 'center', 
           borderTop: `1px solid ${theme.darkGold}`,
           flexShrink: 0
       }}>
           <button style={{...styles.secondaryButton, marginTop: 0, padding: '8px 15px', fontSize: '0.8rem'}} onClick={onStopCamera}>{t.cancelBtn}</button>
           <button onClick={onCapture} style={{
               width: '70px', height: '70px', borderRadius: '50%', 
               background: '#fff', border: `4px solid ${theme.gold}`, 
               cursor: 'pointer', boxShadow: `0 0 15px ${theme.gold}`,
               display: 'flex', alignItems: 'center', justifyContent: 'center'
           }}>
               <i className="fas fa-camera" style={{fontSize: '1.8rem', color: '#333'}}></i>
           </button>
           <div style={{width: '60px'}}></div>
       </div>
    </div>
);

export const RenderResultView = ({ t, birthDate, gender, calculatedElements, resultText, language, isSpeaking, isTranslating, LANGUAGES, onLanguageChange, onToggleSpeech, onAnalyzeAnother, onBuyProduct, onOpenBalance }: any) => {
    const age = calculateAge(birthDate);
    const zodiac = getChineseZodiac(birthDate);
    const starSign = getWesternZodiac(birthDate);
    const zodiacName = zodiac ? (t[`zodiac${zodiac}`] || zodiac) : "";
    const starSignName = starSign ? (t[`star${starSign}`] || starSign) : "";
    const zodiacImg = zodiac ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`mystical golden chinese zodiac ${zodiac} statue dark background`)}?width=300&height=300&nologo=true` : "";
    const starSignImg = starSign ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`mystical zodiac sign ${starSign} astrology symbol golden`)}?width=300&height=300&nologo=true` : "";
    const missingElement = calculatedElements?.missingElement || 'Metal';
    const recommendedProducts = SHOP_PRODUCTS.slice(0, 3); 

    const formatMarkdown = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/## (.*)/g, '<h3 style="color:#8a6e2f;border-bottom:1px solid #ddd;padding-bottom:5px;margin-top:20px;">$1</h3>')
                   .replace(/\n/g, '<br/>');
    }

    // Attempt to split text at the Five Elements header to insert chart
    // We look for the marker used in the prompt: ## ⚖️
    const splitRegex = /##\s*⚖️.*(?:\r\n|\r|\n)/;
    const parts = resultText.split(splitRegex);
    const hasSplit = parts.length >= 2;

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
                <div style={{textAlign: 'center'}}>
                    <div style={{color: '#888', fontSize: '0.8rem'}}>{t.dobLabel}</div>
                    <div style={{fontSize: '1.2rem', color: theme.gold}}>{birthDate}</div>
                </div>
            </div>
            
            <div style={styles.resultContainer} className="result-container-mobile">
                <div style={styles.toolbar}>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <select style={{background: 'transparent', color: theme.darkGold, border: 'none', fontFamily: 'Cinzel, serif', cursor: 'pointer'}} value={language} onChange={onLanguageChange}>
                            {LANGUAGES.map((l: any) => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                        <button onClick={onToggleSpeech} style={{background: 'transparent', border: 'none', color: theme.darkGold, cursor: 'pointer', fontSize: '1.2rem'}}>
                            {isSpeaking ? <i className="fas fa-stop-circle"></i> : <i className="fas fa-volume-up"></i>}
                        </button>
                    </div>
                </div>

                {/* 1. Zodiac Images at Top */}
                <h3 style={{textAlign: 'center', color: '#8a6e2f', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginTop: '10px'}}>{t.zodiacTitle}</h3>
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

                <h2 style={{textAlign: 'center', color: '#8a6e2f', fontFamily: 'Cinzel, serif', marginTop: 0}}>{t.resultTitle}</h2>
                
                {isTranslating ? (
                    <div style={{textAlign:'center', padding:'40px', color: theme.darkGold}}>
                        <i className="fas fa-spinner fa-spin" style={{fontSize: '2rem'}}></i>
                        <div style={{marginTop:'10px'}}>{t.translating}</div>
                    </div>
                ) : (
                    hasSplit ? (
                        <>
                            {/* Intro Text */}
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(parts[0]) }} />
                            
                            {/* Five Elements Section (Chart Inserted Here) */}
                            <h3 style={{color:'#8a6e2f', borderBottom:'1px solid #ddd', paddingBottom:'5px', marginTop:'20px'}}>
                                 ⚖️ Five Elements (Wu Xing)
                            </h3>
                            <FiveElementsChart elements={calculatedElements} t={t} />
                            
                            {/* Balance Button */}
                            <div style={{textAlign: 'center', margin: '20px 0'}}>
                                <button style={{...styles.button, width: 'auto', padding: '10px 20px', fontSize: '0.9rem'}} onClick={onOpenBalance}>
                                    <i className="fas fa-balance-scale"></i> {t.balanceBtn}
                                </button>
                            </div>
                            
                            {/* Remaining Text */}
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(parts.slice(1).join('')) }} />
                        </>
                    ) : (
                        <>
                            {/* Fallback: Chart then Full Text */}
                             <h3 style={{color:'#8a6e2f', borderBottom:'1px solid #ddd', paddingBottom:'5px', marginTop:'20px'}}>
                                 ⚖️ Five Elements (Wu Xing)
                            </h3>
                            <FiveElementsChart elements={calculatedElements} t={t} />
                            
                             {/* Balance Button */}
                            <div style={{textAlign: 'center', margin: '20px 0'}}>
                                <button style={{...styles.button, width: 'auto', padding: '10px 20px', fontSize: '0.9rem'}} onClick={onOpenBalance}>
                                    <i className="fas fa-balance-scale"></i> {t.balanceBtn}
                                </button>
                            </div>
                            
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(resultText) }} />
                        </>
                    )
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
                        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=200&height=200&nologo=true`;
                        return (
                            <div key={prod.id} style={{minWidth: '160px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
                                <img src={imgUrl} style={{width: '100%', borderRadius: '4px'}} />
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
