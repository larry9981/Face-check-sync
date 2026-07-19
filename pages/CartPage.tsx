
import React from 'react';
import { theme, styles } from '../theme';
import { CartItem } from '../types';
import { handleImageError } from '../utils';

interface CartPageProps {
    t: any;
    cart: CartItem[];
    onRemove: (productId: string) => void;
    onCheckout: (total: number) => void;
}

export const CartPage = ({ t, cart, onRemove, onCheckout }: CartPageProps) => {
    const total = cart.reduce((sum, item) => sum + (item.product.numericPrice * item.quantity), 0);

    return (
        <div style={{maxWidth: '1200px', width: '95%', paddingBottom: '3rem'}}>
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                <h2 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '2.5rem', marginBottom: '1rem'}}>{t.cartTitle}</h2>
            </div>

            {cart.length === 0 ? (
                <div style={{textAlign: 'center', color: '#888', fontSize: '1.2rem', padding: '3rem'}}>
                    <i className="fas fa-shopping-basket" style={{fontSize: '3rem', marginBottom: '1rem', display: 'block'}}></i>
                    {t.cartEmpty}
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {cart.map((item) => {
                        const prod = item.product;
                        const zodiacLocal = t[`zodiac${prod.zodiac}`] || t[`star${prod.zodiac}`] || prod.zodiac;
                        const name = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacLocal) : prod.defaultName;
                        // Use seed for consistency
                        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=150&height=150&nologo=true&seed=${prod.id}`;

                        return (
                            <div key={prod.id} style={{
                                ...styles.glassPanel, 
                                padding: '15px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '15px'
                            }}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px', flex: '1 1 300px'}}>
                                    <img src={imageUrl} alt={name} style={{width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover'}} referrerPolicy="no-referrer" onError={(e) => handleImageError(e, prod.id)} />
                                    <div>
                                        <h3 style={{color: theme.gold, fontSize: '1.1rem', margin: '0 0 5px 0', fontFamily: '"Space Grotesk", sans-serif'}}>{name}</h3>
                                        <div style={{color: '#ccc', fontSize: '0.9rem'}}>{prod.price}</div>
                                    </div>
                                </div>
                                
                                <div style={{display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end', flex: '1 1 150px'}}>
                                    <div style={{color: '#aaa', fontSize: '0.9rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        {t.quantity}: <span style={{color: '#fff', fontWeight: 'bold'}}>{item.quantity}</span>
                                    </div>
                                    <button 
                                        onClick={() => onRemove(prod.id)} 
                                        style={{
                                            background: 'transparent', 
                                            border: '1px solid #ff4a4a', 
                                            color: '#ff4a4a', 
                                            padding: '5px 10px', 
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontFamily: '"Space Grotesk", sans-serif'
                                        }}
                                    >
                                        <i className="fas fa-trash"></i> {t.remove}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div style={{
                        marginTop: '20px', 
                        padding: '20px', 
                        borderTop: `1px solid rgba(102, 192, 244, 0.15)`, 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{fontSize: '1.5rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                            <span style={{color: '#aaa'}}>{t.total}: </span>
                            <span style={{color: theme.gold, fontWeight: 'bold'}}>${total.toFixed(2)}</span>
                        </div>
                        <button 
                            style={{...styles.button, width: 'auto', marginTop: 0}} 
                            onClick={() => onCheckout(total)}
                        >
                            {t.checkout}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
