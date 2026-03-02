
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Order, Product } from '../types';

export const AdminPage = ({ t }: { t: any }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    
    // Product Form State
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const API_BASE_URL = "/api"; 

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'orders') {
                fetch(`${API_BASE_URL}/admin/orders`)
                    .then(res => res.json())
                    .then(data => { if (Array.isArray(data)) setOrders(data); })
                    .catch(err => {
                        console.error("Failed to fetch orders:", err);
                        const stored = localStorage.getItem('mystic_all_orders');
                        if (stored) setOrders(JSON.parse(stored));
                    });
            } else {
                fetch(`${API_BASE_URL}/products`)
                    .then(res => res.json())
                    .then(data => { if (Array.isArray(data)) setProducts(data); })
                    .catch(err => console.error("Failed to fetch products:", err));
            }
        }
    }, [isAuthenticated, activeTab]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded credentials for demo
        if (username === 'admin' && password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        window.location.href = '/'; 
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct)
            });
            if (res.ok) {
                const updated = await res.json();
                setProducts(prev => {
                    const idx = prev.findIndex(p => p.id === updated.id);
                    if (idx >= 0) {
                        const newArr = [...prev];
                        newArr[idx] = updated;
                        return newArr;
                    }
                    return [updated, ...prev];
                });
                setEditingProduct(null);
            }
        } catch (err) {
            console.error("Save product failed:", err);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error("Delete product failed:", err);
        }
    };

    const downloadCSV = () => {
        if (orders.length === 0) {
            alert(t.noOrders);
            return;
        }

        // CSV Header
        const headers = [
            t.orderId, t.date, t.customer, t.items, t.amount, t.status, t.address, "Email", "Phone", "Payment Method"
        ];

        // CSV Rows
        const rows = orders.map(order => [
            `"${order.id}"`,
            `"${order.date}"`,
            `"${order.customerName}"`,
            `"${order.items.replace(/"/g, '""')}"`, // Escape quotes
            order.total.toFixed(2),
            `"${order.status}"`,
            `"${order.shippingAddress.replace(/"/g, '""')}"`,
            `"${order.email || ''}"`,
            `"${order.phone || ''}"`,
            `"${order.paymentMethod || ''}"`
        ]);

        // Combine (add BOM for Excel/WPS Chinese characters support)
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isAuthenticated) {
        return (
            <div style={{...styles.glassPanel, maxWidth: '400px', margin: '50px auto'}}>
                <h2 style={{color: theme.gold, textAlign: 'center', fontFamily: 'Cinzel, serif'}}>{t.adminLogin}</h2>
                <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <input 
                        type="text" 
                        placeholder={t.username} 
                        style={styles.formInput} 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder={t.password} 
                        style={styles.formInput} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <button type="submit" style={styles.button}>{t.login}</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{width: '95%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: `1px solid ${theme.darkGold}`, paddingBottom: '1rem', flexWrap: 'wrap', gap: '10px'}}>
                <h2 style={{color: theme.gold, fontFamily: 'Cinzel, serif', margin: 0}}>{t.adminDashboard}</h2>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button 
                        onClick={() => setActiveTab('orders')} 
                        style={{...styles.secondaryButton, background: activeTab === 'orders' ? theme.gold : 'transparent', color: activeTab === 'orders' ? '#000' : theme.gold, marginTop: 0}}
                    >
                        {t.historyTitle}
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')} 
                        style={{...styles.secondaryButton, background: activeTab === 'products' ? theme.gold : 'transparent', color: activeTab === 'products' ? '#000' : theme.gold, marginTop: 0}}
                    >
                        {t.productManagement}
                    </button>
                    <button onClick={handleLogout} style={{...styles.secondaryButton, marginTop: 0}}>Logout</button>
                </div>
            </div>

            {activeTab === 'orders' ? (
                <>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                        <button onClick={downloadCSV} style={{...styles.button, marginTop: 0, padding: '8px 15px', fontSize: '0.9rem', minWidth: 'auto'}}>
                            <i className="fas fa-file-excel" style={{marginRight: '8px'}}></i> {t.exportBtn || "Export CSV"}
                        </button>
                    </div>
                    <div style={{...styles.glassPanel, padding: '0', overflow: 'hidden', width: '100%', maxWidth: '100%'}}>
                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0', minWidth: '1000px'}}>
                                <thead>
                                    <tr style={{background: 'rgba(212, 175, 55, 0.2)', borderBottom: `1px solid ${theme.darkGold}`}}>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>{t.orderId}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>{t.date}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>{t.customer}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>{t.items}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>{t.amount}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>{t.status}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{padding: '30px', textAlign: 'center', color: '#888'}}>{t.noOrders}</td>
                                        </tr>
                                    ) : (
                                        orders.map((order, index) => (
                                            <tr key={index} style={{borderBottom: '1px solid rgba(255,255,255,0.1)', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)'}}>
                                                <td style={{padding: '12px 15px', fontSize: '0.9rem', fontFamily: 'monospace'}}>{order.id}</td>
                                                <td style={{padding: '12px 15px', fontSize: '0.9rem'}}>{order.date}</td>
                                                <td style={{padding: '12px 15px'}}>{order.customerName}</td>
                                                <td style={{padding: '12px 15px', fontSize: '0.9rem'}}>{order.items}</td>
                                                <td style={{padding: '12px 15px', fontWeight: 'bold', color: theme.gold}}>${order.total.toFixed(2)}</td>
                                                <td style={{padding: '12px 15px'}}>
                                                    <span style={{
                                                        background: order.status === 'paid' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                                                        color: order.status === 'paid' ? '#2ecc71' : '#e74c3c',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{padding: '12px 15px', fontSize: '0.8rem'}}>
                                                    <div>{order.email}</div>
                                                    <div>{order.phone}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px'}} className="responsive-grid">
                    <div style={styles.glassPanel}>
                        <h3 style={{color: theme.gold, fontFamily: 'Cinzel, serif'}}>{editingProduct?.id ? t.editProduct : t.addProduct}</h3>
                        <form onSubmit={handleSaveProduct} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <input 
                                type="text" placeholder="Product ID (Auto if empty)" style={styles.formInput} 
                                value={editingProduct?.id || ''} onChange={e => setEditingProduct({...editingProduct, id: e.target.value})} 
                            />
                            <input 
                                type="text" placeholder="Default Name" style={styles.formInput} 
                                value={editingProduct?.defaultName || ''} onChange={e => setEditingProduct({...editingProduct, defaultName: e.target.value})} 
                            />
                            <input 
                                type="text" placeholder={t.productPrice} style={styles.formInput} 
                                value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} 
                            />
                            <input 
                                type="number" placeholder="Numeric Price" style={styles.formInput} 
                                value={editingProduct?.numericPrice || 0} onChange={e => setEditingProduct({...editingProduct, numericPrice: parseFloat(e.target.value)})} 
                            />
                            <select 
                                style={styles.formInput} value={editingProduct?.category || 'bracelet'} 
                                onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}
                            >
                                <option value="bracelet">Bracelet</option>
                                <option value="pendant">Pendant</option>
                                <option value="amulet">Amulet</option>
                                <option value="other">Other</option>
                            </select>
                            <input 
                                type="text" placeholder={t.productZodiac} style={styles.formInput} 
                                value={editingProduct?.zodiac || ''} onChange={e => setEditingProduct({...editingProduct, zodiac: e.target.value})} 
                            />
                            <input 
                                type="text" placeholder={t.productElement} style={styles.formInput} 
                                value={editingProduct?.element || ''} onChange={e => setEditingProduct({...editingProduct, element: e.target.value})} 
                            />
                            <input 
                                type="text" placeholder={t.productImage} style={styles.formInput} 
                                value={editingProduct?.imageUrl || ''} onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})} 
                            />
                            <textarea 
                                placeholder={t.productDesc} style={{...styles.formInput, height: '100px'}} 
                                value={editingProduct?.defaultDescription || ''} onChange={e => setEditingProduct({...editingProduct, defaultDescription: e.target.value})} 
                            />
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" style={{...styles.button, flex: 1}}>Save</button>
                                <button type="button" onClick={() => setEditingProduct(null)} style={{...styles.secondaryButton, flex: 1}}>Clear</button>
                            </div>
                        </form>
                    </div>
                    <div style={{...styles.glassPanel, padding: '0', overflow: 'hidden'}}>
                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0'}}>
                                <thead>
                                    <tr style={{background: 'rgba(212, 175, 55, 0.2)', borderBottom: `1px solid ${theme.darkGold}`}}>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>Image</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>Name</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>Price</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.gold}}>Category</th>
                                        <th style={{padding: '15px', textAlign: 'right', color: theme.gold}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id} style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                                            <td style={{padding: '10px 15px'}}>
                                                <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/50/50`} style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} />
                                            </td>
                                            <td style={{padding: '10px 15px'}}>{p.defaultName}</td>
                                            <td style={{padding: '10px 15px', color: theme.gold}}>{p.price}</td>
                                            <td style={{padding: '10px 15px', textTransform: 'capitalize'}}>{p.category}</td>
                                            <td style={{padding: '10px 15px', textAlign: 'right'}}>
                                                <button onClick={() => setEditingProduct(p)} style={{background: 'none', border: 'none', color: theme.gold, cursor: 'pointer', marginRight: '10px'}}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteProduct(p.id)} style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer'}}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @media (max-width: 900px) {
                    .responsive-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};
