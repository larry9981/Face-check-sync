
import React, { useEffect, useRef, useState } from 'react';
import { theme, styles } from '../theme';

// ==========================================
// CONFIGURATION - REPLACE WITH YOUR KEYS
// ==========================================
// For PayPal Sandbox, use 'test'. For production, get a Client ID from developer.paypal.com
const PAYPAL_CLIENT_ID = "test"; 

// For Stripe, get your Publishable Key from dashboard.stripe.com
const STRIPE_PUB_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx"; 

// IMPORTANT: Real WeChat/Alipay requires a Backend Server.
// Set this to FALSE when you have your backend ready.
const USE_MOCK_BACKEND = true; 
const API_BASE_URL = "/api/payment"; // Your real backend URL
// ==========================================

declare global {
    interface Window {
        paypal: any;
        Stripe: any;
    }
}

interface PaymentProps {
    amount: number;
    currency: string;
    description: string;
    shippingAddress?: {
        name: string;
        address: string;
        city: string;
        zip: string;
        country: string;
    };
    onSuccess: (details: any) => void;
    onError: (err: any) => void;
    t: any;
}

// --- PAYMENT SERVICE (API CLIENT) ---
const PaymentService = {
    // 1. Create Order: Calls backend to get the QR Code URL (code_url for WeChat, qr_code for Alipay)
    createOrder: async (provider: 'wechat' | 'alipay', amount: number, description: string) => {
        if (USE_MOCK_BACKEND) {
            // SIMULATION
            return new Promise<{orderId: string, qrUrl: string}>((resolve) => {
                setTimeout(() => {
                    resolve({
                        orderId: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        // This API generates a QR code image for the URL. In production, 'qrUrl' is the link returned by Alipay/WeChat
                        qrUrl: `https://example.com/pay/${provider}?amt=${amount}&t=${Date.now()}` 
                    });
                }, 800);
            });
        } else {
            // REAL BACKEND CALL
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, amount, description, currency: 'CNY' })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json(); // Expected: { orderId: "...", qrUrl: "weixin://..." }
        }
    },

    // 2. Check Status: Polls backend to see if user has scanned and paid
    checkStatus: async (orderId: string) => {
        if (USE_MOCK_BACKEND) {
            // SIMULATION: Randomly succeed
            return new Promise<string>((resolve) => {
                setTimeout(() => {
                    // 20% chance to succeed per poll for demo purposes
                    resolve(Math.random() > 0.8 ? 'paid' : 'pending');
                }, 400);
            });
        } else {
            // REAL BACKEND CALL
            const response = await fetch(`${API_BASE_URL}/status?orderId=${orderId}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            return data.status; // 'pending' | 'paid' | 'failed'
        }
    }
};

// --- WECHAT / ALIPAY QR CODE INTEGRATION ---
export const QRCodePayment = ({ provider, amount, description, t, onSuccess }: { provider: 'wechat' | 'alipay', amount: number, description?: string, t: any, onSuccess: () => void }) => {
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    const color = provider === 'wechat' ? '#2ecc71' : '#3498db';
    const icon = provider === 'wechat' ? 'fa-weixin' : 'fa-alipay';
    const title = provider === 'wechat' ? 'WeChat Pay' : 'Alipay';

    // 1. Initialize Order on Mount
    useEffect(() => {
        let isMounted = true;
        
        const initPayment = async () => {
            try {
                // Convert USD to CNY approx for display/logic (In real app, backend handles conversion)
                const cnyAmount = Math.round(amount * 7.2 * 100) / 100;
                
                const data = await PaymentService.createOrder(provider, cnyAmount, description || "Mystic Service");
                
                if (isMounted) {
                    setQrUrl(data.qrUrl);
                    setOrderId(data.orderId);
                    setStatus('ready');
                }
            } catch (err: any) {
                if (isMounted) {
                    setStatus('error');
                    setErrorMsg("Failed to connect to payment server.");
                    console.error("Payment Init Error:", err);
                }
            }
        };

        initPayment();

        return () => { isMounted = false; };
    }, [provider, amount, description]);

    // 2. Poll for Status
    useEffect(() => {
        if (status !== 'ready' || !orderId) return;

        const interval = setInterval(async () => {
            try {
                const payStatus = await PaymentService.checkStatus(orderId);
                if (payStatus === 'paid') {
                    setStatus('success');
                    clearInterval(interval);
                    setTimeout(onSuccess, 1500); // Wait a bit to show success tick
                }
            } catch (err) {
                console.warn("Polling failed", err);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [status, orderId, onSuccess]);

    return (
        <div style={{textAlign: 'center', padding: '20px', border: `1px solid ${theme.darkGold}`, borderRadius: '8px', background: 'rgba(255,255,255,0.05)'}}>
            <div style={{fontSize: '1.2rem', color: '#fff', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                <i className={`fab ${icon}`} style={{color: color, fontSize: '1.5rem'}}></i>
                <span style={{fontFamily: 'sans-serif'}}>{title}</span>
            </div>
            
            {status === 'loading' && (
                <div style={{padding: '40px'}}>
                    <i className="fas fa-circle-notch fa-spin" style={{color: theme.gold, fontSize: '2rem'}}></i>
                    <div style={{marginTop: '15px', color: '#aaa'}}>{t.processing || "Generating QR..."}</div>
                </div>
            )}

            {status === 'error' && (
                <div style={{padding: '20px', color: '#e74c3c'}}>
                    <i className="fas fa-exclamation-circle" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                    <div>{errorMsg || "System Busy"}</div>
                    <button onClick={() => window.location.reload()} style={{marginTop: '10px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '5px 10px', cursor: 'pointer'}}>Retry</button>
                </div>
            )}

            {status === 'ready' && qrUrl && (
                <div className="fade-in">
                    <div style={{background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '4px'}}>
                        {/* 
                            RENDER QR CODE 
                            In production, use a library like 'qrcode.react'.
                            Here we use a reliable API to render the QR string returned by backend.
                        */}
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`} 
                            alt={`${title} QR`} 
                            style={{width: '180px', height: '180px', display: 'block'}} 
                        />
                    </div>
                    
                    <div style={{marginTop: '15px', color: theme.gold, fontSize: '1.6rem', fontWeight: 'bold', fontFamily: 'sans-serif'}}>
                        ¥{(amount * 7.2).toFixed(2)}
                    </div>
                    
                    <div style={{marginTop: '10px', fontSize: '0.9rem', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                        <i className="fas fa-mobile-alt"></i>
                        {t.scanQRCode || "Please scan with App"}
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="fade-in" style={{padding: '30px'}}>
                    <i className="fas fa-check-circle" style={{color: '#2ecc71', fontSize: '3rem', marginBottom: '15px'}}></i>
                    <h3 style={{color: '#fff', margin: 0}}>{t.success || "Payment Successful!"}</h3>
                </div>
            )}
        </div>
    );
};

