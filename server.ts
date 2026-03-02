
import express from 'express';
import cors from 'cors';
import path from 'path';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Order, History, Product } from './models.js';

// =========================================================
// ⚙️ BACKEND CONFIGURATION
// =========================================================
const PORT = 3000;
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "YOUR_GOOGLE_API_KEY";

// Choose Provider: 'Google' | 'OpenAI' | 'DeepSeek'
let CURRENT_PROVIDER = 'Google'; 

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
        const { prompt, image, userId, config, gender, name, birthDate, readingType, elements } = req.body;
        
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

// 3. Create Order Endpoint (Simplified)
app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    try {
        const newOrder = new Order({ ...orderData, orderId });
        await newOrder.save();
        res.json({ success: true, orderId });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
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

// --- PRODUCT ROUTES ---

// 1. Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Create/Update Product (Admin)
app.post('/api/admin/products', async (req, res) => {
    const productData = req.body;
    try {
        if (!productData.id) productData.id = `PROD-${Date.now()}`;
        
        const product = await Product.findOneAndUpdate(
            { id: productData.id },
            productData,
            { upsert: true, new: true }
        );
        res.json(product);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete Product (Admin)
app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id });
        res.json({ success: true });
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
