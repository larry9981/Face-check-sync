import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import { User, Order, History, Product, HomepageConfig } from './models.js';

// =========================================================
// ⚙️ BACKEND CONFIGURATION
// =========================================================
const PORT = 3000;

// =========================================================
// 🗄️ LOCAL JSON DATABASE ADAPTER (LOCAL SERVER STORAGE & FALLBACKS)
// =========================================================
const LOCAL_DB_DIR = path.resolve(process.cwd(), 'local_db');
if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
}

function readJSONFile(filename: string, defaultData: any = []) {
    const filePath = path.join(LOCAL_DB_DIR, filename);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
        return defaultData;
    }
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        console.error(`Error reading database file: ${filename}`, e);
        return defaultData;
    }
}

function writeJSONFile(filename: string, data: any) {
    const filePath = path.join(LOCAL_DB_DIR, filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error(`Error writing database file: ${filename}`, e);
    }
}

const isMongoConnected = () => {
    return mongoose.connection.readyState === 1;
};

// Unified Database Helper
const DbHelper = {
    // --- USER ---
    findUserByEmail: async (email: string) => {
        if (isMongoConnected()) {
            try { return await User.findOne({ email }); } catch (e) { console.error("Mongo search user by email error:", e); }
        }
        const users = readJSONFile('users.json');
        return users.find((u: any) => u.email === email) || null;
    },
    findUserById: async (id: string) => {
        if (isMongoConnected()) {
            try { return await User.findById(id); } catch (e) { console.error("Mongo search user ID error:", e); }
        }
        const users = readJSONFile('users.json');
        const user = users.find((u: any) => u._id === id || u.id === id);
        return user ? { _id: user._id, ...user, toObject: () => user } : null;
    },
    createUser: async (userData: any) => {
        // We ALWAYS duplicate user registration metadata to local storage file to fulfill user request #1:
        // "所有用户注册信息需要保存到当地服务器上" (All user registration information needs to be saved to the local server).
        const users = readJSONFile('users.json');
        const _id = `u_${Date.now()}`;
        const finalUserData = { 
            _id, 
            id: _id, 
            registeredAt: new Date().toISOString(), 
            freeFaceRemaining: 3, 
            freePalmRemaining: 3, 
            ...userData 
        };
        users.push(finalUserData);
        writeJSONFile('users.json', users);

        if (isMongoConnected()) {
            try {
                const newUser = new User({ 
                    _id, 
                    freeFaceRemaining: 3, 
                    freePalmRemaining: 3, 
                    ...userData 
                });
                await newUser.save();
                return newUser;
            } catch (e) {
                console.error("Duplicate register error in Mongo. Swallowing as we saved to local file system:", e);
            }
        }
        return { _id, ...finalUserData, toObject: () => finalUserData };
    },
    updateUser: async (id: string, updateData: any) => {
        const users = readJSONFile('users.json');
        const index = users.findIndex((u: any) => u._id === id || u.id === id);
        let localUser = null;
        if (index !== -1) {
            users[index] = { ...users[index], ...updateData };
            writeJSONFile('users.json', users);
            localUser = users[index];
        }

        if (isMongoConnected()) {
            try {
                const user = await User.findByIdAndUpdate(id, updateData, { new: true });
                if (user) return user;
            } catch (e) { console.error("Mongo update profile error:", e); }
        }
        return localUser ? { _id: localUser._id, ...localUser, toObject: () => localUser } : null;
    },

    // --- HISTORY ---
    createHistory: async (historyData: any) => {
        const histories = readJSONFile('histories.json');
        const _id = `h_${Date.now()}`;
        const newHist = { _id, id: _id, date: new Date().toISOString(), ...historyData };
        histories.push(newHist);
        writeJSONFile('histories.json', histories);

        if (isMongoConnected()) {
            try {
                const hist = new History(historyData);
                await hist.save();
                return hist;
            } catch (e) { console.error("Mongo save history error:", e); }
        }
        return newHist;
    },
    getHistoriesByUser: async (userId: string) => {
        if (isMongoConnected()) {
            try { return await History.find({ userId }).sort({ date: -1 }).limit(10); } catch (e) { console.error("Mongo load history error:", e); }
        }
        const histories = readJSONFile('histories.json');
        return histories
            .filter((h: any) => h.userId === userId)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
    },

    // --- ORDERS ---
    createOrder: async (orderData: any) => {
        const orders = readJSONFile('orders.json');
        const _id = `o_${Date.now()}`;
        const newOrd = { _id, id: _id, date: new Date().toISOString(), ...orderData };
        orders.push(newOrd);
        writeJSONFile('orders.json', orders);

        if (isMongoConnected()) {
            try {
                const ord = new Order(orderData);
                await ord.save();
                return ord;
            } catch (e) { console.error("Mongo save order error:", e); }
        }
        return newOrd;
    },
    getOrdersByUser: async (userId: string, email?: string) => {
        if (isMongoConnected()) {
            try {
                const query: any = { $or: [{ userId: userId }] };
                if (email) query.$or.push({ email: email });
                return await Order.find(query).sort({ date: -1 });
            } catch (e) { console.error("Mongo load orders error:", e); }
        }
        const orders = readJSONFile('orders.json');
        return orders
            .filter((o: any) => o.userId === userId || (email && o.email === email))
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    getAllOrders: async () => {
        if (isMongoConnected()) {
            try { return await Order.find().sort({ date: -1 }); } catch (e) { console.error("Mongo load all orders error:", e); }
        }
        const orders = readJSONFile('orders.json');
        return orders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    // --- PRODUCTS ---
    getAllProducts: async () => {
        const defaultProd = [
              {
                id: 'prod-jade',
                nameKey: 'prod_jade_name',
                defaultName: 'Premium Lucky Jade Imperial Bracelet',
                price: '$49.99',
                numericPrice: 49.99,
                category: 'Bracelet',
                zodiac: 'Dragon, Rabbit',
                imagePrompt: 'ancient imperial jade bracelet on dark black silk cushion, mysterious golden highlights, editorial catalog photo, 8k',
                descKey: 'prod_jade_desc',
                defaultDescription: 'Attract immense fortune, harmony, and protective ancestral energies with this high-grade natural Hetian Jade bracelet.',
                imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600',
                element: 'Wood',
                sku: 'JDB-001',
                status: 'active',
                longDescription: 'This imperial-grade Jade bracelet is hand-threaded with genuine natural Hetian green jade beads. Each bead is selected for its purity and vibrant earthly luster. Styled perfectly to balance weak Wood energies and enhance personal fortune in year-round cycles.'
              },
              {
                id: 'prod-obsidian',
                nameKey: 'prod_obsidian_name',
                defaultName: 'Sacred Feng Shui Obsidian Wealth PIXIE Pendant',
                price: '$39.99',
                numericPrice: 39.99,
                category: 'Pendant',
                zodiac: 'Rat, Snake, Pig',
                imagePrompt: 'carved volcanic black obsidian pendant with mythical dragon creature, rich macro detailed shot, moody atmospheric lighting, 8k',
                descKey: 'prod_obsidian_desc',
                defaultDescription: 'Banish negative aura waves and unlock deep financial abundance. Perfect for restoring unaligned Water pathways.',
                imageUrl: 'https://images.unsplash.com/photo-1626782874136-1e66c6de59df?auto=format&fit=crop&q=80&w=600',
                element: 'Water',
                sku: 'OBP-002',
                status: 'active',
                longDescription: 'Crafted from black obsidian formed from cooling lava, this wealth-attracting pendant features detailed engraving of the mythical Pixie creature. It cleanses toxic psychic fog and shields you against external dynamic stressors.'
              },
              {
                id: 'prod-pyrite',
                nameKey: 'prod_pyrite_name',
                defaultName: 'Natural Pyrite Cluster of Abundance',
                price: '$59.00',
                numericPrice: 59.00,
                category: 'Crystal',
                zodiac: 'Ox, Rooster, Dog',
                imagePrompt: 'sparkling golden chalcopyrite crystal cluster on solid slate desktop, luxurious architectural accessory, sharp direct light, 8k',
                descKey: 'prod_pyrite_desc',
                defaultDescription: 'A pure solar dynamo of luxury. Perfect for balancing deficient Earth and Metal elements.',
                imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600',
                element: 'Earth',
                sku: 'PYC-003',
                status: 'active',
                longDescription: "Also known as Fool's Gold, Pyrite is a beautiful mineral of luck and determination. This sparkling cluster radiates strong grounding vibes and acts as an energetic solar powerhouse in your study room or home workspace."
              }
        ];

        if (isMongoConnected()) {
            try {
                const products = await Product.find().sort({ createdAt: -1 });
                if (products.length > 0) return products;
            } catch (e) { console.error("Mongo load products error:", e); }
        }
        return readJSONFile('products.json', defaultProd);
    },
    saveOrUpdateProduct: async (productData: any) => {
        if (!productData._id && !productData.id) {
            productData.id = `PROD-${Date.now()}`;
        }
        const products = await DbHelper.getAllProducts();
        const index = products.findIndex((p: any) => p.id === productData.id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        } else {
            products.push({ _id: `p_${Date.now()}`, id: productData.id, createdAt: new Date().toISOString(), ...productData });
        }
        writeJSONFile('products.json', products);

        if (isMongoConnected()) {
            try {
                await Product.findOneAndUpdate(
                    { id: productData.id },
                    productData,
                    { upsert: true, new: true }
                );
            } catch (e) { console.error("Mongo save product error:", e); }
        }
        return productData;
    },
    deleteProduct: async (id: string) => {
        let products = await DbHelper.getAllProducts();
        products = products.filter((p: any) => p.id !== id);
        writeJSONFile('products.json', products);

        if (isMongoConnected()) {
            try { await Product.findOneAndDelete({ id }); } catch (e) { console.error("Mongo delete product error:", e); }
        }
        return { success: true };
    },

    // --- HOMEPAGE CONFIGS ---
    getHomepageConfigs: async () => {
        const initialData = [
            { key: 'banner_title', type: 'text', title: 'Mystic Face AI Reading', description: 'Unlock the ancient codes of your destiny with advanced Computer Vision and deep astrological matrices.', order: 1 },
            { key: 'banner_subtitle', type: 'text', title: 'Discover Your Golden Destiny', description: 'Fusing the ancient secrets of Physiognomy and Palmistry with deep-learning neural insights.', order: 2 },
            { key: 'sec_face', type: 'section', title: 'Physiognomy Reading (Face Analysis)', description: 'Map your life path, core character, and five-element balances by reading the 12 ancestral palaces of your premium facial alignment.', imagePrompt: 'beautiful human face 3d topological mapping lines, golden facial grids, high-tech holographic analysis, luxury aesthetic, 8k', order: 3 },
            { key: 'sec_palm', type: 'section', title: 'Palmistry Reading (Hand Analysis)', description: 'Decode your life line, destiny line, heart line, and Mounts of the Moon & Sun with pristine topological vision.', imagePrompt: 'open human hand mapping lines glow, mystical palmistry lines highlighted, dark astronomical backdrops, glowing constellations, 8k', order: 4 },
            { key: 'sec_horoscope', type: 'section', title: 'Chinese Astrological Alignment', description: 'Analyze the precise astronomical interactions of your birth hour, planetary forces, and year of the animal.', imagePrompt: 'glowing celestial sphere, gold and emerald ancient astronomical chart, stellar ring systems, 8k', order: 5 },
            { key: 'sec_fengshui', type: 'section', title: 'Bespoke Feng Shui Audit', description: 'Harness the cosmic wind and water flows of your living space to clear bottlenecks, attract liquid fortune, and secure absolute well-being.', imagePrompt: 'chinese feng shui golden compass luopan resting on polished dark wood table, dynamic wind and water light spirals, 8k', order: 6 },
        ];

        if (isMongoConnected()) {
            try {
                const configs = await HomepageConfig.find().sort({ order: 1 });
                if (configs.length > 0) return configs;
            } catch (e) { console.error("Mongo load homepage configs error:", e); }
        }
        return readJSONFile('homepageconfigs.json', initialData);
    },
    updateHomepageConfigs: async (configData: any) => {
        const configs = await DbHelper.getHomepageConfigs();
        if (Array.isArray(configData)) {
            for (const item of configData) {
                const idx = configs.findIndex((c: any) => c.key === item.key);
                if (idx !== -1) {
                    configs[idx] = { ...configs[idx], ...item };
                } else {
                    configs.push(item);
                }
            }
        } else {
            const idx = configs.findIndex((c: any) => c.key === configData.key);
            if (idx !== -1) {
                configs[idx] = { ...configs[idx], ...configData };
            } else {
                configs.push(configData);
            }
        }
        writeJSONFile('homepageconfigs.json', configs);

        if (isMongoConnected()) {
            try {
                if (Array.isArray(configData)) {
                    for (const item of configData) {
                        await HomepageConfig.findOneAndUpdate({ key: item.key }, item, { upsert: true });
                    }
                } else {
                    await HomepageConfig.findOneAndUpdate({ key: configData.key }, configData, { upsert: true });
                }
            } catch (e) { console.error("Mongo update homepage config error:", e); }
        }
    }
};

async function seedHomepage() {
    // Handled seamlessly by DbHelper getHomepageConfigs initialisation
    await DbHelper.getHomepageConfigs();
}

async function seedProductsIfEmpty() {
    const CHINESE_ZODIAC = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const ZODIAC_ELEMENTS: Record<string, string> = {
        'Rat': 'Water', 'Ox': 'Earth', 'Tiger': 'Wood', 'Rabbit': 'Wood', 
        'Dragon': 'Earth', 'Snake': 'Fire', 'Horse': 'Fire', 'Goat': 'Earth', 
        'Monkey': 'Metal', 'Rooster': 'Metal', 'Dog': 'Earth', 'Pig': 'Water'
    };
    const WESTERN_SIGNS = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
    const WESTERN_ELEMENT_MAP: any = {
        'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
        'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
        'Gemini': 'Metal', 'Libra': 'Metal', 'Aquarius': 'Metal',
        'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };

    const initialProducts = readJSONFile('products.json', []);
    
    // Check if we need to seed
    const hasBracelets = initialProducts.some((p: any) => p.category === 'bracelet' || p.category === 'Bracelet');
    const hasNecklaces = initialProducts.some((p: any) => p.category === 'necklace' || p.category === 'Necklace');
    
    if (!hasBracelets || !hasNecklaces || initialProducts.length < 10) {
        console.log("[Product Seeder] Seeding 12 Chinese Zodiac bracelets, pendants, and necklaces...");
        const productsList: any[] = [...initialProducts];

        const addProductIfMissing = (prod: any) => {
            if (!productsList.some((p: any) => p.id === prod.id)) {
                productsList.push(prod);
            }
        };

        // 1. Chinese Zodiac bracelets, pendants, necklaces
        CHINESE_ZODIAC.forEach(z => {
            const element = ZODIAC_ELEMENTS[z] || 'Metal';
            
            addProductIfMissing({
                id: `brace_${z}`,
                nameKey: 'productNameBracelet',
                defaultName: `${z} Fortune Bracelet`,
                price: "$99.99",
                numericPrice: 99.99,
                imagePrompt: `mystical spiritual chinese zodiac ${z} obsidian gold feng shui bracelet, soft ethereal lighting, zen garden background, soul healing aesthetic, high resolution product photography`,
                descKey: 'productDescBracelet',
                category: 'bracelet',
                zodiac: z,
                element: element,
                sku: `BRC-${z.toUpperCase().slice(0, 3)}-001`,
                status: 'active',
                longDescription: `Handcrafted with natural obsidian and genuine gold beads engraved with the sacred ${z} symbol. Helps ground your energy, ward off negative aura fields, and stabilize your Qi.`
            });

            addProductIfMissing({
                id: `pend_${z}`,
                nameKey: 'productNamePendant',
                defaultName: `${z} Jade Pendant`,
                price: "$169.99",
                numericPrice: 169.99,
                imagePrompt: `sacred chinese green jade pendant necklace zodiac ${z} carving, mystical aura, floating in ethereal mist, spiritual healing, soft cinematic lighting, high resolution`,
                descKey: 'productDescPendant',
                category: 'pendant',
                zodiac: z,
                element: element,
                sku: `PDT-${z.toUpperCase().slice(0, 3)}-002`,
                status: 'active',
                longDescription: `Carved from premium Hetian jade. Exudes peaceful resonance, attracting helpful nobles (Gui Ren) and nourishing your life energy over continuous annual cycles.`
            });

            addProductIfMissing({
                id: `neck_${z}`,
                nameKey: 'productNameNecklace',
                defaultName: `${z} Celestial Silver Necklace`,
                price: "$129.99",
                numericPrice: 129.99,
                imagePrompt: `elegant sterling silver necklace featuring meticulously carved ${z} zodiac emblem, glowing under ethereal celestial starlight, floating in cosmic fog, spiritual protection jewelry, 8k product shot`,
                descKey: 'productDescNecklace',
                category: 'necklace',
                zodiac: z,
                element: element,
                sku: `NKL-${z.toUpperCase().slice(0, 3)}-003`,
                status: 'active',
                longDescription: `Elegant solid s925 silver necklace featuring a custom micro-carving of the ${z} sign. Harmonizes your personal magnetic field and amplifies good fortune in relationship and health domains.`
            });
        });

        // 2. Western Zodiac amulets
        WESTERN_SIGNS.forEach(sign => {
            const element = WESTERN_ELEMENT_MAP[sign] || 'Wood';
            addProductIfMissing({
                id: `amulet_${sign}`,
                nameKey: 'productNameAmulet',
                defaultName: `Golden ${sign} Amulet`,
                price: "$129.99",
                numericPrice: 129.99,
                imagePrompt: `celestial golden ${sign} zodiac amulet, glowing with cosmic energy, starry nebula background, mystical spiritual jewelry, high resolution cinematic photography`,
                descKey: 'productDescAmulet',
                category: 'amulet',
                zodiac: sign,
                element: element,
                sku: `AML-${sign.toUpperCase().slice(0, 3)}-004`,
                status: 'active',
                longDescription: `A master-crafted 18k gold-plated astrological amulet embedded with micro-crystals. Aligns with your star sign coordinates to channelize stellar favor and career success.`
            });
        });

        writeJSONFile('products.json', productsList);

        if (isMongoConnected()) {
            try {
                for (const p of productsList) {
                    const exists = await Product.findOne({ id: p.id });
                    if (!exists) {
                        const newProd = new Product(p);
                        await newProd.save();
                    }
                }
                console.log("[Product Seeder] Successfully seeded products to MongoDB.");
            } catch (err) {
                console.error("[Product Seeder] Mongo seeding error:", err);
            }
        }
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
            .then(async () => {
                console.log("[Backend] Connected to MongoDB");
                await seedHomepage();
                await seedProductsIfEmpty();
            })
            .catch(err => console.error("[Backend] MongoDB Connection Error:", err));
    } else {
        console.warn("[Backend] MONGODB_URI not found. Database features fallback to local storage files.");
        // Call seeding for local file fallback
        await seedProductsIfEmpty();
    }

    // =========================================================
    // 🚀 API ROUTES
    // =========================================================

    // --- AUTH ROUTES ---

    // 1. Sign Up (Failsafed user registration on local server storage)
    app.post('/api/auth/signup', async (req, res) => {
        const { email, password, name } = req.body;
        
        if (!email || !password) return res.status(400).json({ error: "Email and Password are required." });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format." });

        if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });
        
        try {
            const existingUser = await DbHelper.findUserByEmail(email);
            if (existingUser) return res.status(400).json({ error: "Email already registered." });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await DbHelper.createUser({
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                authType: 'email'
            });
            
            const userObj = typeof newUser.toObject === 'function' ? newUser.toObject() : newUser;
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
            const user = await DbHelper.findUserByEmail(email);
            if (!user) return res.status(404).json({ error: "Account not found.", code: 'USER_NOT_FOUND' });

            const isMatch = await bcrypt.compare(password, user.password || '');
            if (!isMatch) return res.status(401).json({ error: "Invalid password.", code: 'INVALID_CREDENTIALS' });

            const userObj = typeof user.toObject === 'function' ? user.toObject() : user;
            const userSafe = { ...userObj, id: userObj._id.toString() };
            delete (userSafe as any).password;
            res.json({ success: true, user: userSafe });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // Mock Forgot Password
    app.post('/api/auth/forgot-password', (req, res) => {
        const { email } = req.body;
        console.log(`[Mock Email] Sending password reset to ${email}`);
        res.json({ success: true, message: "If account exists, email sent." });
    });

    // --- APP ROUTES ---

    // AI Proxy Analyze Endpoint
    app.post('/api/analyze', async (req, res) => {
        try {
            const { prompt, base64Image, provider, config } = req.body;
            let targetProvider = provider || config?.textProvider || 'Google';

            if (base64Image && targetProvider === 'DeepSeek') {
                targetProvider = 'Google';
            }

            if (targetProvider === 'Google') {
                let apiKey = config?.googleKey || process.env.GEMINI_API_KEY;
                if (apiKey) apiKey = apiKey.trim();

                const isPlaceholder = !apiKey || 
                                      apiKey === "" || 
                                      apiKey.includes("YOUR_") || 
                                      apiKey.includes("placeholder") || 
                                      apiKey === "undefined" || 
                                      apiKey.length < 15;

                if (isPlaceholder) {
                    return res.status(400).json({ 
                        error: "Google Gemini API Key is missing or invalid. Please configure a valid API Key (starts with 'AIzaSy') in your Server Environment Variables or the Settings panel." 
                    });
                }

                const ai = new GoogleGenAI({
                    apiKey,
                    httpOptions: {
                        headers: {
                            'User-Agent': 'aistudio-build'
                        }
                    }
                });
                const safetySettings = [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                ];

                const response = await ai.models.generateContent({
                    model: 'gemini-3.5-flash',
                    contents: {
                        parts: [
                            base64Image ? { inlineData: { mimeType: 'image/jpeg', data: base64Image } } : null,
                            { text: prompt }
                        ].filter(Boolean) as any
                    },
                    config: { safetySettings }
                });

                return res.json({ text: response.text });
            } else {
                // General OpenAI/DeepSeek Handler
                const isDeepSeek = targetProvider === 'DeepSeek';
                const apiKey = isDeepSeek ? config?.deepseekKey : config?.openaiKey;
                const apiUrl = isDeepSeek ? 'https://api.deepseek.com/chat/completions' : 'https://api.openai.com/v1/chat/completions';
                const model = isDeepSeek ? 'deepseek-chat' : 'gpt-4o';

                if (!apiKey) {
                    return res.status(400).json({ error: `${targetProvider} API Key missing.` });
                }

                const messages: any[] = [{ role: "user", content: [] }];

                if (base64Image && !isDeepSeek) {
                    messages[0].content.push({ type: "text", text: prompt });
                    messages[0].content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } });
                } else {
                    messages[0].content = prompt;
                }

                const apiResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({ model: model, messages: messages, stream: false })
                });

                if (!apiResponse.ok) {
                    const err = await apiResponse.json();
                    return res.status(apiResponse.status).json({ error: err.error?.message || `${targetProvider} API Error` });
                }
                const data = await apiResponse.json();
                return res.json({ text: data.choices[0].message.content });
            }
        } catch (err: any) {
            console.error("AI Analysis proxy error:", err);
            res.status(500).json({ error: err.message });
        }
    });

    // 1. Save History Endpoint (Frontend calls AI, then saves result)
    app.post('/api/history', async (req, res) => {
        try {
            const { userId, resultText, gender, name, birthDate, readingType, elements } = req.body;
            if (userId) {
                // Save history item
                await DbHelper.createHistory({
                    userId,
                    resultText,
                    gender,
                    name,
                    birthDate,
                    readingType,
                    elements,
                    summary: "AI Analysis Result" 
                });

                // ALSO: update user remaining free counts and trial data (3 days free trial, total max 10 tests)
                const user = await DbHelper.findUserById(userId);
                let userSafe: any = null;
                if (user) {
                    const updateData: any = {};
                    
                    // Initialize trialStartDate if not set
                    if (!user.trialStartDate) {
                        updateData.trialStartDate = new Date().toISOString();
                    }
                    
                    // Increment totalTests
                    const currentTests = user.totalTests !== undefined ? user.totalTests : 0;
                    updateData.totalTests = currentTests + 1;

                    // Keep backward compatibility with old fields
                    const faceRem = user.freeFaceRemaining !== undefined ? user.freeFaceRemaining : 3;
                    const palmRem = user.freePalmRemaining !== undefined ? user.freePalmRemaining : 3;
                    const remaining = Math.min(faceRem, palmRem);
                    if (remaining > 0) {
                        updateData.freeFaceRemaining = remaining - 1;
                        updateData.freePalmRemaining = remaining - 1;
                    } else {
                        updateData.freeFaceRemaining = 0;
                        updateData.freePalmRemaining = 0;
                    }

                    const updatedUser = await DbHelper.updateUser(userId, updateData);
                    if (updatedUser) {
                        const userObj = typeof updatedUser.toObject === 'function' ? updatedUser.toObject() : updatedUser;
                        userSafe = { ...userObj, id: userObj._id.toString() };
                        delete (userSafe as any).password;
                    }
                }

                return res.json({ success: true, user: userSafe });
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
            await DbHelper.createOrder({ ...orderData, orderId });
            res.json({ success: true, orderId });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 6. Get User Profile (including address & subscription info)
    app.get('/api/user/profile/:userId', async (req, res) => {
        try {
            const user = await DbHelper.findUserById(req.params.userId);
            if (!user) return res.status(404).json({ error: "User not found." });
            const userObj = typeof user.toObject === 'function' ? user.toObject() : user;
            const userSafe = { ...userObj, id: userObj._id.toString() };
            delete (userSafe as any).password;
            res.json(userSafe);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 7. Update User Profile Address Info
    app.post('/api/user/profile', async (req, res) => {
        const { userId, firstName, lastName, country, state, zipCode, streetAddress, buildingName, roomNumber } = req.body;
        try {
            const user = await DbHelper.updateUser(
                userId,
                { firstName, lastName, country, state, zipCode, streetAddress, buildingName, roomNumber }
            );
            if (!user) return res.status(404).json({ error: "User not found." });
            const userObj = typeof user.toObject === 'function' ? user.toObject() : user;
            const userSafe = { ...userObj, id: userObj._id.toString() };
            delete (userSafe as any).password;
            res.json({ success: true, user: userSafe });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 8. Get User Purchases and Orders History
    app.get('/api/user/orders/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await DbHelper.findUserById(userId);
            const email = user ? user.email : '';
            const userOrders = await DbHelper.getOrdersByUser(userId, email);
            res.json(userOrders);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 9. Payment Integration endpoint for PayPal, Credit Card, Alipay, WeChat Pay, and UnionPay
    app.post('/api/payments/pay', async (req, res) => {
        const { userId, email, planId, planTitle, amount, method, shippingAddress, cardDetails } = req.body;
        let orderId = `PAY-${Date.now().toString().slice(-6)}`;
        let status = 'paid';
        
        try {
            // --- STRIPE CREDIT CARD PROCESSING ---
            if (method === 'credit-card' || method === 'stripe' || method === 'unionpay') {
                const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
                
                // Validate card format
                const cardNumberClean = (cardDetails?.cardNumber || '').replace(/\s/g, '');
                if (!cardNumberClean) {
                    return res.status(400).json({ error: "Missing Card Number" });
                }
                
                if (method === 'stripe' || method === 'credit-card') {
                    if (!/^\d{13,19}$/.test(cardNumberClean)) {
                        return res.status(400).json({ error: "Invalid credit card number format. Check length (13-19 digits)." });
                    }
                    const expParts = (cardDetails?.expiry || '').split('/');
                    if (expParts.length !== 2) {
                        return res.status(400).json({ error: "Invalid expiry date. Use MM/YY format." });
                    }
                    const month = parseInt(expParts[0], 10);
                    const year = parseInt(expParts[1], 10);
                    if (isNaN(month) || month < 1 || month > 12) {
                        return res.status(400).json({ error: "Invalid expiry month. Use MM/YY." });
                    }
                    if (isNaN(year) || year < 24) {
                        return res.status(400).json({ error: "Card expired or invalid year." });
                    }
                } else if (method === 'unionpay') {
                    // UnionPay usually starts with 62 or 60
                    if (!cardNumberClean.startsWith('62') && !cardNumberClean.startsWith('60') && !cardNumberClean.startsWith('69')) {
                        return res.status(400).json({ error: "Invalid UnionPay card number. Must start with 62, 60 or 69." });
                    }
                    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
                        return res.status(400).json({ error: "Invalid UnionPay card length. Must be between 13 and 19 digits." });
                    }
                }

                if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
                    try {
                        const stripe = new Stripe(stripeSecretKey);

                        // Parse MM/YY Expiry
                        const expParts = (cardDetails?.expiry || '12/29').split('/');
                        const expMonth = parseInt(expParts[0]) || 12;
                        const expYear = parseInt(expParts[1] ? `20${expParts[1]}` : '2029') || 2029;

                        // Create PaymentMethod securely
                        const paymentMethod = await stripe.paymentMethods.create({
                            type: 'card',
                            card: {
                                number: cardNumberClean,
                                exp_month: expMonth,
                                exp_year: expYear,
                                cvc: cardDetails?.cvc || '123',
                            },
                        });

                        // Create and confirm PaymentIntent (single-step transaction)
                        const paymentIntent = await stripe.paymentIntents.create({
                            amount: Math.round(parseFloat(amount) * 100),
                            currency: 'usd',
                            payment_method: paymentMethod.id,
                            confirm: true,
                            automatic_payment_methods: {
                                enabled: true,
                                allow_redirects: 'never'
                            },
                            metadata: {
                                userId: userId || 'guest',
                                email: email || 'guest@mysticface.com',
                                planId: planId || '',
                                planTitle: planTitle || '',
                                paymentChannel: method
                            }
                        });

                        orderId = paymentIntent.id;
                        status = paymentIntent.status === 'succeeded' ? 'paid' : 'pending';
                    } catch (stripeErr: any) {
                        console.error('[Stripe Payment Error]:', stripeErr);
                        return res.status(400).json({ error: `Card processing error: ${stripeErr.message}` });
                    }
                } else {
                    console.warn("[Stripe Warning] STRIPE_SECRET_KEY is empty or invalid. Running in sandbox demo mode.");
                }
            }

            // --- PAYPAL TRANSACTION INITIALISATION ---
            if (method === 'paypal') {
                const paypalClientId = process.env.PAYPAL_CLIENT_ID;
                const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
                if (paypalClientId && paypalClientSecret) {
                    try {
                        const isSandbox = process.env.PAYPAL_MODE !== 'production';
                        const tokenUrl = isSandbox ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token' : 'https://api-m.paypal.com/v1/oauth2/token';
                        const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
                        
                        // Get Access Token
                        const tokenResponse = await fetch(tokenUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Basic ${auth}`,
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: 'grant_type=client_credentials'
                        });

                        if (!tokenResponse.ok) {
                            throw new Error('Failed to retrieve PayPal authentication token');
                        }
                        const tokenData = await tokenResponse.json() as any;
                        const accessToken = tokenData.access_token;

                        const paypalOrderUrl = isSandbox ? 'https://api-m.sandbox.paypal.com/v2/checkout/orders' : 'https://api-m.paypal.com/v2/checkout/orders';
                        
                        const returnUrl = `${req.protocol}://${req.get('host')}/api/payments/paypal/success?userId=${userId || 'guest'}&planId=${planId || ''}&amount=${amount}&title=${encodeURIComponent(planTitle || planId || '')}&email=${encodeURIComponent(email || '')}&shippingAddress=${encodeURIComponent(shippingAddress || '')}`;
                        const cancelUrl = `${req.protocol}://${req.get('host')}/pricing`;

                        const paypalResponse = await fetch(paypalOrderUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                intent: 'CAPTURE',
                                purchase_units: [{
                                    amount: {
                                        currency_code: 'USD',
                                        value: parseFloat(amount).toFixed(2)
                                    },
                                    description: planTitle || planId
                                }],
                                application_context: {
                                    return_url: returnUrl,
                                    cancel_url: cancelUrl
                                }
                            })
                        });

                        if (!paypalResponse.ok) {
                            const paypalErr = await paypalResponse.json() as any;
                            throw new Error(paypalErr.message || 'PayPal order instantiation failed');
                        }

                        const paypalOrder = await paypalResponse.json() as any;
                        const approveLink = paypalOrder.links.find((l: any) => l.rel === 'approve');
                        if (approveLink) {
                            return res.json({ success: true, redirectUrl: approveLink.href, orderId: paypalOrder.id });
                        }
                    } catch (paypalErr: any) {
                        console.error('[PayPal Payment Error]:', paypalErr);
                        return res.status(400).json({ error: `PayPal Checkout error: ${paypalErr.message}` });
                    }
                } else {
                    console.warn("[PayPal Warning] PayPal credentials are empty. Running in sandbox demo mode.");
                }
            }

            // Create local/Mongo order representation
            await DbHelper.createOrder({
                orderId,
                userId: userId || 'guest',
                email: email || 'guest@mysticface.com',
                items: planTitle || planId,
                total: parseFloat(amount),
                status,
                customerName: cardDetails?.name || `${cardDetails?.firstName || ''} ${cardDetails?.lastName || ''}`.trim() || 'Customer',
                shippingAddress: shippingAddress || 'Digital Product',
                paymentMethod: method, // 'paypal' or 'credit-card'
                phone: ''
            });

            // If subscription, update user's premium privileges
            const isSubPlan = planId && (planId.includes('month') || planId.includes('year') || planId === 'sub' || planId.includes('pass') || planId.includes('plan'));
            if (isSubPlan && userId && userId !== 'guest') {
                let monthsToAdd = 1;
                if (planId.includes('year')) monthsToAdd = 12;
                const expireDate = new Date();
                expireDate.setMonth(expireDate.getMonth() + monthsToAdd);

                await DbHelper.updateUser(userId, {
                    isSubscribed: true,
                    subscriptionPlan: planId,
                    subscribedAt: new Date().toISOString(),
                    subscriptionExpiresAt: expireDate.toISOString()
                });
            }
            
            res.json({ success: true, orderId });
        } catch (err: any) {
            console.error('[Payment Handler Failure]:', err);
            res.status(500).json({ error: err.message });
        }
    });

    // PayPal Success callback & Capture
    app.get('/api/payments/paypal/success', async (req, res) => {
        const { token, userId, planId, amount, title, email, shippingAddress } = req.query as any;
        
        try {
            const paypalClientId = process.env.PAYPAL_CLIENT_ID;
            const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
            
            if (paypalClientId && paypalClientSecret && token) {
                // Get Token
                const isSandbox = process.env.PAYPAL_MODE !== 'production';
                const tokenUrl = isSandbox ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token' : 'https://api-m.paypal.com/v1/oauth2/token';
                const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
                const tokenResponse = await fetch(tokenUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'grant_type=client_credentials'
                });

                if (tokenResponse.ok) {
                    const tokenData = await tokenResponse.json() as any;
                    const accessToken = tokenData.access_token;

                    const captureUrl = isSandbox 
                        ? `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`
                        : `https://api-m.paypal.com/v2/checkout/orders/${token}/capture`;

                    const captureResponse = await fetch(captureUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!captureResponse.ok) {
                        throw new Error('PayPal Capture Order transaction failed');
                    }
                }
            }

            const decodedTitle = decodeURIComponent(title || 'Item');
            const orderId = token || `PAY-${Date.now().toString().slice(-6)}`;

            // Create active order
            await DbHelper.createOrder({
                orderId,
                userId: userId || 'guest',
                email: email || 'guest@mysticface.com',
                items: decodedTitle,
                total: parseFloat(amount || '0'),
                status: 'paid',
                customerName: 'PayPal Customer',
                shippingAddress: shippingAddress || 'Digital Product',
                paymentMethod: 'paypal',
                phone: ''
            });

            // Assign premium subscription if applicable
            const isSubPlan = planId && (planId.includes('month') || planId.includes('year') || planId === 'sub' || planId.includes('pass') || planId.includes('plan'));
            if (isSubPlan && userId && userId !== 'guest') {
                let monthsToAdd = 1;
                if (planId.includes('year')) monthsToAdd = 12;
                const expireDate = new Date();
                expireDate.setMonth(expireDate.getMonth() + monthsToAdd);

                await DbHelper.updateUser(userId, {
                    isSubscribed: true,
                    subscriptionPlan: planId,
                    subscribedAt: new Date().toISOString(),
                    subscriptionExpiresAt: expireDate.toISOString()
                });
            }

            // Redirect back to frontend success landing
            res.redirect(`/?payment=success&orderId=${orderId}`);
        } catch (err: any) {
            console.error('[PayPal Success Capture Error]:', err);
            res.redirect(`/?payment=failed&error=${encodeURIComponent(err.message)}`);
        }
    });

    // 10. Manual Unsubscribe endpoint (Requirement #6)
    app.post('/api/user/unsubscribe', async (req, res) => {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "User ID required." });
        try {
            await DbHelper.updateUser(userId, {
                isSubscribed: false,
                subscriptionPlan: '',
                subscribedAt: null,
                subscriptionExpiresAt: null
            });
            res.json({ success: true, message: "Subscription manually cancelled successfully." });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // --- ADMIN SETTINGS ROUTES (Requirement #5) ---
    app.get('/api/admin/settings', (req, res) => {
        try {
            const settings = readJSONFile('settings.json', {
                googlePixelId: 'GT-ANALYTICS888',
                facebookPixelId: 'FB-PIXEL-7772188',
                paypalClientId: 'sb-paypal-client',
                paypalEnabled: true,
                stripePublicKey: 'pk_test_mock_stripe_key',
                stripeEnabled: true
            });
            res.json(settings);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/admin/settings', (req, res) => {
        try {
            const settings = req.body;
            writeJSONFile('settings.json', settings);
            res.json({ success: true, settings });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 4. Get Orders Endpoint (Admin)
    app.get('/api/admin/orders', async (req, res) => {
        try {
            const orders = await DbHelper.getAllOrders();
            res.json(orders);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 4a. Get Registered Users Endpoint (Admin)
    app.get('/api/admin/users', async (req, res) => {
        try {
            if (isMongoConnected()) {
                const users = await User.find().sort({ registeredAt: -1 });
                const safeUsers = users.map((u: any) => {
                    const obj = u.toObject();
                    delete obj.password;
                    return { ...obj, id: obj._id.toString() };
                });
                return res.json(safeUsers);
            } else {
                const users = readJSONFile('users.json', []);
                const safeUsers = users.map((u: any) => {
                    const copy = { ...u };
                    delete copy.password;
                    return copy;
                });
                return res.json(safeUsers);
            }
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 4b. AI text copywriting assistant for admin (Admin)
    app.post('/api/admin/generate-text', async (req, res) => {
        try {
            const { type, context } = req.body;
            let apiKey = process.env.GEMINI_API_KEY;
            if (apiKey) apiKey = apiKey.trim();
            
            const isPlaceholder = !apiKey || 
                                  apiKey === "" || 
                                  apiKey.includes("YOUR_") || 
                                  apiKey.includes("placeholder") || 
                                  apiKey === "undefined" || 
                                  apiKey.length < 15;

            if (isPlaceholder) {
                return res.status(400).json({ 
                    error: "Gemini API key is not configured on the server. Please configure a valid API Key (starts with 'AIzaSy') in your Server Environment Variables." 
                });
            }

            const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                    headers: {
                        'User-Agent': 'aistudio-build'
                    }
                }
            });
            let systemPrompt = "";

            if (type === 'product') {
                systemPrompt = `You are a professional crystal and spiritual product copywriter for a metaphysical brand called 'Mystic Face' (selling items like Lucky Jade bracelets, Obsidian wealth pendants, crystals aligned with face readings, palmistry, and Chinese Zodiac).
Draft a concise, compelling, premium product description (around 100 words) for:
- Product Title: ${context.name || ''}
- SKU: ${context.sku || ''}
- Price: ${context.price || ''}
- Category: ${context.category || ''}
- Associated Elements/Zodiac: ${context.element || ''} / ${context.zodiac || ''}

Focus on spiritual/metaphysical benefits, elemental balance (such as Fire/Water/Wood/Metal/Earth), elegant craftsmanship, and lucky energies. Respond in traditional Chinese, simplified Chinese, or English depending on context. Default to elegant Simplified Chinese (${context.language === 'zh' ? '简体中文' : '英文'}). Avoid markdown formatting like headers, write as a clean paragraph.`;
            } else if (type === 'homepage') {
                systemPrompt = `You are an expert brand storyteller for 'Mystic Face', an elite platform fusing computer vision face readings, palmistry, Bazi, Feng Shui, I Ching, and purple star astrology.
Draft an elegant, atmospheric and welcoming introductory text (around 80 words) for our homepage section:
- Section Key: ${context.key || ''}
- Section Title: ${context.title || ''}

Describe the mystical depth of this section, inviting readers to explore their destiny and celestial alignment. Respond in Simplified Chinese (${context.language === 'zh' ? '简体中文' : '英文'}). Avoid headers or markdown formatting.`;
            } else {
                systemPrompt = `Write a short elegant copywriting paragraph for: ${JSON.stringify(context)}`;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: systemPrompt,
            });

            res.json({ text: response.text });
        } catch (err: any) {
            console.error("AI copywriting generation failed:", err);
            res.status(500).json({ error: err.message });
        }
    });

    // 5. Get User History Endpoint
    app.get('/api/history/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const history = await DbHelper.getHistoriesByUser(userId);
            res.json(history);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // --- PRODUCT ROUTES ---

    // 1. Get All Products
    app.get('/api/products', async (req, res) => {
        try {
            const xmlProducts = await DbHelper.getAllProducts();
            res.json(xmlProducts);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 2. Create/Update Product (Admin)
    app.post('/api/admin/products', async (req, res) => {
        const productData = req.body;
        try {
            const product = await DbHelper.saveOrUpdateProduct(productData);
            res.json(product);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 3. Delete Product (Admin)
    app.delete('/api/admin/products/:id', async (req, res) => {
        try {
            await DbHelper.deleteProduct(req.params.id);
            res.json({ success: true });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // --- HOMEPAGE CONFIG ROUTES ---

    // 1. Get Homepage Config
    app.get('/api/homepage', async (req, res) => {
        try {
            const configs = await DbHelper.getHomepageConfigs();
            res.json(configs);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    // 2. Update Homepage Config (Admin)
    app.post('/api/admin/homepage', async (req, res) => {
        const configData = req.body;
        try {
            await DbHelper.updateHomepageConfigs(configData);
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
        app.get('*all', (req, res) => {
            res.sendFile(path.resolve(distPath, 'index.html'));
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