// --- PAYPAL INTEGRATION ---
export const PayPalButton = ({ amount, currency, description, onSuccess, onError }: PaymentProps) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const [sdkReady, setSdkReady] = useState(false);
    const SCRIPT_ID = "paypal-sdk-script-unique"; 

    useEffect(() => {
        // 1. Check if script is already present in DOM
        if (document.getElementById(SCRIPT_ID)) {
            if (window.paypal) {
                setSdkReady(true);
            } else {
                // Wait for existing script to load
                const el = document.getElementById(SCRIPT_ID);
                if (el) el.addEventListener('load', () => setSdkReady(true));
            }
            return;
        }

        // 2. Load the script only if not present
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}&components=buttons`;
        script.type = "text/javascript";
        script.async = true;
        
        script.onload = () => setSdkReady(true);
        script.onerror = () => {
             console.error("PayPal SDK failed to load");
             onError("Failed to load PayPal SDK");
        };
        
        document.body.appendChild(script);
    }, [currency]);

    useEffect(() => {
        if (sdkReady && window.paypal && paypalRef.current) {
            const timer = setTimeout(() => {
                if (!paypalRef.current) return;
                paypalRef.current.innerHTML = ""; 

                try {
                    window.paypal.Buttons({
                        createOrder: (data: any, actions: any) => {
                            return actions.order.create({
                                purchase_units: [{
                                    description: description,
                                    amount: {
                                        value: amount.toString()
                                    }
                                }]
                            });
                        },
                        onApprove: async (data: any, actions: any) => {
                            const order = await actions.order.capture();
                            onSuccess(order);
                        },
                        onError: (err: any) => {
                            console.error("PayPal internal error:", err);
                        }
                    }).render(paypalRef.current).catch((e: any) => {
                        console.error("PayPal button render failed:", e);
                    });
                } catch (err) {
                    console.error("PayPal init exception:", err);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [sdkReady, amount, description]);

    return (
        <div style={{ marginTop: '20px' }}>
            <div ref={paypalRef} style={{ minHeight: '150px' }}></div>
            {!sdkReady && <div style={{color: '#888', textAlign: 'center'}}>Loading PayPal...</div>}
        </div>
    );
};

// --- STRIPE INTEGRATION ---
export const StripePaymentForm = ({ amount, description, onSuccess, onError, t }: PaymentProps) => {
    const [stripe, setStripe] = useState<any>(null);
    const [elements, setElements] = useState<any>(null);
    const [cardNumber, setCardNumber] = useState<any>(null);
    const [cardExpiry, setCardExpiry] = useState<any>(null);
    const [cardCvc, setCardCvc] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    
    const cardNumberRef = useRef<HTMLDivElement>(null);
    const cardExpiryRef = useRef<HTMLDivElement>(null);
    const cardCvcRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.Stripe) {
            setError("Stripe JS not loaded");
            return;
        }
        const stripeInstance = window.Stripe(STRIPE_PUB_KEY);
        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);

        const style = {
            base: {
                color: '#e0e0e0',
                fontFamily: '"Noto Serif", serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
                backgroundColor: 'transparent'
            },
            invalid: { color: '#fa755a', iconColor: '#fa755a' }
        };

        const cardNum = elementsInstance.create('cardNumber', { style, showIcon: true });
        const cardExp = elementsInstance.create('cardExpiry', { style });
        const cardCvcEl = elementsInstance.create('cardCvc', { style });
        
        if(cardNumberRef.current) cardNum.mount(cardNumberRef.current);
        if(cardExpiryRef.current) cardExp.mount(cardExpiryRef.current);
        if(cardCvcRef.current) cardCvcEl.mount(cardCvcRef.current);

        setCardNumber(cardNum);
        setCardExpiry(cardExp);
        setCardCvc(cardCvcEl);

        return () => {
             cardNum.destroy();
             cardExp.destroy();
             cardCvcEl.destroy();
        };
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !cardNumber || !cardExpiry || !cardCvc) {
            setProcessing(false);
            return;
        }

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumber, 
            billing_details: { name: 'Mystic Face Customer' },
        });

        if (result.error) {
            setError(result.error.message);
            setProcessing(false);
            onError(result.error);
        } else {
            setTimeout(() => {
                 setProcessing(false);
                 onSuccess(result);
            }, 1000);
        }
    };

    const containerStyle = {
        padding: '10px 12px', 
        border: `1px solid ${theme.darkGold}`, 
        borderRadius: '4px',
        background: 'rgba(0,0,0,0.3)',
        marginBottom: '15px'
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div style={{marginBottom: '5px'}}>
                <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem'}}>{t.cardNumber}</label>
                <div ref={cardNumberRef} style={containerStyle}></div>
            </div>
            <div style={{display: 'flex', gap: '15px'}}>
                <div style={{flex: 1}}>
                    <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem'}}>{t.expiry}</label>
                    <div ref={cardExpiryRef} style={containerStyle}></div>
                </div>
                <div style={{flex: 1}}>
                    <label style={{display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem'}}>{t.cvc}</label>
                    <div ref={cardCvcRef} style={containerStyle}></div>
                </div>
            </div>
            {error && <div style={{color: '#fa755a', fontSize: '0.9rem', marginBottom: '15px'}}>{error}</div>}
            <button type="submit" disabled={!stripe || processing} style={{...styles.button, width: '100%', opacity: processing ? 0.7 : 1, cursor: processing ? 'not-allowed' : 'pointer'}}>
                {processing ? t.processing : `${t.payNow} ($${amount})`}
            </button>
            <div style={{marginTop:'10px', fontSize:'0.7rem', color:'#666', textAlign:'center'}}>
                <i className="fas fa-lock"></i> {t.secureStripe || "Secured by Stripe"}
            </div>
        </form>
    );
};
