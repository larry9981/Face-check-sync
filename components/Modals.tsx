
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Product, Plan } from '../types';
import { SHOP_PRODUCTS } from '../products';
import { hashCode, ELEMENT_ADVICE, ImagePersistence } from '../utils';

// --- NEW COMPONENT: Cached Image ---
// Handles async loading from IndexedDB to avoid re-fetching from API
export const CachedImage = ({ productId, prompt, size = 512, style, className, imageUrl }: { productId: string, prompt: string, size?: number, style?: React.CSSProperties, className?: string, imageUrl?: string }) => {
    // If we have a direct imageUrl, use it immediately
    if (imageUrl && imageUrl.trim() !== "") {
        return <img src={imageUrl} style={style} className={className} alt="Product" referrerPolicy="no-referrer" />;
    }

    // Initialize with memory cache if available for instant render
    const uniqueId = `${productId}_${size}`;
    const initialUrl = ImagePersistence.memoryCache.get(uniqueId) || null;
    
    const [url, setUrl] = useState<string | null>(initialUrl);
    const [loading, setLoading] = useState(!initialUrl);

    useEffect(() => {
        // If we already have it from memory cache (set in initial state), do nothing
        if (url) return;

        let mounted = true;
        setLoading(true);
        
        // Load from DB or Network
        // We assume 'productId' + size is unique enough for this demo context
        // In reality, might want to include prompt hash if prompts change dynamicall
        ImagePersistence.loadImage(productId, prompt, size).then(blobUrl => {
            if (mounted) {
                setUrl(blobUrl);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [productId, prompt, size]);

    if (loading) {
        return (
            <div style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a'}}>
                <i className="fas fa-circle-notch fa-spin" style={{color: theme.darkGold, fontSize: '2rem'}}></i>
            </div>
        );
    }

    return <img src={url || ''} style={style} className={className} alt="Product content" />;
};

// Helper component for small product items (list view)
const CachedProductItem = ({ product, t, onClick, isLarge = false }: { product: Product, t: any, onClick: () => void, isLarge?: boolean }) => {
    if (isLarge) return null; 

    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;

    return (
         <div 
            onClick={onClick}
            style={{
                width: '120px', 
                cursor: 'pointer', 
                border: '1px solid transparent',
                borderRadius: '6px',
                padding: '5px',
                background: 'rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
                textAlign: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = theme.gold}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
         >
             <div style={{width: '100%', height: '100px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <CachedImage productId={product.id} prompt={product.imagePrompt} size={150} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} imageUrl={product.imageUrl} />
             </div>
             <div style={{fontSize: '0.7rem', color: '#ccc', marginTop: '5px', height: '30px', overflow: 'hidden'}}>{name}</div>
             <div style={{fontWeight: 'bold', fontSize: '0.8rem', color: theme.gold}}>{product.price}</div>
         </div>
    );
};

export const FiveElementsBalanceModal = ({ t, missingElement, aiAdvice, onClose, onBuyProduct }: { t: any, missingElement: string, aiAdvice?: string, onClose: () => void, onBuyProduct: (p: Product) => void }) => {
    const elKey = missingElement || 'Metal';
    const staticAdvice = ELEMENT_ADVICE[elKey] || ELEMENT_ADVICE['Metal'];
    
    // --- DYNAMIC AI PARSING ---
    // If AI Advice is present, try to extract specific sections to override static content
    // We look for patterns like "**Dietary Advice**: Content..."
    const parseSection = (key: string, fallback: string) => {
        if (!aiAdvice) return fallback;
        const regex = new RegExp(`\\*\\*${key}\\*\\*:?\\s*(.*?)(?=(\\n\\*\\*|$))`, 'si');
        const match = aiAdvice.match(regex);
        return match ? match[1].trim() : fallback;
    };

    // Use keys from translations.ts for matching
    const dietContent = parseSection(t.adviceCategoryDiet, t[`advice${elKey}Diet`] || staticAdvice.diet);
    const homeContent = parseSection(t.adviceCategoryHome, t[`advice${elKey}Home`] || staticAdvice.home);
    const jewelryContent = parseSection(t.adviceCategoryJewelry, t.recommendedCures || "Consult our shop.");
    const elementAnalysis = parseSection(t.adviceCategoryFiveElements, t[`advice${elKey}Desc`] || staticAdvice.desc);
    const nameContent = parseSection(t.namingAdvice, t[`advice${elKey}Name`] || "Consult a master.");

    // Filter "remaining" AI advice (general philosophy/intro) if parsed successfully, or just show full block
    // For simplicity, we just show the parsed sections in the UI boxes.
    
    const matchingProducts = SHOP_PRODUCTS.filter(p => p.element === missingElement).slice(0, 4);

    const SectionHeader = ({ icon, title }: { icon: string, title: string }) => (
        <h3 style={{color: theme.gold, borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '10px', marginTop: '30px', marginBottom: '15px', fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <i className={`fas ${icon}`}></i> {title}
        </h3>
    );

    const AdviceBox = ({ content }: { content: string }) => (
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '4px', lineHeight: '1.8', color: '#e0e0e0', borderLeft: `3px solid ${theme.gold}`, whiteSpace: 'pre-wrap', textAlign: 'justify'}}>
            {content.replace(/\*\*/g, '')}
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

                    <SectionHeader icon="fa-balance-scale" title={t.adviceCategoryFiveElements} />
                    <AdviceBox content={elementAnalysis} />
                    
                    {/* Fallback Display: If parsing failed completely but text exists, show raw text */}
                    {aiAdvice && !dietContent.includes(aiAdvice.substring(0, 20)) && elementAnalysis === staticAdvice.desc && (
                        <div style={{marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', border: '1px dashed #555'}}>
                             {aiAdvice.replace(/[#*]/g, '')}
                        </div>
                    )}

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px'}}>
                        <div style={{background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '4px'}}><strong style={{color: theme.gold}}>{t.luckyColors}:</strong> {t[`advice${elKey}Color`] || staticAdvice.color}</div>
                        <div style={{background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '4px'}}><strong style={{color: theme.gold}}>{t.luckyDirection}:</strong> {t[`advice${elKey}Direction`] || staticAdvice.direction}</div>
                        <div style={{background: 'rgba(212, 175, 55, 0.1)', padding: '10px', borderRadius: '4px'}}><strong style={{color: theme.gold}}>{t.luckyHabit}:</strong> {t[`advice${elKey}Habit`] || staticAdvice.habit}</div>
                    </div>

                    <SectionHeader icon="fa-signature" title={t.namingAdvice} />
                    <AdviceBox content={nameContent} />
                    
                    <SectionHeader icon="fa-home" title={t.adviceCategoryHome} />
                    <AdviceBox content={homeContent} />
                    
                    <SectionHeader icon="fa-utensils" title={t.adviceCategoryDiet} />
                    <AdviceBox content={dietContent} />

                    <SectionHeader icon="fa-gem" title={t.adviceCategoryJewelry} />
                    {jewelryContent !== (t.recommendedCures || "Consult our shop.") && <AdviceBox content={jewelryContent} />}
                    
                    <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', marginTop: '15px'}}>
                        {matchingProducts.map(prod => (
                            <div key={prod.id} style={{minWidth: '140px'}}>
                                <CachedProductItem product={prod} t={t} onClick={() => onBuyProduct(prod)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductDetailModal: React.FC<{ t: any, product: Product, onClose: () => void, onAddToCart: () => void, onBuyNow: () => void, onSwitchProduct?: (p: Product) => void, isPageMode?: boolean }> = ({ t, product, onClose, onAddToCart, onBuyNow, onSwitchProduct, isPageMode = false }) => {
    const [isAdded, setIsAdded] = useState(false);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;
    const desc = t[product.descKey] ? t[product.descKey].replace('{zodiac}', zodiacLocal) : (product.defaultDescription || "Mystical Item");

    const handleAddToCartClick = () => {
        onAddToCart();
        setIsAdded(true);
        setTimeout(() => {
            if (isMounted.current) setIsAdded(false);
        }, 2000);
    };

    const containerStyle: React.CSSProperties = isPageMode ? {
        position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 1, paddingBottom: '20px'
    } : {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
    };

    return (
        <div style={containerStyle}>
            {/* Top Navigation */}
             {isPageMode ? (
                <button onClick={onClose} style={{position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', border: `1px solid ${theme.gold}`, borderRadius: '4px', color: theme.gold, padding: '8px 15px', cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', transition: 'all 0.2s'}}>
                    <i className="fas fa-arrow-left"></i> {t.backBtn}
                </button>
            ) : (
                <button onClick={onClose} style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', border: '1px solid #d4af37', borderRadius: '50%', width: '40px', height: '40px', color: '#d4af37', fontSize: '1.5rem', cursor: 'pointer', zIndex: 20}}>&times;</button>
            )}

            <div style={{...styles.glassPanel, maxWidth: '1000px', width: '95%', maxHeight: isPageMode ? 'none' : '90vh', overflowY: isPageMode ? 'visible' : 'auto', position: 'relative', display: 'flex', flexDirection: 'column', padding: '0', border: 'none', background: 'transparent', boxShadow: 'none'}}>
                
                {/* 1. HERO SECTION (Responsive Layout: Row on PC, Column on Mobile) */}
                <div className="glass-panel-mobile product-detail-container" style={{...styles.glassPanel, margin: '0 auto 20px', border: `1px solid ${theme.darkGold}`}}>
                    {/* LEFT: Image */}
                    <div className="product-detail-image">
                        <div style={{width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${theme.gold}`, boxShadow: '0 0 20px rgba(0,0,0,0.5)'}}>
                            <CachedImage productId={product.id} prompt={product.imagePrompt} size={512} style={{width: '100%', height: '100%', objectFit: 'cover'}} imageUrl={product.imageUrl} />
                        </div>
                    </div>
                    
                    {/* RIGHT: Content */}
                    <div className="product-detail-content">
                        <h1 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '2.5rem', margin: '0 0 5px 0', lineHeight: 1.2}}>{name}</h1>
                        {product.sku && (
                            <div style={{color: '#aaa', fontSize: '0.85rem', marginBottom: '15px', fontFamily: 'monospace'}}>SKU: {product.sku}</div>
                        )}
                        <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '20px'}}>{product.price}</div>
                        <p style={{color: '#ccc', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '20px'}}>{desc}</p>
                        
                        {product.longDescription && (
                            <div style={{marginTop: '15px', marginBottom: '25px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px'}}>
                                <h4 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '1.1rem', margin: '0 0 10px 0'}}>Sacred Attributes & Details</h4>
                                <div style={{color: '#b5b5c3', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line'}}>{product.longDescription}</div>
                            </div>
                        )}
                        
                        {/* BUTTONS INTEGRATED HERE */}
                        <div className="product-detail-buttons">
                            <button style={{...styles.button, marginTop: 0, minWidth: '200px'}} onClick={onBuyNow}>
                                {t.buyNow}
                            </button>
                            <button 
                                style={{
                                    ...styles.secondaryButton, marginTop: 0, minWidth: '200px',
                                    background: isAdded ? '#27ae60' : '#3498db', // Blue background
                                    borderColor: isAdded ? '#27ae60' : '#3498db',
                                    color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }} 
                                onClick={handleAddToCartClick}
                                disabled={isAdded}
                            >
                                {isAdded ? <><i className="fas fa-check"></i> Added!</> : <><i className="fas fa-shopping-cart"></i> {t.addToCart}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PaymentModal = ({ t, plan, onClose, onSuccess, userId }: { t: any, plan: Plan | Product, onClose: () => void, onSuccess: (details: any) => void, userId?: string }) => {
    const [successState, setSuccessState] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [shippingAddr, setShippingAddr] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

    let title = '';

    if (plan.id === 'sub_monthly') {
        title = t.planSubMonth;
    } else if (plan.id === 'one_month') {
        title = t.planOneMonth;
    } else if (plan.id === 'sub_year') {
        title = t.planSubYear;
    } else if (plan.id === 'single') {
        title = t.planSingle;
    } else if ('nameKey' in plan) {
        const p = plan as Product;
        const zodiacLocal = t[`zodiac${p.zodiac}`] || t[`star${p.zodiac}`] || p.zodiac;
        title = t[p.nameKey] ? t[p.nameKey].replace('{zodiac}', zodiacLocal) : p.defaultName;
    } else {
        const p = plan as any;
        title = p.title || p.defaultName || "Item";
    }

    const priceStr = plan.price.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(priceStr) || 0;
    
    const handlePaymentSubmit = async () => {
        if (!email) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }
        if (paymentMethod === 'stripe') {
            if (!firstName || !lastName || !cardNumber || !expiry || !cvc) {
                setErrorMsg("Please fill out all Credit Card information fields.");
                return;
            }
        }

        setProcessing(true);
        setErrorMsg('');

        try {
            const response = await fetch('/api/payments/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    email,
                    planId: plan.id,
                    planTitle: title,
                    amount: priceVal,
                    method: paymentMethod === 'stripe' ? 'credit-card' : 'paypal',
                    shippingAddress: shippingAddr || 'Digital / Virtual Insight',
                    cardDetails: paymentMethod === 'stripe' ? {
                        name: `${firstName} ${lastName}`.trim(),
                        cardNumber,
                        expiry,
                        cvc
                    } : null
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                    return;
                }
                setSuccessState(true);
                setTimeout(() => {
                    if (isMounted.current) {
                        onSuccess({
                            email,
                            orderId: data.orderId,
                            method: paymentMethod === 'stripe' ? 'credit-card' : 'paypal'
                        });
                    }
                }, 2000);
            } else {
                setErrorMsg(data.error || "Payment processing failed. Please check inputs.");
            }
        } catch (err: any) {
            setErrorMsg("Unable to process transaction at this moment. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (successState) return <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{...styles.glassPanel, textAlign: 'center', maxWidth: '400px'}}><div style={{color: '#2ecc71', fontSize: '4rem', marginBottom: '15px'}}><i className="fas fa-check-circle"></i></div><h2 style={{color: theme.gold, margin: '0 0 10px 0'}}>{t.success}</h2><p style={{color: '#aaa', fontSize: '0.9rem'}}>Transaction authenticated successfully.</p></div></div>;

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'}}>
          <div style={{...styles.glassPanel, maxWidth: '550px', width: '95%', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${theme.gold}`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{color: theme.gold, margin: 0, fontFamily: 'Cinzel, serif'}}>{t.paymentTitle}</h2>
                <button onClick={onClose} style={{background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.color = theme.gold} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>&times;</button>
            </div>
            
            <div style={{marginBottom: '20px', padding: '15px', border: `1px solid ${theme.darkGold}`, borderRadius: '4px', background: 'rgba(212, 175, 55, 0.08)'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{title}</span>
                     <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: theme.gold}}>${priceVal.toFixed(2)}</span>
                 </div>
            </div>

            {errorMsg && (
                <div style={{marginBottom: '20px', padding: '12px', borderRadius: '4px', background: 'rgba(231, 76, 60, 0.15)', color: '#e74c3c', fontSize: '0.9rem', border: '1px solid #e74c3c'}}>
                    <i className="fas fa-exclamation-circle" style={{marginRight: '8px'}}></i> {errorMsg}
                </div>
            )}
            
            <div style={{marginBottom: '20px'}}>
                <h3 style={{color: theme.gold, fontSize: '0.85rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px'}}>Contact Info</h3>
                <div>
                    <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>
                        Email Address
                    </label>
                    <input type="email" placeholder="you@example.com" style={styles.cardInput} value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <h3 style={{color: theme.gold, fontSize: '0.85rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px'}}>Shipping Address (Optional for Physical Goods)</h3>
                <div>
                    <label style={{display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '5px'}}>
                        Delivery details
                    </label>
                    <input type="text" placeholder="First & Last Name, Country, Full street address, suite, ZIP etc..." style={styles.cardInput} value={shippingAddr} onChange={e => setShippingAddr(e.target.value)} />
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <h3 style={{color: theme.gold, fontSize: '0.85rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px'}}>Payment Method</h3>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                        type="button"
                        onClick={() => setPaymentMethod('stripe')}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${paymentMethod === 'stripe' ? theme.gold : '#333'}`,
                            background: paymentMethod === 'stripe' ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all 0.2s'
                        }}
                    >
                        <i className="fas fa-credit-card" style={{fontSize: '1.6rem', color: theme.gold}}></i>
                        <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: paymentMethod === 'stripe' ? theme.gold : '#888'}}>Credit Card Collection</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${paymentMethod === 'paypal' ? theme.gold : '#333'}`,
                            background: paymentMethod === 'paypal' ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all 0.2s'
                        }}
                    >
                        <i className="fab fa-paypal" style={{fontSize: '1.6rem', color: '#003087'}}></i>
                        <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: paymentMethod === 'paypal' ? theme.gold : '#888'}}>PayPal Gateway</span>
                    </button>
                </div>
            </div>

            {paymentMethod === 'stripe' && (
                <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid #333'}}>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        <div style={{flex: 1}}>
                            <label style={{display: 'block', color: '#aaa', fontSize: '0.7rem', marginBottom: '5px'}}>FIRST NAME</label>
                            <input type="text" placeholder="John" style={styles.cardInput} value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{display: 'block', color: '#aaa', fontSize: '0.7rem', marginBottom: '5px'}}>LAST NAME</label>
                            <input type="text" placeholder="Doe" style={styles.cardInput} value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{display: 'block', color: '#aaa', fontSize: '0.7rem', marginBottom: '5px'}}>CARD NUMBER</label>
                        <input type="text" maxLength={19} placeholder="4111 2222 3333 4444" style={styles.cardInput} value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                    </div>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <div style={{flex: 1}}>
                            <label style={{display: 'block', color: '#aaa', fontSize: '0.7rem', marginBottom: '5px'}}>EXPIRY</label>
                            <input type="text" maxLength={5} placeholder="MM/YY" style={styles.cardInput} value={expiry} onChange={e => setExpiry(e.target.value)} />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{display: 'block', color: '#aaa', fontSize: '0.7rem', marginBottom: '5px'}}>CVC</label>
                            <input type="text" maxLength={4} placeholder="***" style={styles.cardInput} value={cvc} onChange={e => setCvc(e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div style={{marginBottom: '20px', padding: '20px', textAlign: 'center', background: 'rgba(0,48,135,0.06)', borderRadius: '8px', border: '1px solid rgba(0,48,135,0.3)'}}>
                    <i className="fab fa-paypal" style={{fontSize: '3rem', color: '#0070ba', marginBottom: '10px'}}></i>
                    <p style={{fontSize: '0.9rem', color: '#ccc', margin: '0 0 10px 0'}}>Pay securely with your PayPal account or linked bank sources.</p>
                    <p style={{fontSize: '0.75rem', color: '#777', margin: 0}}>Redirecting protocol initiates upon clicking continue.</p>
                </div>
            )}

            <button 
                type="button"
                style={{
                    ...styles.button, 
                    width: '100%', 
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }} 
                onClick={handlePaymentSubmit}
                disabled={processing}
            >
                {processing ? (
                    <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : (
                    paymentMethod === 'paypal' ? 'Continue with PayPal' : 'Pay Safely & Secure Checkout'
                )}
            </button>
            
            <p style={{marginTop: '15px', fontSize: '0.75rem', color: '#666', textAlign: 'center', margin: '15px 0 0 0'}}>
                <i className="fas fa-lock" style={{marginRight: '5px'}}></i> 256-bit SSL secured transaction processing container environment.
            </p>
          </div>
        </div>
    );
};
