
import React, { useState } from 'react';
import { theme, styles } from '../theme';
import { Product, Plan } from '../types';
import { PayPalButton, StripePaymentForm, QRCodePayment } from './PaymentIntegration';
import { SHOP_PRODUCTS } from '../products';

export const FiveElementsBalanceModal = ({ t, missingElement, onClose, onBuyProduct }: { t: any, missingElement: string, onClose: () => void, onBuyProduct: (p: Product) => void }) => {
    const elKey = missingElement || 'Metal';
    
    // Dynamic Advice from Translations
    const colorAdvice = t[`advice${elKey}Color`] || "Gold, White";
    const dirAdvice = t[`advice${elKey}Direction`] || "West";
    const habitAdvice = t[`advice${elKey}Habit`] || "Organization";
    const descAdvice = t[`advice${elKey}Desc`] || "Your element needs balance.";
    const nameAdvice = t[`advice${elKey}Name`] || "Consult a master for name changes.";
    const philosophyAdvice = t[`advice${elKey}Philosophy`] || "Balance is key.";

    const matchingProducts = SHOP_PRODUCTS.filter(p => p.element === missingElement).slice(0, 4);

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'}}>
            <div style={{...styles.glassPanel, maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '10px'}}>
                    <h2 style={{color: theme.gold, margin: 0, fontFamily: 'Cinzel, serif'}}>{t.balanceTitle}</h2>
                    <button onClick={onClose} style={{background: 'transparent', border: 'none', color: '#888', fontSize: '2rem', cursor: 'pointer'}}>&times;</button>
                </div>
                
                <div style={{marginBottom: '30px'}}>
                    <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '10px'}}>
                        {t.yourWeakest}: <span style={{color: theme.gold, fontSize: '1.5rem'}}>{t[`element${elKey}`]}</span>
                    </h3>
                    <p style={{color: '#ccc', lineHeight: '1.6'}}>{descAdvice}</p>
                    
                    <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold, display:'block', marginBottom:'5px'}}>{t.luckyColors}</strong>
                            {colorAdvice}
                        </div>
                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold, display:'block', marginBottom:'5px'}}>{t.luckyDirection}</strong>
                            {dirAdvice}
                        </div>
                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold, display:'block', marginBottom:'5px'}}>{t.luckyHabit}</strong>
                            {habitAdvice}
                        </div>
                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '4px'}}>
                            <strong style={{color: theme.gold, display:'block', marginBottom:'5px'}}>{t.namingAdvice}</strong>
                            {nameAdvice}
                        </div>
                    </div>
                    
                    <div style={{marginTop: '20px', background: 'rgba(212, 175, 55, 0.1)', padding: '15px', borderRadius: '4px', borderLeft: `3px solid ${theme.gold}`}}>
                        <strong style={{color: theme.gold, display:'block', marginBottom:'5px'}}>{t.philosophy}</strong>
                        <em style={{color: '#e0e0e0'}}>"{philosophyAdvice}"</em>
                    </div>
                </div>

                <h3 style={{color: theme.gold, borderTop: `1px solid ${theme.darkGold}`, paddingTop: '20px', marginTop: '20px'}}>{t.recommendedCures}</h3>
                <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                    {matchingProducts.map(prod => {
                        const zodiacLocal = t[`zodiac${prod.zodiac}`] || t[`star${prod.zodiac}`] || prod.zodiac;
                        const name = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacLocal) : prod.defaultName;
                        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=150&height=150&nologo=true`;
                        return (
                            <div key={prod.id} style={{minWidth: '140px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
                                <img src={imgUrl} style={{width: '100px', height: '100px', borderRadius: '4px'}} />
                                <div style={{fontSize: '0.8rem', color: theme.gold, margin: '5px 0', height: '35px', overflow: 'hidden'}}>{name}</div>
                                <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{prod.price}</div>
                                <button style={{...styles.button, padding: '5px 10px', fontSize: '0.7rem', marginTop: '5px', minWidth: 'auto'}} onClick={() => onBuyProduct(prod)}>{t.buyNow}</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const ProductDetailModal = ({ t, product, onClose, onAddToCart, onBuyNow }: { t: any, product: Product, onClose: () => void, onAddToCart: () => void, onBuyNow: () => void }) => {
    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;
    const desc = t[product.descKey] ? t[product.descKey].replace('{zodiac}', zodiacLocal) : "Mystical Item";
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(product.imagePrompt)}?width=600&height=600&nologo=true`;
    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'}}>
            <div style={{...styles.glassPanel, maxWidth: '900px', display: 'flex', flexDirection: 'row', gap: '30px', padding: '30px', maxHeight: '90vh', overflowY: 'auto'}} className="product-modal-mobile">
                <button onClick={onClose} style={{position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', zIndex: 10}}>&times;</button>
                <div style={{flex: 1, minWidth: '300px'}}><img src={imageUrl} style={{width: '100%', borderRadius: '8px', border: `1px solid ${theme.gold}`}} /></div>
                <div style={{flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '2rem', marginBottom: '10px'}}>{name}</h2>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px'}}>{product.price}</div>
                    <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', marginBottom: '30px', lineHeight: '1.6', color: '#ccc'}}><p>{desc}</p></div>
                    <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                        <button style={{...styles.button, marginTop: 0, flex: 1}} onClick={onBuyNow}>{t.buyNow}</button>
                        <button style={{...styles.secondaryButton, marginTop: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} onClick={onAddToCart}><i className="fas fa-shopping-cart"></i> {t.addToCart}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PaymentModal = ({ t, plan, onClose, onSuccess }: { t: any, plan: Plan | Product, onClose: () => void, onSuccess: () => void }) => {
    // Detect if we should offer Chinese Payment Methods
    // Simple heuristic: If language is Chinese, default to WeChat/Alipay, or show them
    const isChinese = t.title === "玄机面相" || t.title === "玄機面相";

    const [method, setMethod] = useState<'card' | 'paypal' | 'wechat' | 'alipay'>(isChinese ? 'wechat' : 'card');
    const [successState, setSuccessState] = useState(false);
    
    // Shipping Address State
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');

    const title = 'defaultName' in plan ? (plan as Product).defaultName : (plan as Plan).title;
    const priceStr = plan.price.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(priceStr);
    
    // Physical products from Shop need shipping
    const isPhysicalProduct = 'category' in plan;
    const needsShipping = isPhysicalProduct;
    // For non-physical products (subscriptions/readings), we proceed without address
    const canProceedToPay = !needsShipping || (name && address && city && zip && country);

    const handleSuccess = (details?: any) => {
        setSuccessState(true);
        setTimeout(() => onSuccess(), 2000);
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

            {/* Shipping Form (Only for Physical) */}
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

            {/* Payment Method Toggle */}
            <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '10px', color: '#aaa'}}>{t.paymentMethod}</label>
                <div style={{display: 'grid', gridTemplateColumns: isChinese ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: '8px'}}>
                    
                    {/* Chinese Methods */}
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

                    {/* Global Methods */}
                    <button style={{padding: '10px', background: method === 'card' ? theme.darkGold : 'transparent', border: `1px solid ${theme.darkGold}`, color: method === 'card' ? '#000' : theme.darkGold, fontSize: '0.8rem', whiteSpace: 'nowrap'}} onClick={() => setMethod('card')}>
                        <i className="fas fa-credit-card"></i> Card
                    </button>
                    <button style={{padding: '10px', background: method === 'paypal' ? '#0070ba' : 'transparent', border: `1px solid ${method === 'paypal' ? '#0070ba' : theme.darkGold}`, color: method === 'paypal' ? '#fff' : theme.darkGold, fontSize: '0.8rem'}} onClick={() => setMethod('paypal')}>
                        <i className="fab fa-paypal"></i> PayPal
                    </button>
                </div>
            </div>

            {/* Payment Integration Rendering */}
            {canProceedToPay ? (
                <>
                    {method === 'card' && <StripePaymentForm amount={priceVal} description={title} currency="USD" t={t} onSuccess={handleSuccess} onError={handleError} />}
                    {method === 'paypal' && <PayPalButton amount={priceVal} description={title} currency="USD" t={t} onSuccess={handleSuccess} onError={handleError} />}
                    {(method === 'wechat' || method === 'alipay') && <QRCodePayment provider={method} amount={priceVal} t={t} onSuccess={handleSuccess} />}
                </>
            ) : (
                <div style={{padding: '10px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: '#ffaaaa', fontSize: '0.9rem', textAlign: 'center'}}>
                    Please complete shipping details to proceed.
                </div>
            )}
          </div>
        </div>
    );
};
