
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
    // PayPal/Stripe logic can be added here if needed for backend calls
};

// --- PAYPAL INTEGRATION ---
export const PayPalButton = ({ amount, currency, description, onSuccess, onError, userId, planId }: PaymentProps & { userId?: string, planId?: string }) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const [sdkReady, setSdkReady] = useState(false);
    const SCRIPT_ID = "paypal-sdk-script-unique"; 

    useEffect(() => {
        if (document.getElementById(SCRIPT_ID)) {
            if (window.paypal) setSdkReady(true);
            else {
                const el = document.getElementById(SCRIPT_ID);
                if (el) el.addEventListener('load', () => setSdkReady(true));
            }
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}&components=buttons`;
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => setSdkReady(true);
        script.onerror = () => onError("Failed to load PayPal SDK");
        document.body.appendChild(script);
    }, [currency]);

    useEffect(() => {
        if (sdkReady && window.paypal && paypalRef.current) {
            const timer = setTimeout(() => {
                if (!paypalRef.current) return;
                paypalRef.current.innerHTML = ""; 

                try {
                    window.paypal.Buttons({
                        createOrder: async () => {
                            const res = await fetch('/api/paypal/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ amount, planId })
                            });
                            const data = await res.json();
                            return data.id;
                        },
                        onApprove: async (data: any) => {
                            const res = await fetch('/api/paypal/capture-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderId: data.orderID, userId })
                            });
                            const details = await res.json();
                            onSuccess(details);
                        },
                        style: {
                            layout: 'vertical',
                            color: 'gold',
                            shape: 'rect',
                            label: 'paypal'
                        },
                        onError: (err: any) => {
                            console.error("PayPal Error:", err);
                            onError(err);
                        }
                    }).render(paypalRef.current).catch((e: any) => {
                        console.error("PayPal render failed:", e);
                    });
                } catch (err) {
                    console.error("PayPal init exception:", err);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [sdkReady, amount, description, userId, planId]);

    return (
        <div style={{ marginTop: '20px' }}>
            <div ref={paypalRef} style={{ minHeight: '150px' }}></div>
            {!sdkReady && <div style={{color: theme.gold, textAlign: 'center', fontFamily: 'Cinzel, serif'}}>Loading PayPal...</div>}
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
