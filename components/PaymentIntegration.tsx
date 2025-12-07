import React, { useEffect, useRef, useState } from 'react';
import { theme, styles } from '../theme';

// ==========================================
// CONFIGURATION - REPLACE WITH YOUR KEYS
// ==========================================
// For PayPal Sandbox, use 'test'. For production, get a Client ID from developer.paypal.com
const PAYPAL_CLIENT_ID = "test"; 

// For Stripe, get your Publishable Key from dashboard.stripe.com
// This is a generic test key provided in Stripe docs for testing.
const STRIPE_PUB_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx"; 
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

// --- PAYPAL INTEGRATION ---
export const PayPalButton = ({ amount, currency, description, onSuccess, onError }: PaymentProps) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
        // Check if script is already loaded
        if (window.paypal) {
            setSdkReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`;
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => setSdkReady(true);
        script.onerror = () => onError("Failed to load PayPal SDK");
        document.body.appendChild(script);

        return () => {
            // Cleanup not strictly necessary for single page apps usually, but good practice
        };
    }, [currency]);

    useEffect(() => {
        if (sdkReady && window.paypal && paypalRef.current) {
            // Clear container first to prevent duplicates
            paypalRef.current.innerHTML = "";

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
                    console.error(err);
                    onError(err);
                }
            }).render(paypalRef.current);
        }
    }, [sdkReady, amount, description]);

    return (
        <div style={{ marginTop: '20px' }}>
            <div ref={paypalRef}></div>
            {!sdkReady && <div style={{color: '#888', textAlign: 'center'}}>Loading PayPal...</div>}
        </div>
    );
};

// --- STRIPE INTEGRATION ---
export const StripePaymentForm = ({ amount, description, onSuccess, onError, t }: PaymentProps) => {
    const [stripe, setStripe] = useState<any>(null);
    const [elements, setElements] = useState<any>(null);
    const [cardElement, setCardElement] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.Stripe) {
            setError("Stripe JS not loaded");
            return;
        }
        
        const stripeInstance = window.Stripe(STRIPE_PUB_KEY);
        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);

        const card = elementsInstance.create('card', {
            style: {
                base: {
                    color: '#e0e0e0',
                    fontFamily: '"Noto Serif", serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    },
                    backgroundColor: 'transparent'
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });
        
        // Wait for ref to be available
        if(mountRef.current) {
            card.mount(mountRef.current);
            setCardElement(card);
        }

        return () => {
             card.destroy();
        };
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !cardElement) {
            setProcessing(false);
            return;
        }

        // 1. Create Payment Method (Client Side Tokenization)
        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: 'Mystic Face Customer', 
            },
        });

        if (result.error) {
            setError(result.error.message);
            setProcessing(false);
            onError(result.error);
        } else {
            // 2. SUCCESS (In a real backend app, you send result.paymentMethod.id to your server)
            console.log("Stripe Payment Method Created:", result.paymentMethod);
            
            // SIMULATING SERVER RESPONSE DELAY
            setTimeout(() => {
                 setProcessing(false);
                 onSuccess(result);
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', color: '#aaa', marginBottom: '8px', fontSize: '0.9rem'}}>Card Details</label>
                <div ref={mountRef} style={{
                    padding: '12px', 
                    border: `1px solid ${theme.darkGold}`, 
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.3)'
                }}></div>
            </div>
            
            {error && <div style={{color: '#fa755a', fontSize: '0.9rem', marginBottom: '15px'}}>{error}</div>}
            
            <button 
                type="submit" 
                disabled={!stripe || processing}
                style={{
                    ...styles.button, 
                    width: '100%', 
                    opacity: processing ? 0.7 : 1,
                    cursor: processing ? 'not-allowed' : 'pointer'
                }}
            >
                {processing ? t.processing : `${t.payNow} ($${amount})`}
            </button>
            <div style={{marginTop:'10px', fontSize:'0.7rem', color:'#666', textAlign:'center'}}>
                <i className="fas fa-lock"></i> Secured by Stripe
            </div>
        </form>
    );
};