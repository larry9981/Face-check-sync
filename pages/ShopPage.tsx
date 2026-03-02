
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Product } from '../types';
import { SHOP_PRODUCTS } from '../products';
import { ImagePersistence } from '../utils';

// Sub-component for individual product cards to handle async image loading
const ProductCard: React.FC<{ product: Product, t: any, onViewProduct: (p: Product) => void }> = ({ product, t, onViewProduct }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const zodiacLocal = t[`zodiac${product.zodiac}`] || t[`star${product.zodiac}`] || product.zodiac;
    const name = t[product.nameKey] ? t[product.nameKey].replace('{zodiac}', zodiacLocal) : product.defaultName;

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        if (product.imageUrl) {
            setImageUrl(product.imageUrl);
            setLoading(false);
            return;
        }

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
    const [activeCategory, setActiveCategory] = useState<'chinese' | 'western' | 'all'>('chinese');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data);
                } else {
                    // Fallback to static products if backend empty
                    setProducts(SHOP_PRODUCTS);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setProducts(SHOP_PRODUCTS);
                setLoading(false);
            });
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
