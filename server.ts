
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Order, History, Product, HomepageConfig } from './models.js';

// =========================================================
// ⚙️ BACKEND CONFIGURATION
// =========================================================
const PORT = 3000;

async function seedHomepage() {
    const count = await HomepageConfig.countDocuments();
    if (count === 0) {
        const initialData = [
            { key: 'banner1', type: 'banner', title: 'Unlock Your Destiny', description: 'Discover the secrets hidden in your features with our advanced AI analysis.', imagePrompt: 'mystical feng shui landscape, ethereal lighting, ancient Chinese temple in mist, zen atmosphere, cinematic, 8k, soul healing colors', order: 1 },
            { key: 'banner2', type: 'banner', title: 'Harmonize Your Life', description: 'Balance your five elements and attract positive energy into your space.', imagePrompt: 'peaceful feng shui garden, zen stone path, flowing water, soft morning sunlight, mystical fog, 8k, healing vibes', order: 2 },
            { key: 'banner3', type: 'banner', title: 'Ancient Wisdom', description: 'Connect with the celestial rhythms and find your true path.', imagePrompt: 'cosmic bagua map in the night sky, glowing constellations, mystical observatory, ethereal energy, 8k, spiritual guidance', order: 3 },
            { key: 'fengshui', type: 'section', title: 'The Art of Energy', description: 'Feng Shui (风水) is the ancient Chinese philosophical system of harmonizing everyone with the surrounding environment.', imagePrompt: 'harmonious feng shui interior, balanced elements, zen living space with bamboo and water, 8k, peaceful energy', order: 4 },
            { key: 'face', type: 'section', title: 'The Mirror of the Soul', description: 'Physiognomy, or Mianxiang, is the ancient Chinese art of reading a person\'s character and future from their facial features.', imagePrompt: 'mystical face reading illustration, ethereal glowing facial features, soul reflection in water, 8k, spiritual insight', order: 5 },
            { key: 'palm', type: 'section', title: 'The Language of Palms', description: 'Palmistry, also known as Chiromancy, is the art of characterization and foretelling the future through the study of the palm.', imagePrompt: 'mystical palmistry, glowing destiny lines on a hand, ancient parchment background, 8k, divine knowledge', order: 6 },
            { key: 'wuxing', type: 'section', title: 'Balance of Five Elements', description: 'The Five Elements, or Wu Xing, are Wood, Fire, Earth, Metal, and Water.', imagePrompt: 'five elements cosmic balance, wood fire earth metal water symbols glowing, ethereal energy flow, 8k', order: 7 },
            { key: 'zodiac', type: 'section', title: 'Celestial Alignment', description: 'The study of celestial bodies and their influence on human affairs is a cornerstone of both Western and Eastern mysticism.', imagePrompt: 'chinese zodiac celestial wheel, glowing animal signs in the stars, mystical astrology, 8k, cosmic destiny', order: 8 },
        ];
        await HomepageConfig.insertMany(initialData);
        console.log("[Backend] Seeded initial homepage config.");
    }
}

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
            .then(() => {
                console.log("[Backend] Connected to MongoDB");
                seedHomepage();
            })
            .catch(err => console.error("[Backend] MongoDB Connection Error:", err));
    } else {
        console.warn("[Backend] MONGODB_URI not found. Database features will be limited.");
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

// 1. Save History Endpoint (Frontend calls AI, then saves result)
app.post('/api/history', async (req, res) => {
    try {
        const { userId, resultText, gender, name, birthDate, readingType, elements } = req.body;
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
            return res.json({ success: true });
        }
        res.status(400).json({ error: "User ID required" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Create Order Endpoint (Simplified)
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

// --- HOMEPAGE CONFIG ROUTES ---

// 1. Get Homepage Config
app.get('/api/homepage', async (req, res) => {
    try {
        const configs = await HomepageConfig.find().sort({ order: 1 });
        res.json(configs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Update Homepage Config (Admin)
app.post('/api/admin/homepage', async (req, res) => {
    const configData = req.body;
    try {
        if (Array.isArray(configData)) {
            for (const item of configData) {
                await HomepageConfig.findOneAndUpdate({ key: item.key }, item, { upsert: true });
            }
        } else {
            await HomepageConfig.findOneAndUpdate({ key: configData.key }, configData, { upsert: true });
        }
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
    });
}

startServer();
