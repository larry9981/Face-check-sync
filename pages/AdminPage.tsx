import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Order, Product } from '../types';

export const AdminPage = ({ t }: { t: any }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [homepageConfigs, setHomepageConfigs] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);
    
    const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'products' | 'homepage' | 'articles' | 'settings' | 'payments' | 'ai' | 'security'>('orders');
    
    // Security tab states
    const [securityStatus, setSecurityStatus] = useState<any>(null);
    const [isLoadingSecurity, setIsLoadingSecurity] = useState(false);
    
    // Article management states
    const [editingArticle, setEditingArticle] = useState<any | null>(null);
    const [isGeneratingArticleContent, setIsGeneratingArticleContent] = useState(false);
    const [isGeneratingArticleImage, setIsGeneratingArticleImage] = useState(false);
    const [aiTopicInput, setAiTopicInput] = useState('');
    const [articleSearchQuery, setArticleSearchQuery] = useState('');
    const [articleFilterCat, setArticleFilterCat] = useState('ALL');
    
    // Config and pixels states
    const [settings, setSettings] = useState<any>({
        googlePixelId: '',
        facebookPixelId: '',
        paypalClientId: '',
        paypalClientSecret: '',
        paypalEnabled: true,
        stripePublicKey: '',
        stripeSecretKey: '',
        stripeEnabled: true,
        airwallexClientId: '',
        airwallexApiKey: '',
        airwallexClientKey: '',
        airwallexEnabled: false,
        airwallexMode: 'sandbox',
        creditCardProcessor: 'stripe',
        textProvider: 'Google',
        googleKey: '',
        openaiKey: '',
        deepseekKey: '',
        imageProvider: 'Pollinations'
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsStatus, setSettingsStatus] = useState('');

    // Secondary Verification states
    const [isSecondarilyVerified, setIsSecondarilyVerified] = useState(false);
    const [secUsername, setSecUsername] = useState('');
    const [secPassword, setSecPassword] = useState('');
    const [secError, setSecError] = useState('');

    const handleSecondaryVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (secUsername === 'jqqbest@gmail.com' && secPassword === 'larry520520') {
            setIsSecondarilyVerified(true);
            setSecUsername('');
            setSecPassword('');
            setSecError('');
        } else {
            setSecError('验证失败：账户名或密码错误 (Invalid credentials)');
        }
    };

    const renderSecondaryVerification = (sectionName: string) => {
        return (
            <div style={{...styles.glassPanel, maxWidth: '450px', margin: '40px auto', padding: '35px', borderColor: 'rgba(212, 175, 55, 0.4)', boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)'}}>
                <div style={{textAlign: 'center', marginBottom: '25px'}}>
                    <div style={{fontSize: '2.5rem', color: '#d4af37', marginBottom: '10px'}}>
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3 style={{color: '#d4af37', fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', margin: '0 0 8px 0', textShadow: '0 0 8px rgba(212, 175, 55, 0.3)'}}>
                        二次安全验证 (Security Verification)
                    </h3>
                    <p style={{color: '#aaa', fontSize: '0.8rem', margin: 0, fontFamily: '"Space Grotesk", sans-serif', lineHeight: '1.4'}}>
                        进入敏感设置 ({sectionName}) 需要验证管理员权限。<br />
                        Please enter admin credentials to access this section.
                    </p>
                </div>
                <form onSubmit={handleSecondaryVerify} style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
                    <div>
                        <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '6px', fontFamily: '"Space Grotesk", sans-serif'}}>
                            管理员邮箱 (Admin Email)
                        </label>
                        <input 
                            type="text" 
                            style={{...styles.formInput, borderColor: 'rgba(102, 192, 244, 0.2)', fontFamily: '"Space Grotesk", sans-serif'}} 
                            placeholder="admin@example.com" 
                            value={secUsername} 
                            onChange={e => {
                                setSecUsername(e.target.value);
                                setSecError('');
                            }} 
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '6px', fontFamily: '"Space Grotesk", sans-serif'}}>
                            验证密码 (Security Password)
                        </label>
                        <input 
                            type="password" 
                            style={{...styles.formInput, borderColor: 'rgba(102, 192, 244, 0.2)', fontFamily: '"Space Grotesk", sans-serif'}} 
                            placeholder="••••••••" 
                            value={secPassword} 
                            onChange={e => {
                                setSecPassword(e.target.value);
                                setSecError('');
                            }} 
                        />
                    </div>

                    {secError && (
                        <div style={{color: '#ff4d4d', fontSize: '0.8rem', textAlign: 'center', background: 'rgba(255, 77, 77, 0.1)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255, 77, 77, 0.2)'}}>
                            <i className="fas fa-exclamation-circle" style={{marginRight: '6px'}}></i> {secError}
                        </div>
                    )}

                    <button type="submit" style={{...styles.button, background: 'linear-gradient(90deg, #d4af37 0%, #aa8412 100%)', borderColor: '#d4af37', textShadow: '0 1px 2px rgba(0,0,0,0.5)', width: '100%', cursor: 'pointer', fontFamily: '"Space Grotesk", sans-serif'}}>
                        确认验证 (Verify Credentials)
                    </button>
                </form>
            </div>
        );
    };

    // Product & Homepage form states
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [editingConfig, setEditingConfig] = useState<any | null>(null);

    // AI Generation spinners
    const [isGeneratingProdDesc, setIsGeneratingProdDesc] = useState(false);
    const [isGeneratingProdLongDesc, setIsGeneratingProdLongDesc] = useState(false);
    const [isGeneratingHomeDesc, setIsGeneratingHomeDesc] = useState(false);

    const API_BASE_URL = "/api"; 

    // Retrieve data whenever active status or credentials match
    useEffect(() => {
        if (isAuthenticated) {
            // Load orders
            fetch(`${API_BASE_URL}/admin/orders`)
                .then(res => res.ok ? res.json() : [])
                .then(data => { if (Array.isArray(data)) setOrders(data); })
                .catch(err => {
                    console.error("Failed to fetch orders:", err);
                    const stored = localStorage.getItem('mystic_all_orders');
                    if (stored) setOrders(JSON.parse(stored));
                });

            // Load products
            fetch(`${API_BASE_URL}/products`)
                .then(res => res.ok ? res.json() : [])
                .then(data => { if (Array.isArray(data)) setProducts(data); })
                .catch(err => console.error("Failed to fetch products:", err));

            // Load homepage
            fetch(`${API_BASE_URL}/homepage`)
                .then(res => res.ok ? res.json() : [])
                .then(data => { if (Array.isArray(data)) setHomepageConfigs(data); })
                .catch(err => console.error("Failed to fetch homepage configs:", err));

            // Load global settings
            fetch(`${API_BASE_URL}/admin/settings`)
                .then(res => res.ok ? res.json() : null)
                .then(data => { if (data) setSettings(data); })
                .catch(err => console.error("Failed to fetch settings:", err));

            // Load registered users
            fetch(`${API_BASE_URL}/admin/users`)
                .then(res => res.ok ? res.json() : [])
                .then(data => { if (Array.isArray(data)) setUsersList(data); })
                .catch(err => console.error("Failed to fetch registered users list:", err));

            // Load articles
            fetch(`${API_BASE_URL}/admin/articles`)
                .then(res => res.ok ? res.json() : [])
                .then(data => { if (Array.isArray(data)) setArticles(data); })
                .catch(err => console.error("Failed to fetch articles:", err));
        }
    }, [isAuthenticated]);

    // Handle updates on changing tabs
    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'analytics') {
                fetch(`${API_BASE_URL}/admin/users`)
                    .then(res => res.json())
                    .then(data => { if (Array.isArray(data)) setUsersList(data); })
                    .catch(err => console.error("Failed to reload users:", err));
            } else if (activeTab === 'security') {
                setIsLoadingSecurity(true);
                fetch(`${API_BASE_URL}/admin/security-status`)
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                        if (data) setSecurityStatus(data);
                        setIsLoadingSecurity(false);
                    })
                    .catch(err => {
                        console.error("Failed to fetch security status:", err);
                        setIsLoadingSecurity(false);
                    });
            }
        }
    }, [activeTab, isAuthenticated]);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSettings(true);
        setSettingsStatus('');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSettingsStatus('success');
            } else {
                setSettingsStatus('error');
            }
        } catch (err) {
            console.error(err);
            setSettingsStatus('error');
        } finally {
            setIsSavingSettings(false);
            setTimeout(() => setSettingsStatus(''), 4000);
        }
    };

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingConfig) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/homepage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingConfig)
            });
            if (res.ok) {
                setHomepageConfigs(prev => {
                    const idx = prev.findIndex(c => c.key === editingConfig.key);
                    if (idx >= 0) {
                        const newArr = [...prev];
                        newArr[idx] = editingConfig;
                        return newArr;
                    }
                    return [...prev, editingConfig];
                });
                setEditingConfig(null);
                alert("Homepage section updated successfully!");
            }
        } catch (err) {
            console.error("Save homepage config failed:", err);
            alert("Error saving homepage configuration details.");
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'larry520520') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setIsSecondarilyVerified(false);
        setSecUsername('');
        setSecPassword('');
        setSecError('');
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
                alert("Product saved successfully.");
            }
        } catch (err) {
            console.error("Save product failed:", err);
            alert("Error saving product item.");
        }
    };

    // Article Handlers
    const handleSaveArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingArticle || !editingArticle.title || !editingArticle.content) {
            alert("请填写完整的文章标题和正文内容！");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/admin/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingArticle)
            });
            if (res.ok) {
                const saved = await res.json();
                setArticles(prev => {
                    const idx = prev.findIndex(a => a.id === saved.id);
                    if (idx !== -1) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                    }
                    return [saved, ...prev];
                });
                setEditingArticle(null);
                setAiTopicInput('');
                alert("文章保存成功！网页已实时更新。");
            } else {
                alert("保存文章失败，请检查填写内容重试。");
            }
        } catch (err) {
            console.error("Save article error:", err);
            alert("网络保存出错，请稍后重试。");
        }
    };

    const handleDeleteArticle = async (id: string) => {
        if (!window.confirm("确定要删除此文章吗？删除后将无法从网页恢复。")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/articles/${id}`, { method: 'DELETE' });
             if (res.ok) {
                 setArticles(prev => prev.filter(a => a.id !== id));
                 alert("文章删除成功！");
             } else {
                 alert("删除文章失败。");
             }
        } catch (err) {
            console.error("Delete article error:", err);
            alert("删除请求出错。");
        }
    };

    const handleGenerateArticleContent = async () => {
        setIsGeneratingArticleContent(true);
        try {
            const topic = aiTopicInput.trim() || editingArticle?.title || '面相与财富命运解析';
            const category = editingArticle?.category || '面相识人';
            const res = await fetch(`${API_BASE_URL}/admin/articles/generate-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, category })
            });
            if (res.ok) {
                const generated = await res.json();
                setEditingArticle(prev => ({
                    ...prev,
                    title: generated.title || prev?.title || topic,
                    titleEn: generated.titleEn || prev?.titleEn || '',
                    category: generated.category || prev?.category || category,
                    categoryEn: generated.categoryEn || prev?.categoryEn || 'Physiognomy',
                    summary: generated.summary || prev?.summary || '',
                    summaryEn: generated.summaryEn || prev?.summaryEn || '',
                    tags: generated.tags || prev?.tags || [category, '命理', '五行'],
                    readTime: generated.readTime || '6 min read',
                    author: generated.author || '天机之眼命理研究院',
                    authorEn: generated.authorEn || 'TianJiEyes Institute',
                    content: generated.content || prev?.content || '',
                    contentEn: generated.contentEn || prev?.contentEn || ''
                }));
            } else {
                alert("AI 生成文案失败，请稍后重试。");
            }
        } catch (err) {
            console.error("Generate article content error:", err);
            alert("AI 文本生成处理出错。");
        } finally {
            setIsGeneratingArticleContent(false);
        }
    };

    const handleGenerateArticleImage = async () => {
        setIsGeneratingArticleImage(true);
        try {
            const prompt = editingArticle?.title || aiTopicInput || 'mystic celestial face reading, oriental luxury background';
            const category = editingArticle?.category || '面相识人';
            const res = await fetch(`${API_BASE_URL}/admin/articles/generate-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, title: editingArticle?.title, category })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.imageUrl) {
                    setEditingArticle(prev => ({ ...prev, coverImage: data.imageUrl }));
                }
            } else {
                alert("AI 封面图生成失败，请重试");
            }
        } catch (err) {
            console.error("Generate article image error:", err);
            alert("AI 图片生成出错");
        } finally {
            setIsGeneratingArticleImage(false);
        }
    };

    const handleArticleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingArticle(prev => ({ ...prev, coverImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // AI copywriting caller
    const handleAIGenerateDesc = async (field: 'defaultDescription' | 'longDescription') => {
        if (!editingProduct) return;
        if (field === 'defaultDescription') setIsGeneratingProdDesc(true);
        else setIsGeneratingProdLongDesc(true);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/generate-text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'product',
                    context: {
                        name: editingProduct.defaultName || '',
                        sku: editingProduct.sku || '',
                        price: editingProduct.price || '',
                        category: editingProduct.category || '',
                        element: editingProduct.element || '',
                        zodiac: editingProduct.zodiac || '',
                        language: t.langCode || 'zh'
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.text) {
                    setEditingProduct(prev => ({
                        ...prev,
                        [field]: data.text
                    }));
                }
            } else {
                const err = await res.json();
                alert("AI generation failed: " + (err.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Connection error to AI copywriter node.");
        } finally {
            if (field === 'defaultDescription') setIsGeneratingProdDesc(false);
            else setIsGeneratingProdLongDesc(false);
        }
    };

    const handleAIGenerateHomeDesc = async () => {
        if (!editingConfig) return;
        setIsGeneratingHomeDesc(true);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/generate-text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'homepage',
                    context: {
                        key: editingConfig.key,
                        title: editingConfig.title,
                        language: t.langCode || 'zh'
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.text) {
                    setEditingConfig((prev: any) => ({
                        ...prev,
                        description: data.text
                    }));
                }
            } else {
                const err = await res.json();
                alert("AI generation failed: " + (err.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Connection error to AI story copywriter node.");
        } finally {
            setIsGeneratingHomeDesc(false);
        }
    };

    // Calculate aggregated metrics for Requirement 5
    const getDailySummary = () => {
        const dailyMap: Record<string, { count: number, revenue: number, paidCount: number }> = {};
        orders.forEach(o => {
            if (!o.date) return;
            // Parse and format YYYY-MM-DD
            const d = new Date(o.date);
            const dateStr = d.toISOString().split('T')[0];
            if (!dailyMap[dateStr]) {
                dailyMap[dateStr] = { count: 0, revenue: 0, paidCount: 0 };
            }
            dailyMap[dateStr].count += 1;
            dailyMap[dateStr].revenue += o.total || 0;
            if (o.status === 'paid') dailyMap[dateStr].paidCount += 1;
        });

        return Object.entries(dailyMap)
            .map(([date, val]) => ({ date, ...val }))
            .sort((a, b) => b.date.localeCompare(a.date));
    };

    const getMonthlySummary = () => {
        const monthlyMap: Record<string, { count: number, revenue: number, paidCount: number }> = {};
        orders.forEach(o => {
            if (!o.date) return;
            const d = new Date(o.date);
            const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyMap[mStr]) {
                monthlyMap[mStr] = { count: 0, revenue: 0, paidCount: 0 };
            }
            monthlyMap[mStr].count += 1;
            monthlyMap[mStr].revenue += o.total || 0;
            if (o.status === 'paid') monthlyMap[mStr].paidCount += 1;
        });

        return Object.entries(monthlyMap)
            .map(([month, val]) => ({ month, ...val }))
            .sort((a, b) => b.month.localeCompare(a.month));
    };

    const totalSalesRevenue = orders.reduce((acc, current) => acc + (current.status === 'paid' ? current.total : 0), 0);
    const paidOrdersLength = orders.filter(o => o.status === 'paid').length;
    const averageOrderValue = paidOrdersLength > 0 ? (totalSalesRevenue / paidOrdersLength) : 0;

    const downloadCSV = () => {
        const headers = ["Order ID", "Date", "Customer Name", "Items Purchased", "Amount Paid", "Status", "Email", "Phone"];
        const rows = orders.map(o => [
            o.id,
            o.date,
            `"${o.customerName || ''}"`,
            `"${o.items || ''}"`,
            o.total,
            o.status,
            o.email || '',
            o.phone || ''
        ]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `mystic_face_orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isAuthenticated) {
        return (
            <div style={{...styles.glassPanel, maxWidth: '420px', margin: '60px auto', padding: '30px', border: `1px solid rgba(102, 192, 244, 0.3)`}}>
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <h2 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.6rem', margin: '0 0 5px 0', textShadow: '0 0 10px rgba(102, 192, 244, 0.4)'}}>Admin Login</h2>
                    <p style={{color: '#aaa', fontSize: '0.85rem', margin: 0, fontFamily: '"Space Grotesk", sans-serif'}}>Face Analysis Management Console</p>
                </div>
                <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div>
                        <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '4px', fontFamily: '"Space Grotesk", sans-serif'}}>Username</label>
                        <input 
                            type="text" 
                            style={{...styles.formInput, borderColor: 'rgba(102, 192, 244, 0.2)', fontFamily: '"Space Grotesk", sans-serif'}} 
                            placeholder="" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '4px', fontFamily: '"Space Grotesk", sans-serif'}}>Password</label>
                        <input 
                            type="password" 
                            style={{...styles.formInput, borderColor: 'rgba(102, 192, 244, 0.2)', fontFamily: '"Space Grotesk", sans-serif'}} 
                            placeholder="" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" style={styles.button}>{t.login}</button>
                </form>
            </div>
        );
    }

    const dailyStats = getDailySummary();
    const monthlyStats = getMonthlySummary();

    return (
        <div style={{width: '95%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem'}}>
            {/* Header Tabs with Mobile Compatibility styling */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '1rem', flexWrap: 'wrap', gap: '12px'}}>
                <h2 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', margin: 0, fontSize: '1.5rem', textShadow: '0 0 10px rgba(102, 192, 244, 0.3)'}}>{t.adminDashboard}</h2>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}} className="admin-tabs">
                    <button 
                        onClick={() => setActiveTab('orders')} 
                        style={{...styles.secondaryButton, background: activeTab === 'orders' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'orders' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        {t.historyTitle}
                    </button>
                    <button 
                        onClick={() => setActiveTab('analytics')} 
                        style={{...styles.secondaryButton, background: activeTab === 'analytics' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'analytics' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        📊 数据汇总 (Analytics)
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')} 
                        style={{...styles.secondaryButton, background: activeTab === 'products' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'products' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        {t.productManagement}
                    </button>
                    <button 
                        onClick={() => setActiveTab('homepage')} 
                        style={{...styles.secondaryButton, background: activeTab === 'homepage' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'homepage' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        {t.homepageManagement || "Homepage"}
                    </button>
                    <button 
                        onClick={() => setActiveTab('articles')} 
                        style={{...styles.secondaryButton, background: activeTab === 'articles' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'articles' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        📝 文章管理 (Articles)
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')} 
                        style={{...styles.secondaryButton, background: activeTab === 'settings' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'settings' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        SETTING & PIXEL
                    </button>
                    <button 
                        onClick={() => setActiveTab('payments')} 
                        style={{...styles.secondaryButton, background: activeTab === 'payments' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'payments' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        💳 收款设置
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai')} 
                        style={{...styles.secondaryButton, background: activeTab === 'ai' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'ai' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        🤖 AI 配置 (Configure AI)
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')} 
                        style={{...styles.secondaryButton, background: activeTab === 'security' ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent', color: '#fff', borderColor: activeTab === 'security' ? 'transparent' : 'rgba(102, 192, 244, 0.3)', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}
                    >
                        🛡️ 域名与安全防护 (Security)
                    </button>
                    <button onClick={handleLogout} style={{...styles.secondaryButton, borderColor: '#ff4d4d', color: '#ff4d4d', margin: 0, padding: '6px 12px', fontSize: '0.85rem'}}>Logout</button>
                </div>
            </div>

            {/* TAB CONTENT: 1. ORDERS */}
            {activeTab === 'orders' && (
                <>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                        <button onClick={downloadCSV} style={{...styles.button, marginTop: 0, padding: '8px 15px', fontSize: '0.9rem', minWidth: 'auto', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <i className="fas fa-file-excel"></i> {t.exportBtn || "Export CSV"}
                        </button>
                    </div>
                    <div style={{...styles.glassPanel, padding: '0', overflow: 'hidden', width: '100%'}}>
                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0', minWidth: '800px'}}>
                                <thead>
                                    <tr style={{background: 'rgba(102, 192, 244, 0.15)', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`}}>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>{t.orderId}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>{t.date}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>{t.customer}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>{t.items}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>{t.amount}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>{t.status}</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{padding: '30px', textAlign: 'center', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>{t.noOrders}</td>
                                        </tr>
                                    ) : (
                                        orders.map((order, index) => (
                                            <tr key={index} style={{borderBottom: '1px solid rgba(102, 192, 244, 0.1)', background: index % 2 === 0 ? 'transparent' : 'rgba(102, 192, 244, 0.02)'}}>
                                                <td style={{padding: '12px 15px', fontSize: '0.85rem', fontFamily: 'monospace'}}>{order.id}</td>
                                                <td style={{padding: '12px 15px', fontSize: '0.85rem', fontFamily: '"Space Grotesk", sans-serif'}}>{order.date ? new Date(order.date).toLocaleString() : 'N/A'}</td>
                                                <td style={{padding: '12px 15px', fontFamily: '"Space Grotesk", sans-serif'}}>{order.customerName}</td>
                                                <td style={{padding: '12px 15px', fontSize: '0.85rem', fontFamily: '"Space Grotesk", sans-serif'}}>{order.items}</td>
                                                <td style={{padding: '12px 15px', fontWeight: 'bold', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>${(order.total || 0).toFixed(2)}</td>
                                                <td style={{padding: '12px 15px'}}>
                                                    <span style={{
                                                        background: order.status === 'paid' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                                                        color: order.status === 'paid' ? '#2ecc71' : '#e74c3c',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        fontFamily: '"Space Grotesk", sans-serif'
                                                    }}>
                                                        {(order.status || 'paid').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{padding: '12px 15px', fontSize: '0.8rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                                                    <div>{order.email}</div>
                                                    {order.phone && <div>{order.phone}</div>}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* TAB CONTENT: 2. ANALYTICS (Site Dynamics, Registrations & Subscriptions) */}
            {activeTab === 'analytics' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                    
                    {/* General metrics cards row */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px'}}>
                        <div style={{...styles.glassPanel, padding: '20px', textAlign: 'center', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                            <div style={{color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>付费总销售额 (Total Sales)</div>
                            <div style={{color: theme.accent, fontSize: '2rem', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textShadow: '0 0 10px rgba(102, 192, 244, 0.3)'}}>${totalSalesRevenue.toFixed(2)}</div>
                        </div>
                        <div style={{...styles.glassPanel, padding: '20px', textAlign: 'center', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                            <div style={{color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>付费总订单数 (Paid Orders)</div>
                            <div style={{color: theme.accent, fontSize: '2rem', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textShadow: '0 0 10px rgba(102, 192, 244, 0.3)'}}>{paidOrdersLength}</div>
                        </div>
                        <div style={{...styles.glassPanel, padding: '20px', textAlign: 'center', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                            <div style={{color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>平均客单价 (AOV)</div>
                            <div style={{color: theme.accent, fontSize: '2rem', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 'bold', textShadow: '0 0 10px rgba(102, 192, 244, 0.3)'}}>${averageOrderValue.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Daily and Monthly tables side-by-side or stacked */}
                    <div style={{display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', gap: '20px'}} className="responsive-grid">
                        
                        {/* Daily analytics box */}
                        <div style={{...styles.glassPanel, borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                            <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', marginBottom: '15px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>按日订单分析 (Daily Orders Breakdown)</h3>
                            <div style={{overflowY: 'auto', maxHeight: '350px'}} className="table-responsive">
                                <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0', fontSize: '0.85rem'}}>
                                    <thead>
                                        <tr style={{background: 'rgba(102, 192, 244, 0.1)', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`}}>
                                            <th style={{padding: '10px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>日期 (Date)</th>
                                            <th style={{padding: '10px', textAlign: 'center', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>成交单数 (Orders)</th>
                                            <th style={{padding: '10px', textAlign: 'right', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>当日销售额 (Sales)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyStats.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} style={{padding: '15px', textAlign: 'center', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>暂无按日合算数据</td>
                                            </tr>
                                        ) : (
                                            dailyStats.map((item, idx) => (
                                                <tr key={idx} style={{borderBottom: '1px solid rgba(102,192,244,0.1)'}}>
                                                    <td style={{padding: '10px', fontFamily: '"Space Grotesk", sans-serif'}}>{item.date}</td>
                                                    <td style={{padding: '10px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>{item.count} <span style={{fontSize: '0.75rem', color: '#2ecc71'}}>({item.paidCount} paid)</span></td>
                                                    <td style={{padding: '10px', textAlign: 'right', fontWeight: 'bold', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>${item.revenue.toFixed(2)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Monthly analytics box */}
                        <div style={{...styles.glassPanel, borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                            <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', marginBottom: '15px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>按月订单汇总 (Monthly Orders Summary)</h3>
                            <div style={{overflowY: 'auto', maxHeight: '350px'}} className="table-responsive">
                                <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0', fontSize: '0.85rem'}}>
                                    <thead>
                                        <tr style={{background: 'rgba(102, 192, 244, 0.1)', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`}}>
                                            <th style={{padding: '10px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>月份 (Month)</th>
                                            <th style={{padding: '10px', textAlign: 'center', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>成交单数 (Orders)</th>
                                            <th style={{padding: '10px', textAlign: 'right', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>每月销售额 (Sales)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyStats.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} style={{padding: '15px', textAlign: 'center', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>暂无按月汇总数据</td>
                                            </tr>
                                        ) : (
                                            monthlyStats.map((item, idx) => (
                                                <tr key={idx} style={{borderBottom: '1px solid rgba(102,192,244,0.1)'}}>
                                                    <td style={{padding: '10px', fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif'}}>{item.month}</td>
                                                    <td style={{padding: '10px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>{item.count} <span style={{fontSize: '0.75rem', color: '#2ecc71'}}>({item.paidCount} paid)</span></td>
                                                    <td style={{padding: '10px', textAlign: 'right', fontWeight: 'bold', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>${item.revenue.toFixed(2)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Registered users section */}
                    <div style={{...styles.glassPanel, borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                        <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.2rem', marginBottom: '15px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                            <i className="fas fa-users" style={{marginRight: '8px'}}></i> 用户注册和订阅信息 (Registrations & Subscriptions)
                        </h3>
                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0', fontSize: '0.85rem'}}>
                                <thead>
                                    <tr style={{background: 'rgba(102, 192, 244, 0.15)', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`}}>
                                        <th style={{padding: '12px 10px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>用户名 / 姓名 (Name)</th>
                                        <th style={{padding: '12px 10px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>电子邮箱 (Email)</th>
                                        <th style={{padding: '12px 10px', textAlign: 'center', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>注册通道 (Auth)</th>
                                        <th style={{padding: '12px 10px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>注册时间 (Registered At)</th>
                                        <th style={{padding: '12px 10px', textAlign: 'center', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>订阅状态 (Subscription)</th>
                                        <th style={{padding: '12px 10px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>到期时间 (Expires At)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{padding: '20px', textAlign: 'center', color: '#888'}}>暂无注册用户记录</td>
                                        </tr>
                                    ) : (
                                        usersList.map((user, idx) => (
                                            <tr key={idx} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                                                <td style={{padding: '10px', fontWeight: '500'}}>{user.name || user.firstName || 'N/A'}</td>
                                                <td style={{padding: '10px'}}>{user.email}</td>
                                                <td style={{padding: '10px', textAlign: 'center', textTransform: 'capitalize'}}>{user.authType || 'email'}</td>
                                                <td style={{padding: '10px'}}>{user.registeredAt ? new Date(user.registeredAt).toLocaleString() : 'N/A'}</td>
                                                <td style={{padding: '10px', textAlign: 'center'}}>
                                                    <span style={{
                                                        background: user.isSubscribed ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255,255,255,0.05)',
                                                        color: user.isSubscribed ? '#2ecc71' : '#aaa',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {user.isSubscribed ? `SUBSCRIBED (${user.subscriptionPlan || 'Premium'})` : 'FREE USER'}
                                                    </span>
                                                </td>
                                                <td style={{padding: '10px', fontSize: '0.8rem', color: '#bbb'}}>
                                                    {user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}

            {/* TAB CONTENT: 3. PRODUCTS (Requirement 1 - Stacking vertically, labels for every field, base64 images uploads, Gemini description) */}
            {activeTab === 'products' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                    
                    {/* Top part: Product Form */}
                    <div style={{...styles.glassPanel, border: `1px solid ${editingProduct ? 'rgba(102, 192, 244, 0.4)' : 'rgba(102, 192, 244, 0.15)'}`}}>
                        <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '8px', marginBottom: '20px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                            {editingProduct?.id ? `✏️ 编辑商品属性 (${t.editProduct})` : `✨ 添加全新神佛圣物 (${t.addProduct})`}
                        </h3>
                        
                        <form onSubmit={handleSaveProduct} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px'}}>
                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        商品编号 (Product ID) <span style={{color: '#ff4d4d'}}>*</span>
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: prod-agate (不填将自动生成)" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.id || ''} onChange={e => setEditingProduct({...editingProduct, id: e.target.value})} 
                                    />
                                    <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>商品的唯一标示代码 (唯一不可重复)</span>
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        产品多语言包健 (Name Translation Key)
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: prod_agate_name" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.nameKey || ''} onChange={e => setEditingProduct({...editingProduct, nameKey: e.target.value})} 
                                    />
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        产品名称/标题 (Product Title) <span style={{color: '#ff4d4d'}}>*</span>
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: 极品红玛瑙辟邪项链" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.defaultName || ''} onChange={e => setEditingProduct({...editingProduct, defaultName: e.target.value})} 
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px'}}>
                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        专属唯一商品 SKU <span style={{color: '#ff4d4d'}}>*</span>
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: AGT-BRC-001" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.sku || ''} onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})} 
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        价格显示 (Display Price Style) <span style={{color: '#ff4d4d'}}>*</span>
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: $39.99" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} 
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        结算数值价格 (Numeric Price) <span style={{color: '#ff4d4d'}}>*</span>
                                    </label>
                                    <input 
                                        type="number" step="0.01" placeholder="例如: 39.99" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.numericPrice || 0} onChange={e => setEditingProduct({...editingProduct, numericPrice: parseFloat(e.target.value) || 0})} 
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px'}}>
                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        集合分类 (Collection Category)
                                    </label>
                                    <select 
                                        style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} value={editingProduct?.category || 'bracelet'} 
                                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}
                                    >
                                        <option value="bracelet">法力手链 (Bracelet)</option>
                                        <option value="pendant">开光吊坠 (Pendant)</option>
                                        <option value="amulet">辟邪护身符 (Amulet)</option>
                                        <option value="crystal">能量水晶球 (Crystal)</option>
                                        <option value="other">其他玄学物 (Other)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        产品上架状态 (Status)
                                    </label>
                                    <select 
                                        style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} value={editingProduct?.status || 'active'} 
                                        onChange={e => setEditingProduct({...editingProduct, status: e.target.value as 'active' | 'inactive'})}
                                    >
                                        <option value="active">上架销售中 (Listed/Active)</option>
                                        <option value="inactive">下架维护中 (Delisted/Inactive)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        适用生肖属性 (Zodiac Alignment)
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: Dragon, Tiger (生肖龙, 虎)" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.zodiac || ''} onChange={e => setEditingProduct({...editingProduct, zodiac: e.target.value})} 
                                    />
                                </div>

                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        五行核心属性 (Elemental Alignment)
                                    </label>
                                    <input 
                                        type="text" placeholder="例如: Fire (生旺火行能量)" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingProduct?.element || ''} onChange={e => setEditingProduct({...editingProduct, element: e.target.value})} 
                                    />
                                </div>
                            </div>

                            {/* Image File upload and Preview container */}
                            <div style={{border: '1px solid rgba(102, 192, 244, 0.15)', background: 'rgba(102, 192, 244, 0.01)', padding: '15px', borderRadius: '4px'}}>
                                <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                    本地图片上传 & 实时预览 (Upload Product Image & Preview)
                                </label>
                                <div style={{display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
                                    <div style={{
                                        width: '100px', 
                                        height: '100px', 
                                        borderRadius: '6px', 
                                        border: `1px dashed rgba(102, 192, 244, 0.4)`, 
                                        background: '#171A21', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {editingProduct?.imageUrl ? (
                                            <img src={editingProduct.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        ) : (
                                            <span style={{color: '#888', fontSize: '0.75rem', textAlign: 'center', padding: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>No Image</span>
                                        )}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <input 
                                            type="file" accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditingProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{color: '#ccc', fontSize: '0.85rem', cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: '"Space Grotesk", sans-serif'}}
                                        />
                                        <p style={{color: '#888', fontSize: '0.75rem', margin: '5px 0 0 0', fontFamily: '"Space Grotesk", sans-serif'}}>支持 JPEG, PNG, WEBP 本地拖拽上传或文件点选。加载后将自动转储预览。</p>
                                    </div>
                                </div>
                            </div>

                            {/* Descriptions in Vertical Alignment with AI writing */}
                            <div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                                    <label style={{color: theme.accent, fontSize: '0.85rem', fontWeight: '600', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        基础宣传描述 (Basic Product Description)
                                    </label>
                                    <button 
                                        type="button" 
                                        disabled={isGeneratingProdDesc}
                                        onClick={() => handleAIGenerateDesc('defaultDescription')} 
                                        style={{
                                            background: 'rgba(102, 192, 244, 0.1)', 
                                            borderColor: 'rgba(102, 192, 244, 0.4)', 
                                            color: theme.accent, 
                                            padding: '4px 8px', 
                                            fontSize: '0.75rem', 
                                            cursor: 'pointer', 
                                            border: `1px solid rgba(102, 192, 244, 0.4)`,
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            margin: 0,
                                            fontFamily: '"Space Grotesk", sans-serif'
                                        }}
                                    >
                                        <i className={`fas ${isGeneratingProdDesc ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                                        {isGeneratingProdDesc ? "Drafting with AI..." : "🔮 AI智能一键撰写文案"}
                                    </button>
                                </div>
                                <textarea 
                                    placeholder="输入简要的基础描述文案，或点击AI魔法棒一键生成精美玄学物卖点文案..." style={{...styles.formInput, height: '100px', fontFamily: '"Space Grotesk", sans-serif'}} 
                                    value={editingProduct?.defaultDescription || ''} onChange={e => setEditingProduct({...editingProduct, defaultDescription: e.target.value})} 
                                />
                            </div>

                            <div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                                    <label style={{color: theme.accent, fontSize: '0.85rem', fontWeight: '600', fontFamily: '"Space Grotesk", sans-serif'}}>
                                        商品高级排版详情参数 (Detailed Long Description)
                                    </label>
                                    <button 
                                        type="button" 
                                        disabled={isGeneratingProdLongDesc}
                                        onClick={() => handleAIGenerateDesc('longDescription')} 
                                        style={{
                                            background: 'rgba(102, 192, 244, 0.1)', 
                                            borderColor: 'rgba(102, 192, 244, 0.4)', 
                                            color: theme.accent, 
                                            padding: '4px 8px', 
                                            fontSize: '0.75rem', 
                                            cursor: 'pointer', 
                                            border: `1px solid rgba(102, 192, 244, 0.4)`,
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            margin: 0,
                                            fontFamily: '"Space Grotesk", sans-serif'
                                        }}
                                    >
                                        <i className={`fas ${isGeneratingProdLongDesc ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                                        {isGeneratingProdLongDesc ? "Drafting Detail with AI..." : "🔮 AI智能一键撰写产品详情"}
                                    </button>
                                </div>
                                <textarea 
                                    placeholder="输入产品的详细典籍记载、风水禁忌、佩戴讲究等全方位细节，亦可由AI一键深度代笔..." style={{...styles.formInput, height: '140px', fontFamily: '"Space Grotesk", sans-serif'}} 
                                    value={editingProduct?.longDescription || ''} onChange={e => setEditingProduct({...editingProduct, longDescription: e.target.value})} 
                                />
                            </div>

                            {/* Buttons conforming to multi-platform optimization constraint */}
                            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', width: '100%'}}>
                                <button type="submit" style={{...styles.button, flex: '1 1 200px', margin: 0, padding: '12px', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                                    <i className="fas fa-save" style={{marginRight: '8px'}}></i> 保存商品 (Save Product)
                                </button>
                                <button type="button" onClick={() => setEditingProduct(null)} style={{...styles.secondaryButton, flex: '1 1 200px', margin: 0, padding: '12px', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif', borderColor: 'rgba(102, 192, 244, 0.3)'}}>
                                    <i className="fas fa-undo" style={{marginRight: '8px'}}></i> 重置表单 (Reset Form)
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Bottom part: Products Table List */}
                    <div style={{...styles.glassPanel, padding: '0', overflow: 'hidden', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                        <div style={{padding: '15px 20px', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, background: 'rgba(102, 192, 244, 0.01)'}}>
                            <h4 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', margin: 0, fontSize: '1.1rem', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                                <i className="fas fa-cubes" style={{marginRight: '8px'}}></i> 在售商品库一览 (Database Products Inventory)
                            </h4>
                        </div>
                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0'}}>
                                <thead>
                                    <tr style={{background: 'rgba(102, 192, 244, 0.15)', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`}}>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>图片 (Image)</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>商品名称与SKU</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>价格 (Price)</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>集合与命理 (Tag)</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>销售状态 (Status)</th>
                                        <th style={{padding: '15px', textAlign: 'right', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>操作栏 (Actions)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id} style={{borderBottom: '1px solid rgba(102, 192, 244, 0.1)', background: 'transparent'}}>
                                            <td style={{padding: '10px 15px'}}>
                                                <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/100/100`} style={{width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover', border: `1px solid rgba(102, 192, 244, 0.2)`}} />
                                            </td>
                                            <td style={{padding: '10px 15px'}}>
                                                <div style={{fontWeight: 'bold', fontSize: '0.95rem', fontFamily: '"Space Grotesk", sans-serif'}}>{p.defaultName}</div>
                                                <div style={{fontSize: '0.75rem', color: '#999', fontFamily: '"Space Grotesk", sans-serif'}}>SKU: <code style={{color: theme.accent}}>{p.sku || 'N/A'}</code> | ID: {p.id}</div>
                                            </td>
                                            <td style={{padding: '10px 15px', color: theme.accent, fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif'}}>{p.price}</td>
                                            <td style={{padding: '10px 15px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                                <span style={{fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', textTransform: 'capitalize', marginRight: '5px'}}>分类: {p.category}</span>
                                                {p.element && <span style={{fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(102, 192, 244, 0.1)', color: theme.accent, borderRadius: '3px'}}>{p.element}行</span>}
                                            </td>
                                            <td style={{padding: '10px 15px'}}>
                                                <span style={{
                                                    background: p.status === 'inactive' ? 'rgba(230, 126, 34, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                                                    color: p.status === 'inactive' ? '#e67e22' : '#2ecc71',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    fontFamily: '"Space Grotesk", sans-serif'
                                                }}>
                                                    {p.status === 'inactive' ? 'DELISTED (已下架)' : 'LISTED (销售中)'}
                                                </span>
                                            </td>
                                            <td style={{padding: '10px 15px', textAlign: 'right'}}>
                                                <button onClick={() => {
                                                    setEditingProduct(p);
                                                    window.scrollTo({ top: 120, behavior: 'smooth' });
                                                }} style={{background: 'none', border: 'none', color: theme.accent, cursor: 'pointer', marginRight: '15px', fontSize: '1.05rem'}} title="编辑商品">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button onClick={() => handleDeleteProduct(p.id)} style={{background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.05rem'}} title="删除商品">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}

            {/* TAB CONTENT: 4. HOMEPAGE MANAGEMENT (Requirement 2 - Vertical flow, local upload preview, AI descriptions, responsive button adapts to PC/Tablet/iOS/Android) */}
            {activeTab === 'homepage' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                    
                    {/* Top Part: Homepage config form */}
                    <div style={{...styles.glassPanel, border: `1px solid ${editingConfig ? 'rgba(102, 192, 244, 0.4)' : 'rgba(102, 192, 244, 0.15)'}`}}>
                        <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '8px', marginBottom: '20px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                            {editingConfig ? `✍️ 优化主页板块: ${editingConfig.key}` : '💡 选择下方主页模块进行重修或文案撰写'}
                        </h3>
                        
                        <form onSubmit={handleSaveConfig} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px'}}>
                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>板块标识代号 (Section / Key)</label>
                                    <input 
                                        type="text" style={{...styles.formInput, opacity: 0.6, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingConfig?.key || '未选定模版'} readOnly 
                                    />
                                </div>
                                <div>
                                    <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>展示大标题 (Title)</label>
                                    <input 
                                        type="text" placeholder="板块大标题" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                        value={editingConfig?.title || ''} onChange={e => setEditingConfig({...editingConfig, title: e.target.value})} 
                                        disabled={!editingConfig}
                                    />
                                </div>
                            </div>

                            {/* Local Image upload and preview for Homepage config */}
                            <div style={{border: '1px solid rgba(102, 192, 244, 0.15)', background: 'rgba(102, 192, 244, 0.01)', padding: '15px', borderRadius: '4px'}}>
                                <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>板块卡片图本地上传与实时预览 (Banner / Illustration Upload & Preview)</label>
                                <div style={{display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
                                    <div style={{
                                        width: '140px', 
                                        height: '90px', 
                                        borderRadius: '6px', 
                                        border: `1px dashed rgba(102, 192, 244, 0.4)`, 
                                        background: '#171A21', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {editingConfig?.imageUrl ? (
                                            <img src={editingConfig.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        ) : (
                                            <span style={{color: '#888', fontSize: '0.75rem', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>No Image</span>
                                        )}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <input 
                                            type="file" accept="image/*" 
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditingConfig((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            disabled={!editingConfig}
                                            style={{color: '#ccc', fontSize: '0.85rem', cursor: editingConfig ? 'pointer' : 'not-allowed', fontFamily: '"Space Grotesk", sans-serif'}}
                                        />
                                        <p style={{color: '#888', fontSize: '0.75rem', margin: '5px 0 0 0', fontFamily: '"Space Grotesk", sans-serif'}}>玄学大图或者配图上传区。此操作将彻底剔除并覆盖原网络URL。</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Write description text */}
                            <div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                                    <label style={{color: theme.accent, fontSize: '0.85rem', fontWeight: '600', fontFamily: '"Space Grotesk", sans-serif'}}>板块引介描述文案 (Introduction & Narrative)</label>
                                    <button 
                                        type="button" 
                                        disabled={!editingConfig || isGeneratingHomeDesc}
                                        onClick={handleAIGenerateHomeDesc} 
                                        style={{
                                            background: 'rgba(102, 192, 244, 0.1)', 
                                            borderColor: 'rgba(102, 192, 244, 0.4)', 
                                            color: theme.accent, 
                                            padding: '4px 8px', 
                                            fontSize: '0.75rem', 
                                            border: `1px solid rgba(102, 192, 244, 0.4)`,
                                            borderRadius: '4px',
                                            cursor: editingConfig ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            margin: 0,
                                            fontFamily: '"Space Grotesk", sans-serif'
                                        }}
                                    >
                                        <i className={`fas ${isGeneratingHomeDesc ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                                        {isGeneratingHomeDesc ? "AI Writing copy..." : "🔮 AI智能润雕板块文案"}
                                    </button>
                                </div>
                                <textarea 
                                    placeholder="输入板块的精美推介词，或点击上方魔法按钮让AI为你量身编撰..." style={{...styles.formInput, height: '110px', fontFamily: '"Space Grotesk", sans-serif'}} 
                                    value={editingConfig?.description || ''} onChange={e => setEditingConfig({...editingConfig, description: e.target.value})} 
                                    disabled={!editingConfig}
                                />
                            </div>

                            {/* AI Image prompt (just kept/updated silently) */}
                            <div>
                                <label style={{display: 'block', color: theme.accent, fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', fontFamily: '"Space Grotesk", sans-serif'}}>备用 AI 出图提示词 (Fallback Image Generation Prompt)</label>
                                <input 
                                    type="text" placeholder="AI Prompt for backup image generation" style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                    value={editingConfig?.imagePrompt || ''} onChange={e => setEditingConfig({...editingConfig, imagePrompt: e.target.value})} 
                                    disabled={!editingConfig}
                                />
                            </div>

                            {/* Buttons and actions with highly fluid container sizing to fit PC/Tablet/iPhone */}
                            <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', width: '100%'}}>
                                <button type="submit" disabled={!editingConfig} style={{...styles.button, flex: '1 1 200px', margin: 0, padding: '12px', fontSize: '0.9rem', cursor: editingConfig ? 'pointer' : 'not-allowed', fontFamily: '"Space Grotesk", sans-serif'}}>
                                    <i className="fas fa-check-circle" style={{marginRight: '8px'}}></i> 保存板块修改 (Save Changes)
                                </button>
                                <button type="button" onClick={() => setEditingConfig(null)} style={{...styles.secondaryButton, flex: '1 1 200px', margin: 0, padding: '12px', fontSize: '0.9rem', fontFamily: '"Space Grotesk", sans-serif', borderColor: 'rgba(102, 192, 244, 0.3)'}}>
                                    <i className="fas fa-times" style={{marginRight: '8px'}}></i> 取消编辑 (Cancel)
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Part: Configs list layout */}
                    <div style={{...styles.glassPanel, padding: '0', overflow: 'hidden', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                        <div style={{padding: '15px 20px', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, background: 'rgba(102, 192, 244, 0.01)'}}>
                            <h4 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', margin: 0, fontSize: '1.1rem', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                                <i className="fas fa-th-list" style={{marginRight: '8px'}}></i> 现有主页板块模组 (Homepage Main Sections)
                            </h4>
                        </div>
                        <div style={{overflowX: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', color: '#e0e0e0'}}>
                                <thead>
                                    <tr style={{background: 'rgba(102, 192, 244, 0.15)', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`}}>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>类型 (Type)</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>主健 (Section Key)</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>前台标题 (Title)</th>
                                        <th style={{padding: '15px', textAlign: 'left', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>配图预览</th>
                                        <th style={{padding: '15px', textAlign: 'right', color: theme.accent, fontFamily: '"Space Grotesk", sans-serif'}}>修改 (Actions)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {homepageConfigs.map((c) => (
                                        <tr key={c.key} style={{borderBottom: '1px solid rgba(102, 192, 244, 0.1)'}}>
                                            <td style={{padding: '10px 15px', textTransform: 'capitalize', fontSize: '0.8rem', fontFamily: '"Space Grotesk", sans-serif'}}>{c.type}</td>
                                            <td style={{padding: '10px 15px', fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif'}}>{c.key}</td>
                                            <td style={{padding: '10px 15px', fontFamily: '"Space Grotesk", sans-serif'}}>{c.title}</td>
                                            <td style={{padding: '10px 15px'}}>
                                                {c.imageUrl ? (
                                                    <img src={c.imageUrl} style={{width: '60px', height: '35px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(102, 192, 244, 0.2)'}} />
                                                ) : (
                                                    <span style={{color: '#555', fontSize: '0.75rem', fontFamily: '"Space Grotesk", sans-serif'}}>No Image</span>
                                                )}
                                            </td>
                                            <td style={{padding: '10px 15px', textAlign: 'right'}}>
                                                <button onClick={() => {
                                                    setEditingConfig(c);
                                                    window.scrollTo({ top: 120, behavior: 'smooth' });
                                                }} style={{background: 'none', border: 'none', color: theme.accent, cursor: 'pointer', fontSize: '1.05rem'}}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}

            {/* TAB CONTENT: ARTICLES MANAGEMENT */}
            {activeTab === 'articles' && (
                <div>
                    {/* Header Controls */}
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px'}}>
                        <div>
                            <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', margin: '0 0 4px 0'}}>
                                📝 文章内容管理 (Articles Management)
                            </h3>
                            <p style={{color: '#aaa', fontSize: '0.85rem', margin: 0}}>
                                管理网站玄学专栏文章，可修改已有文章、删除文章或一键通过 AI 智能创作新标题与完整文章。
                            </p>
                        </div>
                        <button
                            onClick={() => setEditingArticle({
                                id: `art-${Date.now()}`,
                                title: '',
                                titleEn: '',
                                category: '面相识人',
                                categoryEn: 'Physiognomy',
                                summary: '',
                                summaryEn: '',
                                author: '天机之眼命理研究院',
                                authorEn: 'TianJiEyes Institute',
                                readTime: '6 min read',
                                publishDate: new Date().toISOString().split('T')[0],
                                coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
                                tags: ['面相学', '命理', '五行'],
                                content: ''
                            })}
                            style={{
                                ...styles.button,
                                margin: 0,
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                background: 'linear-gradient(90deg, #d4af37 0%, #aa8412 100%)',
                                borderColor: '#d4af37',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fas fa-plus-circle"></i> ➕ 发布新标题文章 (Add Article)
                        </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div style={{...styles.glassPanel, padding: '15px 20px', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '260px'}}>
                            <i className="fas fa-search" style={{color: theme.gold}}></i>
                            <input
                                type="text"
                                placeholder="搜索文章标题或关键词..."
                                value={articleSearchQuery}
                                onChange={e => setArticleSearchQuery(e.target.value)}
                                style={{
                                    ...styles.formInput,
                                    width: '100%',
                                    padding: '8px 12px',
                                    fontSize: '0.85rem',
                                    background: 'rgba(11, 16, 26, 0.6)'
                                }}
                            />
                        </div>
                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                            {['ALL', '面相识人', '手相掌纹', '五行风水', '生肖八字', '星象星座', '易经奇门'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setArticleFilterCat(cat)}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '0.78rem',
                                        borderRadius: '20px',
                                        border: `1px solid ${articleFilterCat === cat ? theme.gold : 'rgba(102, 192, 244, 0.2)'}`,
                                        background: articleFilterCat === cat ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                                        color: articleFilterCat === cat ? theme.gold : '#aaa',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {cat === 'ALL' ? `全部 (${articles.length})` : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Articles List / Grid */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
                        {articles
                            .filter(a => {
                                const matchCat = articleFilterCat === 'ALL' || a.category === articleFilterCat;
                                const q = articleSearchQuery.toLowerCase().trim();
                                if (!q) return matchCat;
                                return matchCat && ((a.title || '').toLowerCase().includes(q) || (a.summary || '').toLowerCase().includes(q));
                            })
                            .map((art) => (
                                <div
                                    key={art.id}
                                    style={{
                                        ...styles.glassPanel,
                                        padding: '18px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderColor: 'rgba(102, 192, 244, 0.25)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div>
                                        <div style={{display: 'flex', gap: '15px', marginBottom: '12px'}}>
                                            <img
                                                src={art.coverImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'}
                                                alt={art.title}
                                                style={{
                                                    width: '90px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: `1px solid rgba(102, 192, 244, 0.3)`
                                                }}
                                                onError={(e: any) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop';
                                                }}
                                            />
                                            <div style={{flex: 1}}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '2px 8px',
                                                    background: 'rgba(102, 192, 244, 0.15)',
                                                    border: `1px solid rgba(102, 192, 244, 0.4)`,
                                                    borderRadius: '12px',
                                                    color: theme.gold,
                                                    fontSize: '0.72rem',
                                                    marginBottom: '6px'
                                                }}>
                                                    {art.category || '未分类'}
                                                </span>
                                                <h4 style={{
                                                    color: '#fff',
                                                    fontSize: '0.95rem',
                                                    margin: '0 0 6px 0',
                                                    lineHeight: '1.4',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {art.title}
                                                </h4>
                                                <div style={{fontSize: '0.75rem', color: '#888'}}>
                                                    {art.publishDate || '2026-07-30'} · {art.author || '天机之眼'}
                                                </div>
                                            </div>
                                        </div>

                                        <p style={{
                                            color: '#aaa',
                                            fontSize: '0.8rem',
                                            lineHeight: '1.5',
                                            marginBottom: '15px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {art.summary}
                                        </p>
                                    </div>

                                    <div style={{display: 'flex', gap: '10px', borderTop: `1px solid rgba(102, 192, 244, 0.15)`, paddingTop: '12px', marginTop: '10px'}}>
                                        <button
                                            onClick={() => setEditingArticle(art)}
                                            style={{
                                                flex: 1,
                                                padding: '6px 12px',
                                                fontSize: '0.8rem',
                                                background: 'rgba(102, 192, 244, 0.15)',
                                                border: `1px solid rgba(102, 192, 244, 0.4)`,
                                                color: '#fff',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <i className="fas fa-edit"></i> ✏️ 修改
                                        </button>
                                        <button
                                            onClick={() => handleDeleteArticle(art.id)}
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '0.8rem',
                                                background: 'rgba(255, 77, 77, 0.15)',
                                                border: `1px solid rgba(255, 77, 77, 0.4)`,
                                                color: '#ff4d4d',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <i className="fas fa-trash-alt"></i> 🗑️ 删除
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* EDIT / CREATE ARTICLE MODAL */}
                    {editingArticle && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 1000,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px'
                        }}>
                            <div style={{
                                ...styles.glassPanel,
                                width: '100%',
                                maxWidth: '850px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                padding: '30px',
                                border: `1px solid ${theme.gold}`,
                                boxShadow: '0 0 30px rgba(212, 175, 55, 0.25)',
                                position: 'relative'
                            }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '12px'}}>
                                    <h3 style={{color: theme.gold, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.3rem', margin: 0}}>
                                        {articles.some(a => a.id === editingArticle.id) ? '✏️ 编辑文章内容' : '➕ 添加新标题文章'}
                                    </h3>
                                    <button
                                        onClick={() => { setEditingArticle(null); setAiTopicInput(''); }}
                                        style={{background: 'none', border: 'none', color: '#aaa', fontSize: '1.2rem', cursor: 'pointer'}}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                {/* AI GENERATION ASSISTANT SECTION */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(27, 40, 56, 0.9) 100%)',
                                    border: `1px solid rgba(212, 175, 55, 0.4)`,
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '25px'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: theme.gold, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px'}}>
                                        <i className="fas fa-magic"></i> 🤖 AI 智能一键生成文章 (AI Article Generator)
                                    </div>
                                    <p style={{color: '#ccc', fontSize: '0.8rem', margin: '0 0 12px 0'}}>
                                        输入想写的文章主题或关键词（如: 额头开阔财运、下巴丰满晚运、风水文昌位调理），点击按钮即可自动生成标题、封面建议、摘要及Markdown完整正文！
                                    </p>
                                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                        <input
                                            type="text"
                                            placeholder="输入文章主题或关键词 (如: 眉毛与社交财运)..."
                                            value={aiTopicInput}
                                            onChange={e => setAiTopicInput(e.target.value)}
                                            style={{...styles.formInput, flex: 1, minWidth: '220px', fontSize: '0.85rem'}}
                                        />
                                        <button
                                            type="button"
                                            disabled={isGeneratingArticleContent}
                                            onClick={handleGenerateArticleContent}
                                            style={{
                                                ...styles.button,
                                                margin: 0,
                                                padding: '8px 16px',
                                                fontSize: '0.85rem',
                                                background: 'linear-gradient(90deg, #d4af37 0%, #8e7116 100%)',
                                                borderColor: theme.gold,
                                                cursor: isGeneratingArticleContent ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {isGeneratingArticleContent ? '⏳ AI 正在深度撰写中...' : '✨ AI 一键生成整篇文章'}
                                        </button>
                                    </div>
                                </div>

                                {/* FORM INPUTS */}
                                <form onSubmit={handleSaveArticle} style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
                                    
                                    {/* TITLE & CATEGORY */}
                                    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px'}}>
                                        <div>
                                            <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold'}}>
                                                文章标题 (Title) *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="请输入文章标题..."
                                                style={{...styles.formInput, fontSize: '0.9rem'}}
                                                value={editingArticle.title || ''}
                                                onChange={e => setEditingArticle({...editingArticle, title: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold'}}>
                                                所属分类 (Category)
                                            </label>
                                            <select
                                                style={{...styles.formInput, fontSize: '0.9rem'}}
                                                value={editingArticle.category || '面相识人'}
                                                onChange={e => {
                                                    const cat = e.target.value;
                                                    const catEn = cat === '手相掌纹' ? 'Palmistry' : cat === '五行风水' ? 'Feng Shui' : cat === '生肖八字' ? 'Chinese Zodiac' : cat === '星象星座' ? 'Astrology' : cat === '易经奇门' ? 'I Ching & Strategy' : 'Physiognomy';
                                                    setEditingArticle({...editingArticle, category: cat, categoryEn: catEn});
                                                }}
                                            >
                                                <option value="面相识人">面相识人 (Physiognomy)</option>
                                                <option value="手相掌纹">手相掌纹 (Palmistry)</option>
                                                <option value="五行风水">五行风水 (Feng Shui)</option>
                                                <option value="生肖八字">生肖八字 (Zodiac & Bazi)</option>
                                                <option value="星象星座">星象星座 (Astrology)</option>
                                                <option value="易经奇门">易经奇门 (I Ching & Strategy)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* COVER IMAGE */}
                                    <div>
                                        <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold'}}>
                                            封面图片 (Cover Image)
                                        </label>
                                        <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px'}}>
                                            <img
                                                src={editingArticle.coverImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'}
                                                alt="Cover preview"
                                                style={{width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: `1px solid ${theme.gold}`}}
                                            />
                                            <input
                                                type="text"
                                                placeholder="图片 URL 地址..."
                                                style={{...styles.formInput, flex: 1, minWidth: '200px', fontSize: '0.85rem'}}
                                                value={editingArticle.coverImage || ''}
                                                onChange={e => setEditingArticle({...editingArticle, coverImage: e.target.value})}
                                            />
                                            <label style={{
                                                padding: '8px 14px',
                                                background: 'rgba(102, 192, 244, 0.15)',
                                                border: `1px solid rgba(102, 192, 244, 0.4)`,
                                                color: '#fff',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.82rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                📁 本地上传
                                                <input type="file" accept="image/*" onChange={handleArticleCoverUpload} style={{display: 'none'}} />
                                            </label>
                                            <button
                                                type="button"
                                                disabled={isGeneratingArticleImage}
                                                onClick={handleGenerateArticleImage}
                                                style={{
                                                    padding: '8px 14px',
                                                    background: 'rgba(212, 175, 55, 0.2)',
                                                    border: `1px solid ${theme.gold}`,
                                                    color: theme.gold,
                                                    borderRadius: '6px',
                                                    cursor: isGeneratingArticleImage ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.82rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                {isGeneratingArticleImage ? '⏳ 绘图中...' : '🎨 AI 生成封面图'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* SUMMARY */}
                                    <div>
                                        <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold'}}>
                                            文章摘要 (Summary)
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="简短的概要内容描述..."
                                            style={{...styles.formInput, fontSize: '0.85rem'}}
                                            value={editingArticle.summary || ''}
                                            onChange={e => setEditingArticle({...editingArticle, summary: e.target.value})}
                                        />
                                    </div>

                                    {/* AUTHOR & DATE & TAGS */}
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>
                                        <div>
                                            <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '4px'}}>作者名</label>
                                            <input
                                                type="text"
                                                style={{...styles.formInput, fontSize: '0.85rem'}}
                                                value={editingArticle.author || '天机之眼命理研究院'}
                                                onChange={e => setEditingArticle({...editingArticle, author: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '4px'}}>发布日期</label>
                                            <input
                                                type="text"
                                                style={{...styles.formInput, fontSize: '0.85rem'}}
                                                value={editingArticle.publishDate || new Date().toISOString().split('T')[0]}
                                                onChange={e => setEditingArticle({...editingArticle, publishDate: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label style={{display: 'block', color: theme.accent, fontSize: '0.8rem', marginBottom: '4px'}}>标签 (逗号分隔)</label>
                                            <input
                                                type="text"
                                                placeholder="面相, 事业运, 天庭"
                                                style={{...styles.formInput, fontSize: '0.85rem'}}
                                                value={Array.isArray(editingArticle.tags) ? editingArticle.tags.join(', ') : (editingArticle.tags || '')}
                                                onChange={e => setEditingArticle({...editingArticle, tags: e.target.value.split(',').map((t: string) => t.trim())})}
                                            />
                                        </div>
                                    </div>

                                    {/* CONTENT (MARKDOWN) */}
                                    <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                                            <label style={{color: theme.accent, fontSize: '0.8rem', fontWeight: 'bold'}}>
                                                文章正文 (Article Content - 支持 Markdown 格式) *
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleGenerateArticleContent}
                                                disabled={isGeneratingArticleContent}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: theme.gold,
                                                    fontSize: '0.78rem',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                🤖 AI 优化重新生成正文
                                            </button>
                                        </div>
                                        <textarea
                                            rows={12}
                                            required
                                            placeholder="请输入或由 AI 生成正文内容（支持 ### 标题、图片、分段格式）..."
                                            style={{
                                                ...styles.formInput,
                                                fontFamily: 'Consolas, Monaco, monospace',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.6'
                                            }}
                                            value={editingArticle.content || ''}
                                            onChange={e => setEditingArticle({...editingArticle, content: e.target.value})}
                                        />
                                    </div>

                                    {/* BUTTONS */}
                                    <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px'}}>
                                        <button
                                            type="button"
                                            onClick={() => { setEditingArticle(null); setAiTopicInput(''); }}
                                            style={{
                                                ...styles.secondaryButton,
                                                padding: '10px 20px',
                                                margin: 0
                                            }}
                                        >
                                            取消 (Cancel)
                                        </button>
                                        <button
                                            type="submit"
                                            style={{
                                                ...styles.button,
                                                padding: '10px 25px',
                                                margin: 0,
                                                background: 'linear-gradient(90deg, #d4af37 0%, #aa8412 100%)',
                                                borderColor: '#d4af37'
                                            }}
                                        >
                                            💾 保存文章 (Save Article)
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: 5. SETTING & PIXEL (Requirement 3 - Only keep FB Pixel and Google Analytics Pixel, Cancel any home page settings here) */}
            {activeTab === 'settings' && (
                <div style={{...styles.glassPanel, maxWidth: '850px', margin: '0 auto', padding: '2.5rem', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                    <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '10px', marginBottom: '20px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                        <i className="fas fa-chart-line" style={{marginRight: '10px'}}></i>
                        SETTING & PIXEL (网站监控配置)
                    </h3>
                    <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                        配置并装配您的 Google Analytics (GTAG) 以及 Facebook-Meta API 追踪像素，为市场引流提供数据赋能。其他系统级设置在此处一律剔除。
                    </p>

                    <form onSubmit={handleSaveSettings} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        
                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>GOOGLE ANALYTICS / GTAG ID</label>
                            <input 
                                type="text" 
                                placeholder="例如: G-XXXXXXXXXX" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.googlePixelId || ''} 
                                onChange={e => setSettings({...settings, googlePixelId: e.target.value})} 
                            />
                            <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>输入您的全局谷歌流量监控 ID，以便系统收集转化反馈。</span>
                        </div>

                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>FACEBOOK PIXEL ID (Meta 像素代号)</label>
                            <input 
                                type="text" 
                                placeholder="例如: 1234567890" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.facebookPixelId || ''} 
                                onChange={e => setSettings({...settings, facebookPixelId: e.target.value})} 
                            />
                            <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>Meta广告精准归因像素代号。</span>
                        </div>

                        {settingsStatus === 'success' && (
                            <div style={{padding: '12px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-check-circle" style={{marginRight: '8px'}}></i> Google & Facebook 流量分析像素参数已保存更新！
                            </div>
                        )}
                        {settingsStatus === 'error' && (
                            <div style={{padding: '12px', background: 'rgba(231,76,60,0.15)', color: '#ff4d4d', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-times-circle" style={{marginRight: '8px'}}></i> 保存失败，请检查网络后台连接。
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isSavingSettings}
                            style={{...styles.button, width: '100%', marginTop: '10px', fontFamily: '"Space Grotesk", sans-serif'}}
                        >
                            {isSavingSettings ? "Saving Settings..." : "保存像素监控参数 (Save Pixels)"}
                        </button>
                    </form>
                </div>
            )}

            {/* TAB CONTENT: 6. PAYMENTS CONFIG (Requirement 4 - Separate Payments Setup for PayPal & Stripe Credit Card integrations) */}
            {activeTab === 'payments' && (
                !isSecondarilyVerified ? (
                    renderSecondaryVerification('收款设置 (Payments Setup)')
                ) : (
                <div style={{...styles.glassPanel, maxWidth: '850px', margin: '0 auto', padding: '2.5rem', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                    <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '10px', marginBottom: '20px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                        <i className="fas fa-wallet" style={{marginRight: '10px'}}></i>
                        收款设置 (Payment Gateways Setup)
                    </h3>
                    <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                        管理前台玄学解签或福物采购所需的底层资金流收取通道。在这里可以自定义 PayPal 沙盒和 Stripe 信用卡的网关秘钥。
                    </p>

                    <form onSubmit={handleSaveSettings} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        
                        {/* PayPal Container */}
                        <div style={{background: 'rgba(102, 192, 244, 0.02)', border: '1px solid rgba(102, 192, 244, 0.15)', padding: '20px', borderRadius: '4px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <span style={{color: '#fff', fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif'}}><i className="fab fa-paypal" style={{color: '#66c0f4', marginRight: '8px'}}></i>PayPal Checkout 收款开关</span>
                                <input 
                                    type="checkbox" 
                                    checked={!!settings.paypalEnabled} 
                                    onChange={e => setSettings({...settings, paypalEnabled: e.target.checked})} 
                                    style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: theme.accent}}
                                />
                            </div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>PAYPAL CLIENT ID (沙盒或线上生产商号)</label>
                            <input 
                                type="text" 
                                placeholder="输入 PayPal Client 客户端凭证代码" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.paypalClientId || ''} 
                                onChange={e => setSettings({...settings, paypalClientId: e.target.value})} 
                                disabled={!settings.paypalEnabled}
                            />
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginTop: '10px', marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>PAYPAL CLIENT SECRET (商户客户端密钥)</label>
                            <input 
                                type="password" 
                                placeholder="输入 PayPal Client Secret 客户端密钥" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.paypalClientSecret || ''} 
                                onChange={e => setSettings({...settings, paypalClientSecret: e.target.value})} 
                                disabled={!settings.paypalEnabled}
                            />
                        </div>

                        {/* Credit Card Gateway Router */}
                        <div style={{background: 'rgba(102, 192, 244, 0.04)', border: '1px solid rgba(102, 192, 244, 0.3)', padding: '20px', borderRadius: '4px', marginTop: '10px'}}>
                            <label style={{display: 'block', fontSize: '0.9rem', color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-random" style={{color: theme.accent, marginRight: '8px'}}></i>
                                默认信用卡收款通道 (Active Credit Card Processor)
                            </label>
                            <p style={{color: '#aaa', fontSize: '0.8rem', margin: '0 0 12px 0'}}>
                                当用户在前台选择信用卡支付时，系统底层的资金结算通道（Stripe 或者是空中云汇 Airwallex）。
                            </p>
                            <select 
                                value={settings.creditCardProcessor || 'stripe'} 
                                onChange={e => setSettings({...settings, creditCardProcessor: e.target.value})}
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}}
                            >
                                <option value="stripe">Stripe 收款通道 (默认)</option>
                                <option value="airwallex">空中云汇 Airwallex 收款通道</option>
                            </select>
                        </div>

                        {/* Credit Card Stripe Container */}
                        <div style={{background: 'rgba(102, 192, 244, 0.02)', border: '1px solid rgba(102, 192, 244, 0.15)', padding: '20px', borderRadius: '4px', marginTop: '10px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <span style={{color: '#fff', fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif'}}><i className="fab fa-stripe" style={{color: '#6772e5', marginRight: '8px'}}></i>Stripe 信用卡收款开关</span>
                                <input 
                                    type="checkbox" 
                                    checked={!!settings.stripeEnabled} 
                                    onChange={e => setSettings({...settings, stripeEnabled: e.target.checked})} 
                                    style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: theme.accent}}
                                />
                            </div>
                            <p style={{color: '#888', fontSize: '0.78rem', margin: '-10px 0 15px 0'}}>
                                提示：如果在此处留空，系统将默认读取服务器环境变量 <code>STRIPE_PUBLIC_KEY</code> 及 <code>STRIPE_SECRET_KEY</code>。
                            </p>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>STRIPE PUBLIC KEY (网页前端公钥 pk_...)</label>
                            <input 
                                type="text" 
                                placeholder="输入 Stripe 网页公钥 (留空将读取环境变量)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.stripePublicKey || ''} 
                                onChange={e => setSettings({...settings, stripePublicKey: e.target.value})} 
                                disabled={!settings.stripeEnabled}
                            />
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginTop: '10px', marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>STRIPE SECRET KEY (服务端私钥 sk_...)</label>
                            <input 
                                type="password" 
                                placeholder="输入 Stripe 服务端私钥 (留空将读取环境变量)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.stripeSecretKey || ''} 
                                onChange={e => setSettings({...settings, stripeSecretKey: e.target.value})} 
                                disabled={!settings.stripeEnabled}
                            />
                        </div>

                        {/* Credit Card Airwallex Container */}
                        <div style={{background: 'rgba(102, 192, 244, 0.02)', border: '1px solid rgba(102, 192, 244, 0.15)', padding: '20px', borderRadius: '4px', marginTop: '10px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                                <span style={{color: '#fff', fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif'}}><i className="fas fa-globe" style={{color: '#25ccd6', marginRight: '8px'}}></i>空中云汇 Airwallex 信用卡收款开关</span>
                                <input 
                                    type="checkbox" 
                                    checked={!!settings.airwallexEnabled} 
                                    onChange={e => setSettings({...settings, airwallexEnabled: e.target.checked})} 
                                    style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: theme.accent}}
                                />
                            </div>
                            <p style={{color: '#888', fontSize: '0.78rem', margin: '-10px 0 15px 0'}}>
                                提示：如果在此处留空，系统将默认读取服务器环境变量 <code>AIRWALLEX_CLIENT_ID</code>、<code>AIRWALLEX_API_KEY</code> 及 <code>AIRWALLEX_CLIENT_KEY</code>。
                            </p>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>AIRWALLEX CLIENT ID (空中云汇商户客户端 ID)</label>
                            <input 
                                type="text" 
                                placeholder="输入 Airwallex Client ID (留空将读取环境变量)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.airwallexClientId || ''} 
                                onChange={e => setSettings({...settings, airwallexClientId: e.target.value})} 
                                disabled={!settings.airwallexEnabled}
                            />
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginTop: '10px', marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>AIRWALLEX API KEY (结算 API 凭证密钥)</label>
                            <input 
                                type="password" 
                                placeholder="输入 Airwallex API Key (留空将读取环境变量)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.airwallexApiKey || ''} 
                                onChange={e => setSettings({...settings, airwallexApiKey: e.target.value})} 
                                disabled={!settings.airwallexEnabled}
                            />
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginTop: '10px', marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>AIRWALLEX CLIENT KEY (网页前端 JavaScript 公钥)</label>
                            <input 
                                type="text" 
                                placeholder="输入 Airwallex Client Key (留空将读取环境变量)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.airwallexClientKey || ''} 
                                onChange={e => setSettings({...settings, airwallexClientKey: e.target.value})} 
                                disabled={!settings.airwallexEnabled}
                            />
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, marginTop: '10px', marginBottom: '5px', fontWeight: '500', fontFamily: '"Space Grotesk", sans-serif'}}>AIRWALLEX ENVIRONMENT (云汇环境模式)</label>
                            <select 
                                value={settings.airwallexMode || 'sandbox'} 
                                onChange={e => setSettings({...settings, airwallexMode: e.target.value})}
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}}
                                disabled={!settings.airwallexEnabled}
                            >
                                <option value="sandbox">Sandbox (沙盒测试测试环境)</option>
                                <option value="production">Production (生产线上正式结算)</option>
                            </select>
                        </div>

                        {settingsStatus === 'success' && (
                            <div style={{padding: '12px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-check-circle" style={{marginRight: '8px'}}></i> 收款网关密钥设置保存成功！
                            </div>
                        )}
                        {settingsStatus === 'error' && (
                            <div style={{padding: '12px', background: 'rgba(231,76,60,0.15)', color: '#ff4d4d', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-times-circle" style={{marginRight: '8px'}}></i> 保存失败，请检查网络后台连接。
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isSavingSettings}
                            style={{...styles.button, width: '100%', marginTop: '10px', fontFamily: '"Space Grotesk", sans-serif'}}
                        >
                            {isSavingSettings ? "Saving Pay Creds..." : "保存收款网关配置 (Save Payment Config)"}
                        </button>
                    </form>
                </div>
                )
            )}

            {/* TAB CONTENT: 7. AI CONFIG */}
            {activeTab === 'ai' && (
                !isSecondarilyVerified ? (
                    renderSecondaryVerification('AI配置 (AI Config)')
                ) : (
                <div style={{...styles.glassPanel, maxWidth: '850px', margin: '0 auto', padding: '2.5rem', borderColor: 'rgba(102, 192, 244, 0.2)'}}>
                    <h3 style={{color: theme.accent, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.4rem', borderBottom: `1px solid rgba(102, 192, 244, 0.2)`, paddingBottom: '10px', marginBottom: '20px', textShadow: '0 0 8px rgba(102, 192, 244, 0.2)'}}>
                        <i className="fas fa-robot" style={{marginRight: '10px'}}></i>
                        AI 模型配置 (AI Engine Configuration)
                    </h3>
                    <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: '"Space Grotesk", sans-serif'}}>
                        配置并装配您的语言推理大模型 (Text Model) 与 绘图大模型 (Image Model) 的秘钥与服务商。如果没有设置特定的 API 密钥，系统将自动读取服务器后台的环境变量 (Environment Variables)。
                    </p>

                    <form onSubmit={handleSaveSettings} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        
                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                语言推理模型服务商 (Text Reasoning Model Provider)
                            </label>
                            <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                                {['Google', 'OpenAI', 'DeepSeek'].map(p => (
                                    <button 
                                        type="button"
                                        key={p} 
                                        onClick={() => setSettings({...settings, textProvider: p})}
                                        style={{
                                            flex: 1, padding: '10px', 
                                            background: (settings.textProvider || 'Google') === p ? 'linear-gradient(90deg, #47BFFF 0%, #1A44C2 100%)' : 'transparent',
                                            color: '#fff',
                                            border: `1px solid rgba(102, 192, 244, 0.4)`, cursor: 'pointer', borderRadius: '4px',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s'
                                        }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                GOOGLE GEMINI API KEY (Google 秘钥)
                            </label>
                            <input 
                                type="password" 
                                placeholder="留空则读取环境变量 GEMINI_API_KEY (如 AIzaSy...)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.googleKey || ''} 
                                onChange={e => setSettings({...settings, googleKey: e.target.value})} 
                            />
                            <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>
                                用于运行高精度面相/手相命运解析、五行命理排盘分析的主力大模型。
                            </span>
                        </div>

                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                OPENAI API KEY (OpenAI 秘钥)
                            </label>
                            <input 
                                type="password" 
                                placeholder="留空则读取环境变量 OPENAI_API_KEY (如 sk-...)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.openaiKey || ''} 
                                onChange={e => setSettings({...settings, openaiKey: e.target.value})} 
                            />
                            <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>
                                用于 OpenAI 语言模型。
                            </span>
                        </div>

                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                DEEPSEEK API KEY (DeepSeek 秘钥)
                            </label>
                            <input 
                                type="password" 
                                placeholder="留空则读取环境变量 DEEPSEEK_API_KEY (如 sk-...)" 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.deepseekKey || ''} 
                                onChange={e => setSettings({...settings, deepseekKey: e.target.value})} 
                            />
                            <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>
                                用于 DeepSeek 语言模型。
                            </span>
                        </div>

                        <div>
                            <label style={{display: 'block', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif'}}>
                                绘图引擎服务商 (Image Generation Model)
                            </label>
                            <select 
                                style={{...styles.formInput, fontFamily: '"Space Grotesk", sans-serif'}} 
                                value={settings.imageProvider || 'Pollinations'} 
                                onChange={e => setSettings({...settings, imageProvider: e.target.value})}
                            >
                                <option value="Pollinations">Pollinations AI (默认 - 免费高速且支持鲁棒失败重试)</option>
                                <option value="DALL-E">DALL-E 3 (OpenAI)</option>
                                <option value="Sora2">Sora 2 (Video/Image Model)</option>
                            </select>
                            <span style={{fontSize: '0.75rem', color: '#888', fontFamily: '"Space Grotesk", sans-serif'}}>
                                确定用于前台福星福缘或专属祥瑞绘图生成的 AI 引擎。
                            </span>
                        </div>

                        {settingsStatus === 'success' && (
                            <div style={{padding: '12px', background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-check-circle" style={{marginRight: '8px'}}></i> AI 模型与密钥配置保存成功！
                            </div>
                        )}
                        {settingsStatus === 'error' && (
                            <div style={{padding: '12px', background: 'rgba(231,76,60,0.15)', color: '#ff4d4d', fontSize: '0.9rem', borderRadius: '4px', textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif'}}>
                                <i className="fas fa-times-circle" style={{marginRight: '8px'}}></i> 保存失败，请检查网络后台连接。
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isSavingSettings}
                            style={{...styles.button, width: '100%', marginTop: '10px', fontFamily: '"Space Grotesk", sans-serif'}}
                        >
                            {isSavingSettings ? "Saving AI Config..." : "保存 AI 配置 (Save AI Config)"}
                        </button>
                    </form>
                </div>
                )
            )}

            {/* SECURITY & DOMAIN PROTECTION TAB */}
            {activeTab === 'security' && (
                <div style={styles.card}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(102, 192, 244, 0.2)', paddingBottom: '15px'}}>
                        <div>
                            <h3 style={{...styles.cardTitle, margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <i className="fas fa-shield-alt" style={{color: '#2ecc71'}}></i>
                                域名保护与全站安全防护 (Domain Security & Anti-Attack Protection)
                            </h3>
                            <p style={{color: '#aaa', fontSize: '0.85rem', margin: '5px 0 0 0'}}>
                                包含域名防恶意破解、防跨站盗链、暴力请求速率限制（Rate Limiting）、防网页抄袭与数据抓取保护。
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                setIsLoadingSecurity(true);
                                fetch(`${API_BASE_URL}/admin/security-status`)
                                    .then(res => res.json())
                                    .then(data => { setSecurityStatus(data); setIsLoadingSecurity(false); })
                                    .catch(() => setIsLoadingSecurity(false));
                            }}
                            style={{...styles.secondaryButton, padding: '6px 14px', fontSize: '0.85rem'}}
                        >
                            <i className="fas fa-sync-alt" style={{marginRight: '6px'}}></i> {isLoadingSecurity ? '刷新中...' : '刷新状态'}
                        </button>
                    </div>

                    {/* Status Overview Cards */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '25px'}}>
                        <div style={{background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '15px', borderRadius: '8px'}}>
                            <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>域名保护状态 (Domain Shield)</div>
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <i className="fas fa-check-circle"></i> 全面开启 (Active)
                            </div>
                        </div>

                        <div style={{background: 'rgba(71, 191, 255, 0.1)', border: '1px solid rgba(71, 191, 255, 0.3)', padding: '15px', borderRadius: '8px'}}>
                            <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>SSL 加密等级 (Transport Security)</div>
                            <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#47BFFF'}}>
                                🔒 256-Bit SSL / TLS 1.3
                            </div>
                        </div>

                        <div style={{background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '15px', borderRadius: '8px'}}>
                            <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>拦截恶意攻击次数 (Blocked Attacks)</div>
                            <div style={{fontSize: '1.4rem', fontWeight: 'bold', color: theme.gold}}>
                                {securityStatus?.totalBlockedAttacks || 0} 次
                            </div>
                        </div>

                        <div style={{background: 'rgba(155, 89, 182, 0.1)', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '15px', borderRadius: '8px'}}>
                            <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>监控 IP 活跃数 (Monitored IPs)</div>
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#9b59b6'}}>
                                {securityStatus?.activeTrackedIPs || 0} 个 IP
                            </div>
                        </div>
                    </div>

                    {/* Detailed Active Security Mechanisms */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px'}}>
                            <h4 style={{color: theme.gold, margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <i className="fas fa-network-wired"></i> 1. API 接口限流与防暴力破解 (Rate Limiting & Anti-Brute Force)
                            </h4>
                            <p style={{color: '#ccc', fontSize: '0.85rem', lineHeight: '1.6', margin: 0}}>
                                • <strong>登录与注册接口防护：</strong>单 IP 每分钟限制 30 次尝试，超过即自动触发 10 分钟防爆破冷冻。<br />
                                • <strong>通用 API 速率限制：</strong>单 IP 每分钟限制 120 次请求，有效防止黑客利用自动化脚本暴力扫描、碰撞或扒取网站数据。<br />
                                • <strong>输入注入过滤：</strong>自动拦截包含恶意 SQL 命令或脚本注入（XSS/SQLi）的非法 HTTP 请求载荷。
                            </p>
                        </div>

                        <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px'}}>
                            <h4 style={{color: theme.gold, margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <i className="fas fa-lock-open"></i> 2. 网页版权与防抓取防护 (Anti-Copy & Content Theft Protection)
                            </h4>
                            <p style={{color: '#ccc', fontSize: '0.85rem', lineHeight: '1.6', margin: 0}}>
                                • <strong>复制自动版权保护：</strong>当用户复制网站长文或玄学解读时，系统将自动附加【天机之眼 Domain Protection】官方授权声明与域名来源，防止盗用者直接抄袭文本。<br />
                                • <strong>图片防盗链与防拖拽：</strong>前台所有祥瑞福物、运势图谱禁止直接拖拽保存，并在前端拦截非法复制提示。<br />
                                • <strong>防恶意嵌套（Frame-Busting）：</strong>自动检测非法三方网站通过 Iframe 嵌套本站的行为，防止钓鱼镜像网站。
                            </p>
                        </div>

                        <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px'}}>
                            <h4 style={{color: theme.gold, margin: '0 0 10px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <i className="fas fa-server"></i> 3. 服务端 HTTP 安全响应头 (Active Security Response Headers)
                            </h4>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px'}}>
                                {(securityStatus?.securityHeaders || [
                                    'X-Domain-Protection',
                                    'X-Content-Type-Options',
                                    'X-Frame-Options',
                                    'X-XSS-Protection',
                                    'Referrer-Policy',
                                    'Permissions-Policy',
                                    'Strict-Transport-Security'
                                ]).map((hdr: string, idx: number) => (
                                    <span key={idx} style={{background: 'rgba(46, 204, 113, 0.15)', border: '1px solid rgba(46, 204, 113, 0.4)', color: '#2ecc71', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace'}}>
                                        ✓ {hdr}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Styles for Responsive Tabs & Flex Grids */}
            <style>{`
                @media (max-width: 900px) {
                    .responsive-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 600px) {
                    .admin-tabs {
                        justify-content: center;
                        width: 100%;
                        margin-top: 10px;
                    }
                    .admin-tabs button {
                        flex: 1 1 calc(50% - 10px);
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};
