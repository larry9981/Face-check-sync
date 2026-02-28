
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { createServer as createViteServer } from 'vite';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import { User, Order, History } from './models';

// Lazy Stripe Init
let stripe: Stripe | null = null;
const getStripe = () => {
    if (!stripe && process.env.STRIPE_SECRET_KEY) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

// =========================================================
// ⚙️ BACKEND CONFIGURATION
// =========================================================
const PORT = 3000;
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "YOUR_GOOGLE_API_KEY";

// Choose Provider: 'Google' | 'OpenAI' | 'DeepSeek'
let CURRENT_PROVIDER = 'Google'; 

// --- SUBSCRIPTION EXPIRATION CHECKER ---
const checkSubscriptionStatus = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        if (user && user.isSubscribed && user.nextBillingDate) {
            const now = new Date();
            if (now > user.nextBillingDate) {
                if (user.cancelAtPeriodEnd) {
                    // Subscription expired and was canceled
                    user.isSubscribed = false;
                    user.subscriptionStatus = 'expired';
                    user.subscriptionPlan = 'free';
                    await user.save();
                    console.log(`[Backend] Subscription for ${email} has expired.`);
                } else {
                    // Simulate Auto-Renewal
                    const next = new Date(user.nextBillingDate);
                    if (user.subscriptionPlan === 'monthly') next.setMonth(next.getMonth() + 1);
                    if (user.subscriptionPlan === 'yearly') next.setFullYear(next.getFullYear() + 1);
                    
                    user.nextBillingDate = next;
                    await user.save();
                    console.log(`[Backend] Subscription for ${email} auto-renewed until ${next.toLocaleDateString()}.`);
                }
            }
        }
    } catch (err) {
        console.error("Error checking subscription status:", err);
    }
};

async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: '50mb' }) as any);

    // =========================================================
    // 🗄️ MONGODB CONNECTION
    // =========================================================
    const MONGODB_URI = process.env.MONGODB_URI;
    if (MONGODB_URI) {
        mongoose.connect(MONGODB_URI)
            .then(() => console.log("[Backend] Connected to MongoDB"))
            .catch(err => console.error("[Backend] MongoDB Connection Error:", err));
    } else {
        console.warn("[Backend] MONGODB_URI not found. Database features will be limited.");
    }

// =========================================================
// 🧠 AI LOGIC
// =========================================================
async function callAI(prompt: string, base64Image?: string, config?: any) {
    const provider = config?.textProvider || CURRENT_PROVIDER;
    
    if (provider === 'Google') {
        const apiKey = config?.googleKey || GOOGLE_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    base64Image ? { inlineData: { mimeType: 'image/jpeg', data: base64Image } } : null,
                    { text: prompt }
                ].filter(Boolean) as any
            },
            config: { safetySettings }
        });
        return response.text;
    } 
    
    throw new Error("Provider not implemented in backend demo yet.");
}

// =========================================================
// 🚀 API ROUTES
// =========================================================

// --- AUTH ROUTES ---

// 1. Sign Up
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) return res.status(400).json({ error: "Email and Password are required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format." });

    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            name: name || email.split('@')[0],
            authType: 'email'
        });
        
        await newUser.save();
        const userObj = newUser.toObject();
        const userSafe = { ...userObj, id: userObj._id.toString() };
        delete (userSafe as any).password;
        res.json({ success: true, user: userSafe });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing credentials." });

    try {
        await checkSubscriptionStatus(email);
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Account not found.", code: 'USER_NOT_FOUND' });

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) return res.status(401).json({ error: "Invalid password.", code: 'INVALID_CREDENTIALS' });

        const userObj = user.toObject();
        const userSafe = { ...userObj, id: userObj._id.toString() };
        delete (userSafe as any).password;
        res.json({ success: true, user: userSafe });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 3. Google Login
app.post('/api/auth/google', async (req, res) => {
    const { token, email: providedEmail, name: providedName } = req.body;
    let email = providedEmail;
    let name = providedName;

    if (token && token !== 'mock_google_token' && process.env.GOOGLE_CLIENT_ID) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (payload) {
                email = payload.email;
                name = payload.name;
            }
        } catch (err) {
            return res.status(401).json({ error: "Invalid Google token." });
        }
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name, authType: 'google' });
            await user.save();
        }
        const userObj = user.toObject();
        const userSafe = { ...userObj, id: userObj._id.toString() };
        delete (userSafe as any).password;
        res.json({ success: true, user: userSafe });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    console.log(`[Mock Email] Sending password reset to ${email}`);
    res.json({ success: true, message: "If account exists, email sent." });
});

// --- APP ROUTES ---

// 1. AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { prompt, image, userId, config, gender, name, birthDate, readingType, elements, email } = req.body;
        if (email) await checkSubscriptionStatus(email);
        
        const resultText = await callAI(prompt, image, config);
        
        if (userId) {
            const historyRecord = new History({
                userId,
                resultText,
                gender,
                name,
                birthDate,
                readingType,
                elements,
                summary: "AI Analysis Result" 
            });
            await historyRecord.save();
        }
        res.json({ text: resultText });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// 2. Translation Endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang, config } = req.body;
        const prompt = `Translate the following markdown text to ${targetLang}. Preserve all formatting, emojis, and headers exactly. Text:\n\n${text}`;
        const translatedText = await callAI(prompt, undefined, config);
        res.json({ text: translatedText });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Create Order Endpoint (Updated for Subscriptions)
