
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
        <div style={{...styles.glassPanel, maxWidth: '250px', padding: '0', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(102, 192, 244, 0.22)', borderRadius: '12px'}} onClick={() => onViewProduct(product)}>
            <div style={{width: '100%', height: '250px', background: '#121E2A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                <CachedImage 
                    productId={product.id} 
                    prompt={product.imagePrompt} 
                    imageUrl={product.imageUrl}
                    size={512}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                />
            </div>
            <div style={{padding: '1.5rem', textAlign: 'center'}}>
                <h3 style={{fontSize: '1.1rem', color: theme.gold, marginBottom: '0.5rem', fontFamily: '"Space Grotesk", sans-serif', height: '1.5em', overflow: 'hidden'}}>{name}</h3>
                <p style={{color: '#fff', fontWeight: 'bold'}}>{product.price}</p>
            </div>
        </div>
    );
};

export const ShopPage = ({ t, onViewProduct }: { t: any, onViewProduct: (p: Product) => void }) => {
    const [activeCategory, setActiveCategory] = useState<'chinese' | 'western' | 'all'>('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            if (!isMounted) return;
            controller.abort();
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
                if (!isMounted) return;
                clearTimeout(timeoutId);
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(SHOP_PRODUCTS);
                }
                setLoading(false);
            })
            .catch(err => {
                if (!isMounted) return;
                clearTimeout(timeoutId);
                if (err.name === 'AbortError' || controller.signal.aborted) return; 
                console.error("Failed to fetch products:", err);
                setProducts(SHOP_PRODUCTS);
                setLoading(false);
            });
            
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    const filteredProducts = products.filter(p => {
        if (p.status === 'inactive') return false;
        if (activeCategory === 'all') return true;
        if (activeCategory === 'chinese') {
            return ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'].includes(p.zodiac);
        }
        if (activeCategory === 'western') {
            return ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"].includes(p.zodiac);
        }
        return true;
    });

    return (
        <div style={{maxWidth: '1200px', width: '95%', paddingBottom: '3rem'}}>
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                <h2 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '2.5rem', marginBottom: '1rem'}}>{t.shopTitle}</h2>
                <p style={{color: '#ccc', fontStyle: 'italic'}}>{t.shopDesc}</p>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap'}}>
                <button 
                    onClick={() => setActiveCategory('all')} 
                    style={{
                        background: activeCategory === 'all' ? `linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)` : 'rgba(23, 38, 54, 0.5)', 
                        color: '#ffffff', 
                        border: activeCategory === 'all' ? '1px solid #fff' : '1px solid rgba(102, 192, 244, 0.25)', 
                        padding: '10px 24px', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontFamily: '"Space Grotesk", sans-serif', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        boxShadow: activeCategory === 'all' ? '0 0 15px rgba(102, 192, 244, 0.35)' : 'none'
                    }}
                >
                    {t.moreProducts}
                </button>
                <button 
                    onClick={() => setActiveCategory('western')} 
                    style={{
                        background: activeCategory === 'western' ? `linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)` : 'rgba(23, 38, 54, 0.5)', 
                        color: '#ffffff', 
                        border: activeCategory === 'western' ? '1px solid #fff' : '1px solid rgba(102, 192, 244, 0.25)', 
                        padding: '10px 24px', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontFamily: '"Space Grotesk", sans-serif', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        boxShadow: activeCategory === 'western' ? '0 0 15px rgba(102, 192, 244, 0.35)' : 'none'
                    }}
                >
                    {t.shopCategoryWestern}
                </button>
                <button 
                    onClick={() => setActiveCategory('chinese')} 
                    style={{
                        background: activeCategory === 'chinese' ? `linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)` : 'rgba(23, 38, 54, 0.5)', 
                        color: '#ffffff', 
                        border: activeCategory === 'chinese' ? '1px solid #fff' : '1px solid rgba(102, 192, 244, 0.25)', 
                        padding: '10px 24px', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontFamily: '"Space Grotesk", sans-serif', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        boxShadow: activeCategory === 'chinese' ? '0 0 15px rgba(102, 192, 244, 0.35)' : 'none'
                    }}
                >
                    {t.shopCategoryChinese}
                </button>
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
