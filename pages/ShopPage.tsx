
import React, { useState } from 'react';
import { theme, styles } from '../theme';
import { Product } from '../types';
import { SHOP_PRODUCTS } from '../products';

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
                {filteredProducts.map((prod) => {
                   const zodiacLocal = t[`zodiac${prod.zodiac}`] || t[`star${prod.zodiac}`] || prod.zodiac;
                   const name = t[prod.nameKey] ? t[prod.nameKey].replace('{zodiac}', zodiacLocal) : prod.defaultName;
                   const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prod.imagePrompt)}?width=400&height=400&nologo=true`;
                   return (
                       <div key={prod.id} style={{...styles.glassPanel, maxWidth: '250px', padding: '0', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(212, 175, 55, 0.3)'}} onClick={() => onViewProduct(prod)}>
                           <div style={{width: '100%', height: '250px', background: '#000'}}><img src={imageUrl} alt={name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                           <div style={{padding: '1.5rem', textAlign: 'center'}}><h3 style={{fontSize: '1.1rem', color: theme.gold, marginBottom: '0.5rem', fontFamily: 'Cinzel, serif'}}>{name}</h3><p style={{color: '#fff', fontWeight: 'bold'}}>{prod.price}</p></div>
                       </div>
                   );
                })}
            </div>
        </div>
    );
};
