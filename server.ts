
import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// =========================================================
// ⚙️ BACKEND CONFIGURATION
// =========================================================
const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.API_KEY || "YOUR_GOOGLE_API_KEY";

// Choose Provider: 'Google' | 'OpenAI' | 'DeepSeek'
let CURRENT_PROVIDER = 'Google'; 

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }) as any); // Allow large image uploads

// =========================================================
// 🗄️ FILE-BASED PERSISTENCE
// =========================================================
// Using process.cwd() is safer for varying execution environments (e.g. containers)
const DB_FILE = path.resolve(process.cwd(), 'database.json');

interface DatabaseSchema {
    users: any[];
    orders: any[];
    userHistory: Record<string, any[]>;
}

// Initial State
let DB: DatabaseSchema = {
    users: [],
    orders: [],
    userHistory: {}
};

// Load Data from File
const loadData = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, 'utf8');
            DB = JSON.parse(raw);
            console.log("[Backend] Database loaded successfully.");
        } else {
            console.log("[Backend] No database file found. Creating new one at", DB_FILE);
            saveData();
        }
    } catch (e) {
        console.error("[Backend] Error loading database:", e);
    }
};

// Save Data to File
const saveData = () => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(DB, null, 2));
    } catch (e) {
        console.error("[Backend] Error saving database:", e);
    }
};

// Initialize DB on startup
loadData();

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
app.post('/api/auth/signup', (req, res) => {
    loadData(); // Ensure fresh data
    const { email, password, name } = req.body;
    
    // 1. Validate Fields
    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required." });
    }

    // 2. Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    // 3. Validate Password Length
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    
    // 4. Check Duplicate
    if (DB.users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already registered." });
    }

    const newUser = {
        id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        email,
        password, // In production, HASH this password!
        name: name || email.split('@')[0],
        authType: 'email',
        // Persistence Fields
        isSubscribed: false,
        trialStartDate: new Date().toISOString(),
        hasPaidSingle: false,
        registeredAt: new Date().toISOString()
    };
    
    DB.users.push(newUser);
    saveData(); // Persist

    // Don't return password
    const { password: _, ...userSafe } = newUser;
    res.json({ success: true, user: userSafe });
});

// 2. Login
app.post('/api/auth/login', (req, res) => {
    loadData(); // Ensure fresh data
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ error: "Missing credentials." });

    const userByEmail = DB.users.find(u => u.email === email);
    
    if (!userByEmail) {
        // Return 404 for user not found with specific message code
        return res.status(404).json({ error: "Account not found.", code: 'USER_NOT_FOUND' });
    }

    if (userByEmail.password !== password) {
        return res.status(401).json({ error: "Invalid password.", code: 'INVALID_CREDENTIALS' });
    }

    const { password: _, ...userSafe } = userByEmail;
    res.json({ success: true, user: userSafe });
});

// 3. Google Login (Mock)
app.post('/api/auth/google', (req, res) => {
    loadData();
    const { token, email, name } = req.body;
    
    let user = DB.users.find(u => u.email === email);
    
    if (!user) {
        // Create new user if not exists
        user = {
            id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            email,
            name,
            authType: 'google',
            isSubscribed: false,
            trialStartDate: new Date().toISOString(),
            registeredAt: new Date().toISOString()
        };
        DB.users.push(user);
        saveData();
    }

    const { password: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
});

// 4. Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    // Simulate sending email
    console.log(`[Mock Email] Sending password reset to ${email}`);
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
            
            const historyRecord = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                resultText: resultText,
                gender: gender,
                name: name,
                birthDate: birthDate,
                readingType: readingType,
                elements: elements,
                summary: "AI Analysis Result" 
            };
            
            DB.userHistory[userId].unshift(historyRecord);
            DB.userHistory[userId] = DB.userHistory[userId].slice(0, 10); // Keep last 10
            saveData();
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
    loadData();
    const order = req.body;
    order.id = `ORD-${Date.now().toString().slice(-6)}`;
    order.date = new Date().toLocaleDateString();
    order.status = 'paid'; 
    
    DB.orders.unshift(order);

    // Sync Subscription if User Email matches
    if (order.email) {
        const userIndex = DB.users.findIndex(u => u.email === order.email);
        if (userIndex !== -1) {
            // Check if order items indicate a subscription
            const isSub = order.items.toLowerCase().includes('month') || order.items.toLowerCase().includes('year');
            const isSingle = order.items.toLowerCase().includes('single');

            if (isSub) {
                DB.users[userIndex].isSubscribed = true;
                console.log(`[Backend] User ${order.email} subscription activated.`);
            }
            if (isSingle) {
                DB.users[userIndex].hasPaidSingle = true;
            }
        }
    }

    saveData();
    console.log(`[Backend] New Order Created: ${order.id}`);
    res.json({ success: true, orderId: order.id });
});

// 4. Get Orders Endpoint (Admin)
app.get('/api/admin/orders', (req, res) => {
    loadData();
    res.json(DB.orders);
});

// 5. Get User History Endpoint
app.get('/api/history/:userId', (req, res) => {
    loadData();
    const { userId } = req.params;
    const history = DB.userHistory[userId] || [];
    res.json(history);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
    console.log(`Current AI Provider: ${CURRENT_PROVIDER}`);
});
