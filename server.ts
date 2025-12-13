
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// =========================================================
// ⚙️ BACKEND CONFIGURATION
// =========================================================
const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.API_KEY || "YOUR_GOOGLE_API_KEY";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Choose Provider: 'Google' | 'OpenAI' | 'DeepSeek'
let CURRENT_PROVIDER = 'Google'; 

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large image uploads

// =========================================================
// 🗄️ MOCK DATABASE (In-Memory for Demo)
// In production, replace this with MongoDB, PostgreSQL, etc.
// =========================================================
const DB = {
    orders: [] as any[],
    userHistory: {} as Record<string, any[]>, // Key: userId, Value: Array of records
    users: [] as any[] // Mock User Table: { id, email, password (hashed in real app), name, authType }
};

// =========================================================
// 🧠 AI LOGIC
// =========================================================
async function callAI(prompt: string, base64Image?: string, config?: any) {
    // If client sends config, prioritize it (Demo Mode)
    const provider = config?.textProvider || CURRENT_PROVIDER;
    console.log(`[Backend] Processing AI Request via ${provider}...`);

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
    
    // Add logic for OpenAI / DeepSeek here if needed (similar to previous index.tsx implementation)
    // but running securely on the server.
    throw new Error("Provider not implemented in backend demo yet.");
}

// =========================================================
// 🚀 API ROUTES
// =========================================================

// --- AUTH ROUTES ---

// 1. Sign Up
app.post('/api/auth/signup', (req, res) => {
    const { email, password, name } = req.body;
    
    if (DB.users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = {
        id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        email,
        password, // In production, HASH this password!
        name: name || email.split('@')[0],
        authType: 'email'
    };
    
    DB.users.push(newUser);
    // Don't return password
    const { password: _, ...userSafe } = newUser;
    res.json({ success: true, user: userSafe });
});

// 2. Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = DB.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
});

// 3. Google Login (Mock)
app.post('/api/auth/google', (req, res) => {
    const { token, email, name } = req.body;
    // In production, verify the Google Token with Google's API libraries here.
    
    let user = DB.users.find(u => u.email === email);
    
    if (!user) {
        // Create new user if not exists
        user = {
            id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            email,
            name,
            authType: 'google'
        };
        DB.users.push(user);
    }

    const { password: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
});

// 4. Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    // In production, send real email with reset link.
    // Here we just simulate success.
    
    const user = DB.users.find(u => u.email === email);
    if (user) {
        console.log(`[Mock Email] Sending password reset to ${email}`);
    }
    
    // Always return success for security (prevent email enumeration)
    res.json({ success: true, message: "If account exists, email sent." });
});


// --- APP ROUTES ---

// 1. AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { prompt, image, userId, config, gender, name, birthDate, readingType, elements } = req.body;
        const resultText = await callAI(prompt, image, config);
        
        // Save to History DB if userId is provided
        if (userId) {
            if (!DB.userHistory[userId]) DB.userHistory[userId] = [];
            
            // Extract a summary or data for history
            const historyRecord = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                resultText: resultText,
                gender: gender,
                name: name,
                birthDate: birthDate,
                readingType: readingType,
                elements: elements,
                // In a real app, parse the JSON/result to extract elements/name
                summary: "AI Analysis Result" 
            };
            
            // Keep last 5 records
            DB.userHistory[userId].unshift(historyRecord);
            DB.userHistory[userId] = DB.userHistory[userId].slice(0, 5);
        }

        res.json({ text: resultText });
    } catch (error: any) {
        console.error("AI Error:", error);
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

// 3. Create Order Endpoint
app.post('/api/orders', (req, res) => {
    const order = req.body;
    order.id = `ORD-${Date.now().toString().slice(-6)}`;
    order.date = new Date().toLocaleDateString();
    order.status = 'paid'; // Assumed paid for this demo flow
    
    DB.orders.unshift(order);
    console.log(`[Backend] New Order Created: ${order.id}`);
    res.json({ success: true, orderId: order.id });
});

// 4. Get Orders Endpoint (Admin)
app.get('/api/admin/orders', (req, res) => {
    // In production, verify Admin Token here
    res.json(DB.orders);
});

// 5. Get User History Endpoint
app.get('/api/history/:userId', (req, res) => {
    const { userId } = req.params;
    const history = DB.userHistory[userId] || [];
    res.json(history);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
    console.log(`Current AI Provider: ${CURRENT_PROVIDER}`);
});
