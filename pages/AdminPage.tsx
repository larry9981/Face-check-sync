
import React, { useState, useEffect } from 'react';
import { theme, styles } from '../theme';
import { Order } from '../types';

export const AdminPage = ({ t }: { t: any }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Fetch from Backend API instead of localStorage
        if (isAuthenticated) {
            // Assume API proxy is set up or relative path works
            const API_BASE_URL = "http://localhost:3000/api"; 
            
            fetch(`${API_BASE_URL}/admin/orders`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setOrders(data);
                })
                .catch(err => {
                    console.error("Failed to fetch orders:", err);
                    // Fallback to local storage for demo continuity if server missing
                    const stored = localStorage.getItem('mystic_all_orders');
                    if (stored) setOrders(JSON.parse(stored));
                });
        }
    }, [isAuthenticated]);

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
                    <button onClick={downloadCSV} style={{...styles.button, marginTop: 0, padding: '8px 15px', fontSize: '0.9rem', minWidth: 'auto'}}>
                        <i className="fas fa-file-excel" style={{marginRight: '8px'}}></i> {t.exportBtn || "Export CSV"}
                    </button>
                    <button onClick={handleLogout} style={{...styles.secondaryButton, marginTop: 0}}>Logout</button>
                </div>
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
        </div>
    );
};
