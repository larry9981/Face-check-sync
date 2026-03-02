
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Product } from '../types';
import { SHOP_PRODUCTS } from '../products';
import { ImagePersistence } from '../utils';
import { CachedImage } from '../components/Modals';

// Sub-component for individual product cards to handle async image loading
const ProductCard: React.FC<{ product: Product, t: any, onViewProduct: (p: Product) => void }> = ({ product, t, onViewProduct }) => {
    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;

    return (
        <div style={{...styles.glassPanel, maxWidth: '250px', padding: '0', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(212, 175, 55, 0.3)'}} onClick={() => onViewProduct(product)}>
            <div style={{width: '100%', height: '250px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                <CachedImage 
                    productId={product.id} 
                    prompt={product.imagePrompt} 
                    imageUrl={product.imageUrl}
                    size={512}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                />
            </div>
            <div style={{padding: '1.5rem', textAlign: 'center'}}>
                <h3 style={{fontSize: '1.1rem', color: theme.gold, marginBottom: '0.5rem', fontFamily: 'Cinzel, serif', height: '1.5em', overflow: 'hidden'}}>{name}</h3>
                <p style={{color: '#fff', fontWeight: 'bold'}}>{product.price}</p>
            </div>
        </div>
    );
};

export const ShopPage = ({ t, onViewProduct }: { t: any, onViewProduct: (p: Product) => void }) => {
    const [activeCategory, setActiveCategory] = useState<'chinese' | 'western' | 'all'>('chinese');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort("timeout");
            console.warn("Shop fetch timed out, falling back to static products");
            setProducts(SHOP_PRODUCTS);
            setLoading(false);
        }, 8000); // 8s timeout

        fetch('/api/products', { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                clearTimeout(timeoutId);
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(SHOP_PRODUCTS);
                }
                setLoading(false);
            })
            .catch(err => {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError' || controller.signal.aborted) return; 
                console.error("Failed to fetch products:", err);
                setProducts(SHOP_PRODUCTS);
                setLoading(false);
            });
            
        return () => {
            clearTimeout(timeoutId);
            controller.abort("unmount");
        };
    }, []);

    const filteredProducts = products.filter(p => {
        if (activeCategory === 'all') return true;
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
                <button onClick={() => setActiveCategory('all')} style={{background: activeCategory === 'all' ? theme.gold : 'transparent', color: activeCategory === 'all' ? '#000' : theme.gold, border: `1px solid ${theme.gold}`, padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Cinzel, serif', fontWeight: 'bold'}}>{t.moreProducts}</button>
            </div>
            {loading ? (
                <div style={{textAlign: 'center', padding: '50px', color: theme.gold}}>
                    <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem'}}></i>
                </div>
            ) : (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
                    {filteredProducts.map((prod) => (
                        <ProductCard key={prod.id} product={prod} t={t} onViewProduct={onViewProduct} />
                    ))}
                </div>
            )}
        </div>
    );
};