app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    try {
        const newOrder = new Order({ ...orderData, orderId });
        await newOrder.save();

        if (orderData.email) {
            const items = orderData.items.toLowerCase();
            const isMonthly = items.includes('month');
            const isYearly = items.includes('year');
            const isSingle = items.includes('single');

            const update: any = {};
            if (isMonthly || isYearly) {
                update.isSubscribed = true;
                update.subscriptionPlan = isMonthly ? 'monthly' : 'yearly';
                update.subscriptionStatus = 'active';
                update.cancelAtPeriodEnd = false;
                
                // Set next billing date
                const now = new Date();
                if (isMonthly) now.setMonth(now.getMonth() + 1);
                if (isYearly) now.setFullYear(now.getFullYear() + 1);
                update.nextBillingDate = now;
            }
            if (isSingle) update.hasPaidSingle = true;

            if (Object.keys(update).length > 0) {
                await User.findOneAndUpdate({ email: orderData.email }, update);
            }
        }
        res.json({ success: true, orderId });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Cancel Subscription
app.post('/api/subscription/cancel', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const stripeInstance = getStripe();
        if (user.stripeSubscriptionId && stripeInstance) {
            // Cancel in Stripe (at period end)
            await stripeInstance.subscriptions.update(user.stripeSubscriptionId, {
                cancel_at_period_end: true
            });
        }

        // Update local DB
        user.cancelAtPeriodEnd = true;
        user.subscriptionStatus = 'canceled';
        await user.save();
        
        const userObj = user.toObject();
        const userSafe = { ...userObj, id: userObj._id.toString() };
        delete (userSafe as any).password;
        
        res.json({ success: true, user: userSafe });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Get Subscription Details
app.get('/api/subscription/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json({
            plan: user.subscriptionPlan,
            status: user.subscriptionStatus,
            nextBillingDate: user.nextBillingDate,
            cancelAtPeriodEnd: user.cancelAtPeriodEnd,
            isSubscribed: user.isSubscribed
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- STRIPE PAYMENTS ---

// 1. Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    const { priceId, email, userId, planType } = req.body;
    const stripeInstance = getStripe();
    
    if (!stripeInstance) {
        return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
        const session = await stripeInstance.checkout.sessions.create({
            customer_email: email,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: planType === 'single' ? 'payment' : 'subscription',
            success_url: `${req.headers.origin}/?payment=success`,
            cancel_url: `${req.headers.origin}/?payment=cancel`,
            client_reference_id: userId,
            metadata: { planType, email }
        });
        res.json({ url: session.url });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Stripe Webhook (Sync Payment Status)
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }) as any, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripeInstance = getStripe();
    
    if (!stripeInstance || !sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(400).send('Webhook Error: Missing config');
    }

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const email = session.metadata.email;
        const planType = session.metadata.planType;

        const update: any = { isSubscribed: true };
        if (planType === 'monthly') update.subscriptionPlan = 'monthly';
        if (planType === 'yearly') update.subscriptionPlan = 'yearly';
        
        if (planType === 'single') {
            update.isSubscribed = false;
            update.hasPaidSingle = true;
        } else {
            update.subscriptionStatus = 'active';
            update.stripeSubscriptionId = session.subscription;
            update.stripeCustomerId = session.customer;
            // Set initial billing date
            const now = new Date();
            if (planType === 'monthly') now.setMonth(now.getMonth() + 1);
            if (planType === 'yearly') now.setFullYear(now.getFullYear() + 1);
            update.nextBillingDate = now;
        }

        await User.findOneAndUpdate({ email }, update);
        
        const orderId = `STRIPE-${Date.now()}`;
        const newOrder = new Order({
            orderId,
            email,
            items: planType,
            amount: session.amount_total / 100,
            status: 'paid'
        });
        await newOrder.save();
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as any;
        const status = subscription.status;
        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        
        const update: any = {
            subscriptionStatus: status === 'active' ? 'active' : 'expired',
            isSubscribed: status === 'active',
            cancelAtPeriodEnd: cancelAtPeriodEnd
        };

        if (status === 'active') {
            update.nextBillingDate = new Date(subscription.current_period_end * 1000);
        }

        await User.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, update);
    }

    res.json({ received: true });
});

// 4. Get Orders Endpoint (Admin)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get User History Endpoint
app.get('/api/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const history = await History.find({ userId }).sort({ date: -1 }).limit(10);
        res.json(history);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

    // Start Server
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        // In production, serve static files from dist
        const distPath = path.resolve(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(distPath, 'index.html'));
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend Server running on http://0.0.0.0:${PORT}`);
        console.log(`Current AI Provider: ${CURRENT_PROVIDER}`);
    });
}

startServer();
