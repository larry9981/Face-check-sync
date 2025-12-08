
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Product } from '../types';
import { SHOP_PRODUCTS } from '../products';
import { ImagePersistence } from '../utils';

// Sub-component for individual product cards to handle async image loading
const ProductCard = ({ product, t, onViewProduct }: { product: Product, t: any, onViewProduct: (p: Product) => void }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        // Use ImagePersistence to get cached blob or fetch new
        ImagePersistence.loadImage(product.id, product.imagePrompt, 512)
            .then(url => {
                if (isMounted) {
                    setImageUrl(url);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [product.id, product.imagePrompt]);

    return (
        <div style={{...styles.glassPanel, maxWidth: '250px', padding: '0', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(212, 175, 55, 0.3)'}} onClick={() => onViewProduct(product)}>
            <div style={{width: '100%', height: '250px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                {loading || !imageUrl ? (
                     <div style={{color: theme.darkGold}}>
                         <i className="fas fa-circle-notch fa-spin" style={{fontSize: '2rem'}}></i>
                     </div>
                ) : (
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                    />
                )}
            </div>
            <div style={{padding: '1.5rem', textAlign: 'center'}}>
                <h3 style={{fontSize: '1.1rem', color: theme.gold, marginBottom: '0.5rem', fontFamily: 'Cinzel, serif', height: '1.5em', overflow: 'hidden'}}>{name}</h3>
                <p style={{color: '#fff', fontWeight: 'bold'}}>{product.price}</p>
            </div>
        </div>
    );
};

export const ShopPage = ({ t, onViewProduct }: { t: any, onViewProduct: (p: Product) => void }) => {
    const [activeCategory, setActiveCategory] = useState<'chinese' | 'western'>('chinese');
    const filteredProducts = SHOP_PRODUCTS.filter(p => {
        if (activeCategory === 'chinese') return p.category === 'bracelet' || p.category === 'pendant';
        if (activeCategory === 'western') return p.category === 'amulet';
        return true;
    });

    return (
        <div style={{maxWidth: '1200px', width: '95%', paddingBottom: '3rem'}}>
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '1rem'}}>{t.shopTitle}</h2>
                <p style={{color: '#ccc', fontStyle: 'italic'}}>{t.shopDesc}</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap'}}>
                <button onClick={() => setActiveCategory('chinese')} style={{background: activeCategory === 'chinese' ? theme.gold : 'transparent', color: activeCategory === 'chinese' ? '#000' : theme.gold, border: `1px solid ${theme.gold}`, padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold'}}>{t.shopCategoryChinese}</button>
                <button onClick={() => setActiveCategory('western')} style={{background: activeCategory === 'western' ? theme.gold : 'transparent', color: activeCategory === 'western' ? '#000' : theme.gold, border: `1px solid ${theme.gold}`, padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold'}}>{t.shopCategoryWestern}</button>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
                {filteredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} t={t} onViewProduct={onViewProduct} />
                ))}
            </div>
        </div>
    );
};
