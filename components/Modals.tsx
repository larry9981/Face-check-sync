
import React, { useState } from 'react';
import { theme, styles } from '../theme';
import { Product, Plan } from '../types';
import { PayPalButton, StripePaymentForm, QRCodePayment } from './PaymentIntegration';
import { SHOP_PRODUCTS } from '../products';
import { hashCode, ELEMENT_ADVICE } from '../utils';

export const FiveElementsBalanceModal = ({ t, missingElement, aiAdvice, onClose, onBuyProduct }: { t: any, missingElement: string, aiAdvice?: string, onClose: () => void, onBuyProduct: (p: Product) => void }) => {
    const elKey = missingElement || 'Metal';
    const adviceData = ELEMENT_ADVICE[elKey] || ELEMENT_ADVICE['Metal'];
    
    // Dynamic Advice from Translations or Utils
    const colorAdvice = t[`advice${elKey}Color`] || adviceData.color;
    const dirAdvice = t[`advice${elKey}Direction`] || adviceData.direction;
    const habitAdvice = t[`advice${elKey}Habit`] || adviceData.habit;
    const descAdvice = t[`advice${elKey}Desc`] || adviceData.desc;
    const nameAdvice = t[`advice${elKey}Name`] || "Consult a master.";
    // Fetch Diet and Home advice from translations if available, else fallback to utils
    const dietAdvice = t[`advice${elKey}Diet`] || adviceData.diet || "Eat balanced meals.";
    const homeAdvice = t[`advice${elKey}Home`] || adviceData.home || "Keep your home clean.";

    const matchingProducts = SHOP_PRODUCTS.filter(p => p.element === missingElement).slice(0, 4);

    const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
        <h3 style={{
            color: theme.gold, 
            borderBottom: `1px solid ${theme.darkGold}`, 
            paddingBottom: '10px', 
            marginTop: '30px', 
            marginBottom: '15px',
            fontFamily: 'Cinzel, serif',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            <i className={`fas ${icon}`}></i> {title}
        </h3>
    );

    const AdviceBox = ({ content }: { content: string }) => (
        <div style={{
            background: 'rgba(255,255,255,0.05)', 
            padding: '15px', 
            borderRadius: '4px', 
            lineHeight: '1.8',
            color: '#e0e0e0',
            borderLeft: `3px solid ${theme.gold}`,
            whiteSpace: 'pre-wrap', // Preserve newlines
            textAlign: 'justify'
        }}>
            {content}
        </div>
    );

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'}}>
            <div style={{...styles.glassPanel, maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '10px'}}>
                    <h2 style={{color: theme.gold, margin: 0, fontFamily: 'Cinzel, serif'}}>{t.balanceTitle}</h2>
                    <button onClick={onClose} style={{background: 'transparent', border: 'none', color: '#888', fontSize: '2rem', cursor: 'pointer'}}>&times;</button>
                </div>
                
                <div style={{marginBottom: '30px'}}>
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                         <div style={{fontSize: '1rem', color: '#aaa'}}>{t.yourWeakest}</div>
                         <div style={{fontSize: '2.5rem', color: theme.gold, fontFamily: 'Cinzel, serif', fontWeight: 'bold'}}>{t[`element${elKey}`]}</div>
                    </div>

                    {/* 1. Five Elements Advice */}
                    <SectionHeader icon="fa-balance-scale" title={t.adviceCategoryFiveElements || "Five Elements Advice"} />
                    <p style={{color: '#ccc', marginBottom: '15px', lineHeight: '1.6'}}>{descAdvice}</p>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                        <div style={{background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold}}>{t.luckyColors}:</strong> {colorAdvice}
                        </div>
                        <div style={{background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold}}>{t.luckyDirection}:</strong> {dirAdvice}
                        </div>
                        <div style={{background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold}}>{t.luckyHabit}:</strong> {habitAdvice}
                        </div>
                    </div>
                    
                    {/* Specific AI Advice integration - IMPROVED TYPOGRAPHY */}
                    {aiAdvice && (
                        <div style={{
                            marginTop: '25px', 
                            color: '#eee', 
                            padding: '25px', 
                            background: 'rgba(5, 5, 17, 0.6)',
                            borderRadius: '8px',
                            border: `1px solid ${theme.darkGold}`,
                            lineHeight: '1.9',
                            fontSize: '1.05rem',
                            whiteSpace: 'pre-wrap', // Crucial for paragraph separation
                            fontFamily: 'Noto Serif, serif',
                            textAlign: 'justify'
                        }}>
                             <h4 style={{color: theme.gold, marginTop: 0, marginBottom: '15px', fontFamily: 'Cinzel, serif', fontSize: '1.1rem', borderBottom: '1px dashed rgba(138,110,47,0.3)', paddingBottom: '10px'}}>
                                <i className="fas fa-magic" style={{marginRight: '10px'}}></i>
                                {t.masterOptimizationBtn} (AI)
                             </h4>
                             {aiAdvice.replace(/[#*]/g, '')}
                        </div>
                    )}

                    {/* 2. Naming Advice */}
                    <SectionHeader icon="fa-signature" title={t.namingAdvice} />
                    <AdviceBox content={nameAdvice} />

                    {/* 3. Home Feng Shui Advice */}
                    <SectionHeader icon="fa-home" title={t.adviceCategoryHome || "Home Feng Shui"} />
                    <AdviceBox content={homeAdvice} />

                    {/* 4. Dietary Advice */}
                    <SectionHeader icon="fa-utensils" title={t.adviceCategoryDiet || "Dietary Advice"} />
                    <AdviceBox content={dietAdvice} />

                    {/* 5. Lucky Jewelry / Accessories */}
                    <SectionHeader icon="fa-gem" title={t.adviceCategoryJewelry || "Lucky Jewelry"} />
                    <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                        {matchingProducts.map(prod => {
                            const zodiacLocal = t[`zodiac${prod.zodiac}`] || t[`star${prod.zodiac}`] || prod.zodiac;
                            const name = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacLocal) : prod.defaultName;
                            // Seed cache matching ShopPage
                            const seed = hashCode(prod.id);
                            const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=512&height=512&nologo=true&seed=${seed}`;
                            return (
                                <div key={prod.id} style={{minWidth: '140px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
                                    <img 
                                        src={imgUrl} 
                                        style={{width: '100px', height: '100px', borderRadius: '4px'}} 
                                        loading="lazy"
                                        onError={(e: any) => e.target.src = "https://placehold.co/100x100/000000/d4af37?text=Item"} 
                                    />
                                    <div style={{fontSize: '0.8rem', color: theme.gold, margin: '5px 0', height: '35px', overflow: 'hidden'}}>{name}</div>
                                    <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{prod.price}</div>
                                    <button style={{...styles.button, padding: '5px 10px', fontSize: '0.7rem', marginTop: '5px', minWidth: 'auto'}} onClick={() => onBuyProduct(prod)}>{t.buyNow}</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductDetailModal = ({ t, product, onClose, onAddToCart, onBuyNow, onSwitchProduct, isPageMode = false }: { t: any, product: Product, onClose: () => void, onAddToCart: () => void, onBuyNow: () => void, onSwitchProduct?: (p: Product) => void, isPageMode?: boolean }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;
    const desc = t[product.descKey] ? t[product.descKey].replace('{zodiac}', zodiacLocal) : "Mystical Item";
    
    // Sync with ShopPage: Use seed and 512 size to leverage browser cache for instant loading
    const seed = hashCode(product.id);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(product.imagePrompt)}?width=512&height=512&nologo=true&seed=${seed}`;

    const handleAddToCartClick = () => {
        onAddToCart();
        setIsAdded(true);
        // Alert feedback logic is handled here via button state and toast in parent
        setTimeout(() => setIsAdded(false), 2000);
    };

    const containerStyle: React.CSSProperties = isPageMode ? {
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        zIndex: 1
    } : {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.85)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)'
    };

    return (
        <div style={containerStyle}>
            <div style={{...styles.glassPanel, maxWidth: '900px', width: '95%', maxHeight: isPageMode ? 'none' : '90vh', overflowY: isPageMode ? 'visible' : 'auto', position: 'relative', display: 'flex', flexDirection: 'column'}}>
                
                {isPageMode ? (
                    <button 
                        onClick={onClose} 
                        style={{
                            position: 'absolute', 
                            top: '20px', 
                            left: '20px', 
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
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                    >
                        <i className="fas fa-arrow-left"></i> {t.backBtn}
                    </button>
                ) : (
                    <button 
                        onClick={onClose} 
                        style={{
                            position: 'absolute', 
                            top: '15px', 
                            right: '15px', 
                            background: 'rgba(0,0,0,0.6)', 
                            border: '1px solid #d4af37', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            color: '#d4af37', 
                            fontSize: '1.5rem', 
                            cursor: 'pointer', 
                            zIndex: 20, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                    >
                        &times;
                    </button>
                )}
                
                <div style={{display: 'flex', flexDirection: 'row', gap: '30px', padding: '20px', marginTop: isPageMode ? '40px' : '0'}} className="product-modal-mobile">
                    <div style={{flex: 1, position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050511', borderRadius: '8px', border: `1px solid ${theme.gold}`}}>
                        {!imgLoaded && !imgError && (
                            <div style={{position: 'absolute', zIndex: 0}}>
                                <i className="fas fa-circle-notch fa-spin" style={{fontSize: '3rem', color: theme.darkGold}}></i>
                            </div>
                        )}
                        
                        {imgError ? (
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', zIndex: 2}}>
                                <i className="fas fa-image" style={{fontSize: '3rem', marginBottom: '10px'}}></i>
                                <span>Image Unavailable</span>
                                <button onClick={() => { setImgError(false); setImgLoaded(false); }} style={{...styles.secondaryButton, marginTop: '10px', fontSize: '0.8rem'}}>Retry</button>
                            </div>
                        ) : (
                            <img 
                                src={imageUrl} 
                                style={{width: '100%', borderRadius: '8px', zIndex: 1, display: 'block'}} 
                                onLoad={() => setImgLoaded(true)}
                                onError={() => { setImgLoaded(true); setImgError(true); }}
                                alt={name}
                            />
                        )}
                    </div>

                    <div style={{flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '2rem', marginBottom: '10px', paddingRight: '40px'}}>{name}</h2>
                        <div style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px'}}>{product.price}</div>
                        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', marginBottom: '30px', lineHeight: '1.6', color: '#ccc'}}><p>{desc}</p></div>
                        <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                            <button style={{...styles.button, marginTop: 0, flex: 1}} onClick={onBuyNow}>{t.buyNow}</button>
                            <button 
                                style={{
                                    ...styles.secondaryButton, 
                                    marginTop: 0, 
                                    flex: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '10px',
                                    background: isAdded ? '#27ae60' : 'transparent',
                                    borderColor: isAdded ? '#27ae60' : theme.darkGold,
                                    color: isAdded ? '#fff' : theme.darkGold,
                                    transition: 'all 0.3s'
                                }} 
                                onClick={handleAddToCartClick}
                                disabled={isAdded}
                            >
                                {isAdded ? <><i className="fas fa-check"></i> Added!</> : <><i className="fas fa-shopping-cart"></i> {t.addToCart}</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* More Products / Shop List at Bottom */}
                <div style={{marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${theme.darkGold}`}}>
                    <h3 style={{color: theme.gold, textAlign: 'center', fontFamily: 'Cinzel, serif', marginBottom: '20px'}}>{t.moreProducts || "Complete Collection"}</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', paddingBottom: '20px'}}>
                        {SHOP_PRODUCTS.map((p) => {
                             const pName = t[p.nameKey] ? t[p.nameKey].replace('{zodiac}', t[`zodiac${p.zodiac}`] || p.zodiac) : p.defaultName;
                             // Use small thumbnail for list
                             const pSeed = hashCode(p.id);
                             const pImg = `https://image.pollinations.ai/prompt/${encodeURIComponent(p.imagePrompt)}?width=150&height=150&nologo=true&seed=${pSeed}`;
                             const isCurrent = p.id === product.id;
                             
                             return (
                                 <div 
                                    key={p.id} 
                                    onClick={() => onSwitchProduct && onSwitchProduct(p)}
                                    style={{
                                        width: '120px', 
                                        cursor: 'pointer', 
                                        opacity: isCurrent ? 0.5 : 1, 
                                        border: isCurrent ? `1px solid ${theme.gold}` : '1px solid transparent',
                                        borderRadius: '6px',
                                        padding: '5px',
                                        background: 'rgba(0,0,0,0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                 >
                                     <img src={pImg} style={{width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px'}} loading="lazy" />
                                     <div style={{fontSize: '0.7rem', color: '#ccc', marginTop: '5px', height: '30px', overflow: 'hidden', textAlign: 'center'}}>{pName}</div>
                                 </div>
                             )
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export const PaymentModal = ({ t, plan, onClose, onSuccess }: { t: any, plan: Plan | Product, onClose: () => void, onSuccess: (details: any) => void }) => {
    // Detect if we should offer Chinese Payment Methods / Contact Rules
    const isChinese = t.title === "玄机面相" || t.title === "玄機面相";

    const [method, setMethod] = useState<'card' | 'paypal' | 'wechat' | 'alipay'>(isChinese ? 'wechat' : 'card');
    const [successState, setSuccessState] = useState(false);
    
    // Shipping Address State
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    
    // Contact Info
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const title = 'defaultName' in plan ? (plan as Product).defaultName : (plan as Plan).title;
    const priceStr = plan.price.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(priceStr);
    
    // Physical products from Shop need shipping
    const isPhysicalProduct = 'category' in plan;
    const needsShipping = isPhysicalProduct || plan.id === 'cart_checkout';
    
    // Validation Logic
    const isPhoneRequired = isChinese;
    const isEmailRequired = !isChinese; 

    // Basic Validation Check
    const hasShipping = !needsShipping || (name && address && city && zip && country);
    const hasContact = (!isPhoneRequired || phone) && (!isEmailRequired || email);
    const canProceedToPay = hasShipping && hasContact;

    const handleSuccess = (details?: any) => {
        setSuccessState(true);
        // Include shipping info in the success callback
        const paymentDetails = {
            ...details,
            shipping: needsShipping ? { name, address, city, zip, country } : null,
            contact: { email, phone },
            method: method
        };
        setTimeout(() => onSuccess(paymentDetails), 2000);
    };

    const handleError = (err: any) => {
        alert("Payment Error: " + err.message || err);
    };

    if (successState) return <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{...styles.glassPanel, textAlign: 'center', maxWidth: '400px'}}><h2 style={{color: theme.gold}}>{t.success}</h2></div></div>;

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'}}>
          <div style={{...styles.glassPanel, maxWidth: '550px', width: '95%', maxHeight: '90vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{color: theme.gold, margin: 0, fontFamily: 'Cinzel, serif'}}>{t.paymentTitle}</h2>
                <button onClick={onClose} style={{background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
            </div>
            
            {/* Order Summary */}
            <div style={{marginBottom: '20px', padding: '15px', border: `1px solid ${theme.darkGold}`, borderRadius: '4px', background: 'rgba(212, 175, 55, 0.1)'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span style={{fontWeight: 'bold'}}>{title}</span>
                     <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: theme.gold}}>${priceVal.toFixed(2)}</span>
                 </div>
                 {!needsShipping && <div style={{fontSize: '0.8rem', color: '#aaa', marginTop: '5px'}}>* Digital Service (Instant Access)</div>}
            </div>
            
            {/* Contact Information */}
            <div style={{marginBottom: '20px'}}>
                <h3 style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase'}}>Contact Info</h3>
                <div style={{marginBottom: '10px'}}>
                    <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>
                        {t.phoneLabel} {isPhoneRequired && <span style={{color: theme.accent}}>* ({t.required})</span>}
                    </label>
                    <input type="tel" placeholder="+1..." style={styles.cardInput} value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                    <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>
                        {t.emailLabel} {isEmailRequired && <span style={{color: theme.accent}}>* ({t.required})</span>}
                    </label>
                    <input type="email" placeholder="you@example.com" style={styles.cardInput} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
            </div>

            {needsShipping && (
                <div style={{marginBottom: '20px'}}>
                    <h3 style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase'}}>{t.shippingDetails}</h3>
                    <input type="text" placeholder={t.recipientName} style={styles.cardInput} value={name} onChange={e => setName(e.target.value)} />
                    <input type="text" placeholder={t.addressLine} style={styles.cardInput} value={address} onChange={e => setAddress(e.target.value)} />
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input type="text" placeholder={t.city} style={{...styles.cardInput, marginBottom: 0}} value={city} onChange={e => setCity(e.target.value)} />
                        <input type="text" placeholder={t.zipCode} style={{...styles.cardInput, marginBottom: 0}} value={zip} onChange={e => setZip(e.target.value)} />
                    </div>
                    <input type="text" placeholder={t.country} style={{...styles.cardInput, marginTop: '10px'}} value={country} onChange={e => setCountry(e.target.value)} />
                </div>
            )}

            <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '10px', color: '#aaa'}}>{t.paymentMethod}</label>
                <div style={{display: 'grid', gridTemplateColumns: isChinese ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: '8px'}}>
                    
                    {isChinese && (
                        <>
                             <button style={{padding: '10px', background: method === 'wechat' ? '#2ecc71' : 'transparent', border: `1px solid ${method === 'wechat' ? '#2ecc71' : theme.darkGold}`, color: method === 'wechat' ? '#fff' : theme.darkGold, fontSize: '0.8rem'}} onClick={() => setMethod('wechat')}>
                                 <i className="fab fa-weixin"></i> WeChat
                             </button>
                             <button style={{padding: '10px', background: method === 'alipay' ? '#3498db' : 'transparent', border: `1px solid ${method === 'alipay' ? '#3498db' : theme.darkGold}`, color: method === 'alipay' ? '#fff' : theme.darkGold, fontSize: '0.8rem'}} onClick={() => setMethod('alipay')}>
                                 <i className="fab fa-alipay"></i> Alipay
                             </button>
                        </>
                    )}

                    <button style={{padding: '10px', background: method === 'card' ? theme.darkGold : 'transparent', border: `1px solid ${theme.darkGold}`, color: method === 'card' ? '#000' : theme.darkGold, fontSize: '0.8rem', whiteSpace: 'nowrap'}} onClick={() => setMethod('card')}>
                        <i className="fas fa-credit-card"></i> Card
                    </button>
                    <button style={{padding: '10px', background: method === 'paypal' ? '#0070ba' : 'transparent', border: `1px solid ${method === 'paypal' ? '#0070ba' : theme.darkGold}`, color: method === 'paypal' ? '#fff' : theme.darkGold, fontSize: '0.8rem'}} onClick={() => setMethod('paypal')}>
                        <i className="fab fa-paypal"></i> PayPal
                    </button>
                </div>
            </div>

            {canProceedToPay ? (
                <>
                    {method === 'card' && <StripePaymentForm amount={priceVal} description={title} currency="USD" t={t} onSuccess={handleSuccess} onError={handleError} />}
                    {method === 'paypal' && <PayPalButton amount={priceVal} description={title} currency="USD" t={t} onSuccess={handleSuccess} onError={handleError} />}
                    {(method === 'wechat' || method === 'alipay') && <QRCodePayment provider={method} amount={priceVal} description={title} t={t} onSuccess={handleSuccess} />}
                </>
            ) : (
                <div style={{padding: '10px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: '#ffaaaa', fontSize: '0.9rem', textAlign: 'center'}}>
                    Please complete all required fields (*) to proceed.
                </div>
            )}
          </div>
        </div>
    );
};
