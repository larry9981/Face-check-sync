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
    
    // Check if we need to seed or if we have old product ID structures
    const hasOldStructure = initialProducts.some((p: any) => p.id.startsWith('amulet_') || (p.id.startsWith('brace_') && !p.id.startsWith('jade_')));
    const hasBracelets = initialProducts.some((p: any) => p.category === 'bracelet' || p.category === 'Bracelet');
    
    if (hasOldStructure || !hasBracelets || initialProducts.length < 10) {
        console.log("[Product Seeder] Seeding new luxury Jade Zodiac and Constellation collection...");
        
        // If there's old structure, we clear and re-seed clean slate
        let productsList: any[] = [];
        
        if (isMongoConnected()) {
            try {
                await Product.deleteMany({});
                console.log("[Product Seeder] Cleaned existing MongoDB products for new Jade collection.");
            } catch (err) {
                console.error("[Product Seeder] Clear Mongo products error:", err);
            }
        }

        const addProductIfMissing = (prod: any) => {
            if (!productsList.some((p: any) => p.id === prod.id)) {
                productsList.push(prod);
            }
        };

        // 1. Chinese Zodiac bracelets and pendants
        CHINESE_ZODIAC.forEach(z => {
            const element = ZODIAC_ELEMENTS[z] || 'Metal';
            
            addProductIfMissing({
                id: `jade_brace_${z.toLowerCase()}`,
                nameKey: 'productNameJadeBracelet',
                defaultName: `Jade ${z} Bracelet`,
                price: "$139.99",
                numericPrice: 139.99,
                imagePrompt: `exquisite premium natural white jade beads combined with a beautiful gold ${z} zodiac lucky charm bracelet, spiritual feng shui energy beads, soft peaceful glow, luxury product shot, white velvet background`,
                descKey: 'productDescJadeBracelet',
                category: 'bracelet',
                zodiac: z,
                element: element,
                sku: `JBC-${z.toUpperCase().slice(0, 3)}-001`,
                status: 'active',
                longDescription: `Exquisite natural white jade combined with a handcrafted pure gold ${z} zodiac symbol ornament. Restores balance to the wearers Cosmic Elements, clears bad energetic flows, and invites peace.`
            });

            addProductIfMissing({
                id: `jade_pend_${z.toLowerCase()}`,
                nameKey: 'productNameJadePendant',
                defaultName: `Jade ${z} Necklace Pendant`,
                price: "$189.99",
                numericPrice: 189.99,
                imagePrompt: `sacred natural green jadeite jade necklace pendant carving of chinese zodiac ${z} guardian spirit, gold bail, mystical peaceful aura, floating in ethereal mist, spiritual healing jewelry, high resolution product photography`,
                descKey: 'productDescJadePendant',
                category: 'pendant',
                zodiac: z,
                element: element,
                sku: `JPD-${z.toUpperCase().slice(0, 3)}-002`,
                status: 'active',
                longDescription: `Meticulously hand-carved natural green jade pendant representing the celestial ${z} patron protector. Known to guard the spirit, improve vital health qi, and attract noble luck.`
            });
        });

        // 2. Western Zodiac bracelets and pendants
        WESTERN_SIGNS.forEach(sign => {
            const element = WESTERN_ELEMENT_MAP[sign] || 'Wood';
            
            addProductIfMissing({
                id: `jade_brace_${sign.toLowerCase()}`,
                nameKey: 'productNameStarJadeBracelet',
                defaultName: `Jade ${sign} Constellation Bracelet`,
                price: "$149.99",
                numericPrice: 149.99,
                imagePrompt: `mystical light blue jadeite beads and lapis lazuli cosmic constellation ${sign} star sign bracelet, detailed sacred geometry golden charm, soft stardust aura, dark velvet background, premium spiritual jewelry`,
                descKey: 'productDescStarJadeBracelet',
                category: 'bracelet',
                zodiac: sign,
                element: element,
                sku: `WJB-${sign.toUpperCase().slice(0, 3)}-003`,
                status: 'active',
                longDescription: `Specially crafted constellation bracelet made from natural light-blue jadeite and lapis lazuli beads. Engraved with the ${sign} celestial coordinate, aligning cosmic starlight for focus.`
            });

            addProductIfMissing({
                id: `jade_pend_${sign.toLowerCase()}`,
                nameKey: 'productNameStarJadePendant',
                defaultName: `Jade ${sign} Constellation Pendant`,
                price: "$199.99",
                numericPrice: 199.99,
                imagePrompt: `beautifully hand-polished premium raw crystalline jade gemstone necklace pendant, custom engraved with celestial ${sign} constellation emblem, delicate silver chain, glowing with starlight nebula, luxury product shot`,
                descKey: 'productDescStarJadePendant',
                category: 'pendant',
                zodiac: sign,
                element: element,
                sku: `WJP-${sign.toUpperCase().slice(0, 3)}-004`,
                status: 'active',
                longDescription: `Shining high-grade crystalline jade gemstone pendant beautifully engraved with the ${sign} constellation coordinate. Promotes robust spiritual energy and acts as a permanent shield against anxiety.`
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
            const { prompt, base64Image, provider, config, userId } = req.body;

            // Security check on usage limits
            if (userId && userId !== 'guest') {
                const user = await DbHelper.findUserById(userId);
                if (user) {
                    if (user.isSubscribed) {
                        const plan = user.subscriptionPlan || '';
                        const isAnnual = plan.includes('year') || plan === 'sub_year';
                        const limit = isAnnual ? 3600 : 300;
                        const totalTests = user.totalTests || 0;
                        if (totalTests >= limit) {
                            return res.status(403).json({ 
                                error: `您的${isAnnual ? '年度' : '月度'}订阅已达到最大使用次数限制（最高 ${limit} 次），请联系客服或更新订阅。` 
                            });
                        }
                    } else if (!user.hasPaidSingle) {
                        // Trial check
                        if (user.trialStartDate) {
                            const start = new Date(user.trialStartDate);
                            const now = new Date();
                            const diffMs = now.getTime() - start.getTime();
                            const daysPassed = diffMs / (1000 * 60 * 60 * 24);
                            if (daysPassed > 3) {
                                return res.status(403).json({ 
                                    error: "您的3天免费试用期已结束，请购买订阅继续使用。" 
                                });
                            }
                        }
                        const totalTests = user.totalTests || 0;
                        if (totalTests >= 10) {
                            return res.status(403).json({ 
                                error: "您已达到全站点10次免费测试的总上限，请购买订阅或单次付费继续使用。" 
                            });
                        }
                    }
                }
            }

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

                let response;
                try {
                    response = await ai.models.generateContent({
                        model: 'gemini-3.5-flash',
                        contents: {
                            parts: [
                                base64Image ? { inlineData: { mimeType: 'image/jpeg', data: base64Image } } : null,
                                { text: prompt }
                            ].filter(Boolean) as any
                        },
                        config: { safetySettings }
                    });
                } catch (firstErr: any) {
                    console.warn("Primary model 'gemini-3.5-flash' returned an error (likely high demand or 503). Attempting automatic fallback to 'gemini-3.1-flash-lite'...", firstErr.message || firstErr);
                    
                    try {
                        response = await ai.models.generateContent({
                            model: 'gemini-3.1-flash-lite',
                            contents: {
                                parts: [
                                    base64Image ? { inlineData: { mimeType: 'image/jpeg', data: base64Image } } : null,
                                    { text: prompt }
                                ].filter(Boolean) as any
                            },
                            config: { safetySettings }
                        });
                    } catch (secondErr: any) {
                        console.error("All Gemini API models are currently unavailable due to high demand. Activating premium localized fallback engine...", secondErr.message || secondErr);
                        const fallbackText = generateGracefulFallbackReading(prompt, base64Image);
                        return res.json({ text: fallbackText });
                    }
                }

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

    async function processAirwallexPayment(
        amount: number,
        currency: string,
        orderId: string,
        email: string,
        cardDetails: { name: string; cardNumber: string; expiry: string; cvc: string },
        airwallexClientId: string,
        airwallexApiKey: string,
        isSandbox: boolean
    ) {
        const baseUrl = isSandbox ? 'https://api-demo.airwallex.com/api/v1' : 'https://api.airwallex.com/api/v1';
        
        // 1. Authenticate to get token
        const loginRes = await fetch(`${baseUrl}/authentication/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': airwallexClientId,
                'x-api-key': airwallexApiKey
            }
        });
        
        if (!loginRes.ok) {
            const errText = await loginRes.text();
            throw new Error(`Airwallex authentication failed: ${errText || loginRes.statusText}`);
        }
        
        const loginData = await loginRes.json() as { token: string };
        const token = loginData.token;
        
        // 2. Create Payment Intent
        const createRes = await fetch(`${baseUrl}/pa/payment_intents/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                request_id: `req_intent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                amount: amount,
                currency: currency,
                merchant_order_id: orderId,
                metadata: {
                    email: email
                }
            })
        });
        
        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Airwallex Payment Intent creation failed: ${errText || createRes.statusText}`);
        }
        
        const intentData = await createRes.json() as { id: string; client_secret: string };
        const intentId = intentData.id;
        
        // 3. Confirm Payment Intent with Card Details
        const expParts = (cardDetails.expiry || '').split('/');
        const expMonth = expParts[0].padStart(2, '0');
        const expYear = expParts[1] ? (expParts[1].length === 2 ? `20${expParts[1]}` : expParts[1]) : '2029';
        
        const confirmRes = await fetch(`${baseUrl}/pa/payment_intents/${intentId}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                request_id: `req_confirm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                payment_method: {
                    type: 'card',
                    card: {
                        number: cardDetails.cardNumber.replace(/\s/g, ''),
                        name: cardDetails.name || 'Customer',
                        expiry_month: expMonth,
                        expiry_year: expYear,
                        cvc: cardDetails.cvc
                    }
                }
            })
        });
        
        if (!confirmRes.ok) {
            const errText = await confirmRes.text();
            throw new Error(`Airwallex Payment Confirmation failed: ${errText || confirmRes.statusText}`);
        }
        
        const confirmData = await confirmRes.json() as { status: string };
        return {
            id: intentId,
            status: confirmData.status
        };
    }

    // 9. Payment Integration endpoint for PayPal, Credit Card, Alipay, WeChat Pay, and UnionPay
    app.post('/api/payments/pay', async (req, res) => {
        const { userId, email, planId, planTitle, amount, method, shippingAddress, cardDetails, paypalOrderId } = req.body;
        let orderId = paypalOrderId || `PAY-${Date.now().toString().slice(-6)}`;
        let status = 'paid';
        
        try {
            // --- CREDIT CARD PROCESSING (Stripe or Airwallex) ---
            if (method === 'credit-card' || method === 'stripe' || method === 'airwallex') {
                const settings = readJSONFile('settings.json', {});
                const processor = settings.creditCardProcessor || (settings.airwallexEnabled ? 'airwallex' : 'stripe');
                
                // Validate card format
                const cardNumberClean = (cardDetails?.cardNumber || '').replace(/\s/g, '');
                if (!cardNumberClean) {
                    return res.status(400).json({ error: "Missing Card Number" });
                }
                
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

                if (processor === 'airwallex') {
                    const airwallexClientId = settings.airwallexClientId || process.env.AIRWALLEX_CLIENT_ID;
                    const airwallexApiKey = settings.airwallexApiKey || process.env.AIRWALLEX_API_KEY;
                    const airwallexMode = settings.airwallexMode || process.env.AIRWALLEX_MODE || 'sandbox';
                    const isSandbox = airwallexMode !== 'production';

                    if (airwallexClientId && airwallexApiKey) {
                        try {
                            const result = await processAirwallexPayment(
                                parseFloat(amount),
                                'USD',
                                orderId,
                                email || 'guest@mysticface.com',
                                {
                                    name: cardDetails?.name || 'Customer',
                                    cardNumber: cardNumberClean,
                                    expiry: cardDetails?.expiry || '12/29',
                                    cvc: cardDetails?.cvc || '123'
                                },
                                airwallexClientId,
                                airwallexApiKey,
                                isSandbox
                            );
                            orderId = result.id;
                            status = (result.status === 'SUCCEEDED' || result.status === 'PAID') ? 'paid' : 'pending';
                        } catch (airwallexErr: any) {
                            console.error('[Airwallex Payment Error]:', airwallexErr);
                            return res.status(400).json({ error: `Airwallex processing error: ${airwallexErr.message}` });
                        }
                    } else {
                        console.warn("[Airwallex Warning] Airwallex credentials are empty in settings and environment variables. Running in sandbox demo mode.");
                        orderId = `AWX-MOCK-${Date.now().toString().slice(-6)}`;
                        status = 'paid';
                    }
                } else {
                    // Stripe processing
                    const stripeSecretKey = settings.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
                    if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
                        try {
                            const stripe = new Stripe(stripeSecretKey);

                            // Parse MM/YY Expiry
                            const expMonth = month;
                            const expYear = year < 100 ? 2000 + year : year;

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
                        console.warn("[Stripe Warning] STRIPE_SECRET_KEY is empty in settings and environment variables. Running in sandbox demo mode.");
                        orderId = `STP-MOCK-${Date.now().toString().slice(-6)}`;
                        status = 'paid';
                    }
                }
            }

            // --- PAYPAL TRANSACTION INITIALISATION ---
            if (method === 'paypal') {
                if (paypalOrderId) {
                    // Already captured client-side using PayPal Smart Buttons
                    orderId = paypalOrderId;
                    status = 'paid';
                } else {
                    const settings = readJSONFile('settings.json', {});
                    const paypalClientId = (settings.paypalClientId && settings.paypalClientId !== 'sb-paypal-client') ? settings.paypalClientId : process.env.PAYPAL_CLIENT_ID;
                    const paypalClientSecret = settings.paypalClientSecret ? settings.paypalClientSecret : process.env.PAYPAL_CLIENT_SECRET;

                    if (paypalClientId && paypalClientSecret && paypalClientId !== 'sb') {
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
                        console.warn("[PayPal Warning] PayPal credentials are empty or default. Running in sandbox demo mode.");
                        return res.json({ success: true, simulated: true, orderId: `PAY-MOCK-${Date.now().toString().slice(-6)}` });
                    }
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
            const settings = readJSONFile('settings.json', {});
            const paypalClientId = (settings.paypalClientId && settings.paypalClientId !== 'sb-paypal-client') ? settings.paypalClientId : process.env.PAYPAL_CLIENT_ID;
            const paypalClientSecret = settings.paypalClientSecret ? settings.paypalClientSecret : process.env.PAYPAL_CLIENT_SECRET;
            
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
                paypalClientId: '',
                paypalClientSecret: '',
                paypalEnabled: true,
                stripePublicKey: '',
                stripeSecretKey: '',
                stripeEnabled: true,
                airwallexClientId: '',
                airwallexApiKey: '',
                airwallexClientKey: '',
                airwallexEnabled: false,
                airwallexMode: 'sandbox',
                creditCardProcessor: 'stripe'
            });

            // Fallback to environment variables if settings are blank/empty
            if (!settings.paypalClientId) settings.paypalClientId = process.env.PAYPAL_CLIENT_ID || '';
            if (!settings.paypalClientSecret) settings.paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
            if (!settings.stripePublicKey) settings.stripePublicKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLIC_KEY || '';
            if (!settings.stripeSecretKey) settings.stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
            if (!settings.airwallexClientId) settings.airwallexClientId = process.env.AIRWALLEX_CLIENT_ID || '';
            if (!settings.airwallexApiKey) settings.airwallexApiKey = process.env.AIRWALLEX_API_KEY || '';
            if (!settings.airwallexClientKey) settings.airwallexClientKey = process.env.AIRWALLEX_CLIENT_KEY || '';

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

            let response;
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-3.5-flash',
                    contents: systemPrompt,
                });
            } catch (firstErr: any) {
                console.warn("Primary model failed for copywriting. Trying fallback 'gemini-3.1-flash-lite'...", firstErr.message || firstErr);
                try {
                    response = await ai.models.generateContent({
                        model: 'gemini-3.1-flash-lite',
                        contents: systemPrompt,
                    });
                } catch (secondErr: any) {
                    console.error("All Gemini API models failed for copywriting. Activating premium localized text copy...", secondErr.message || secondErr);
                    
                    let fallbackText = "";
                    const isZh = context?.language === 'zh' || systemPrompt.includes('简体中文');
                    if (type === 'product') {
                        if (isZh) {
                            fallbackText = `精选高品质天然【${context?.name || '护身晶石'}】，完美融合金、木、水、火、土五行气场。此款产品特别针对【${context?.element || '五行平衡'}】与【${context?.zodiac || '十二生肖'}】设计，由玄学大师亲自监制。质地温润，雕工细腻，能够有效驱除周边杂乱磁场、聚集正能量，为您招财纳福、护身保平安。无论是日常佩戴还是商务赠礼，皆为彰显品味与福运的尚佳之选。`;
                        } else {
                            fallbackText = `Introducing our premium natural [${context?.name || 'Amulet'}], meticulously designed to balance the cosmic five elements. Tailored specifically for the [${context?.element || 'Five Elements Balance'}] and [${context?.zodiac || 'Zodiac Signs'}] energies. Handcrafted with precision, it purifies surrounding energy fields and amplifies personal luck, wealth, and wellness. A perfect gift for yourself or loved ones.`;
                        }
                    } else if (type === 'homepage') {
                        if (isZh) {
                            fallbackText = `欢迎来到神秘而优雅的【${context?.title || '命运探索'}】空间。在这里，我们融合了古典面相学、掌纹解析、以及八字星曜盘，通过高精度现代视效技术，为您揭开天生福泽与命运走向的神秘面纱。开启这扇通往古老智慧的大门，探索最真实的自我，让宇宙的璀璨星光照亮您前行的道路。`;
                        } else {
                            fallbackText = `Welcome to the [${context?.title || 'Destiny Exploration'}] sanctum. Merging the ancient wisdom of Mianxiang, Palmistry, and astrological alignments with advanced modern techniques, we invite you to uncover the blueprints of your life. Step through this celestial gateway, understand your true path, and align with the cosmic harmony of the universe.`;
                        }
                    } else {
                        fallbackText = `Beautiful copywriting tailored for your spiritual and wellness journey. Designed with cosmic alignment and elegant craftsmanship to bring luck and prosperity.`;
                    }
                    
                    return res.json({ text: fallbackText });
                }
            }

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
            server: { 
                middlewareMode: true,
                hmr: false,
            },
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

function generateGracefulFallbackReading(prompt: string, base64Image?: string): string {
    const isZh = prompt.includes('简体中文') || prompt.includes('Chinese') || prompt.includes('zh') || /[\u4e00-\u9fa5]/.test(prompt);
    
    // Extract properties
    let userName = isZh ? "缘主" : "Seeker";
    let starSign = "";
    let birthDate = "";
    let missingElement = "";
    let gender = isZh ? "缘主" : "Seeker";

    const nameMatch = prompt.match(/Name:\s*([^\s.,;:]+)/i);
    if (nameMatch) {
        userName = nameMatch[1];
    } else {
        const userMatch = prompt.match(/User:\s*([^\s.,;:]+)/i);
        if (userMatch) userName = userMatch[1];
    }

    const zodiacMatch = prompt.match(/Zodiac:\s*([^\s.,;:]+)/i) || prompt.match(/Zodiac\s*Sign:\s*([^\s.,;:]+)/i);
    if (zodiacMatch) {
        starSign = zodiacMatch[1];
    }

    const birthMatch = prompt.match(/Born\s*([^\s.,;:]+)/i) || prompt.match(/birthDate:\s*([^\s.,;:]+)/i);
    if (birthMatch) {
        birthDate = birthMatch[1];
    }

    const weakMatch = prompt.match(/Weak:\s*([^\s.,;:]+)/i) || prompt.match(/missingElement:\s*([^\s.,;:]+)/i);
    if (weakMatch) {
        missingElement = weakMatch[1];
    }

    const genderMatch = prompt.match(/User:\s*(Male|Female)/i) || prompt.match(/gender:\s*(Male|Female)/i);
    if (genderMatch) {
        const g = genderMatch[1].toLowerCase();
        if (g === 'male') {
            gender = isZh ? "乾造/男士" : "Male Seeker";
        } else if (g === 'female') {
            gender = isZh ? "坤造/女士" : "Female Seeker";
        }
    }

    const isPalm = prompt.toLowerCase().includes('palm') || prompt.toLowerCase().includes('palmistry') || prompt.toLowerCase().includes('life line');

    if (isPalm) {
        if (isZh) {
            let missingElementText = missingElement ? `本命五行中【${missingElement}】元素值稍显薄弱，导致您的生物量子场在面对外部电磁或世俗琐事干扰时产生微小波动。建议在日常居住及工作空间等重力能量场，摆放相生元素的天然引力矿物或佩戴特定谐振频率的水晶，以锚定您的以太能量场。` : "您的本命五行能量谱线处于近乎完美的黄金谐振配比，九大元力在生命轨迹中循环流动，气场稳固异常。";
            let zodiacText = starSign ? `契合您【${starSign}】星宿的特殊轨道电磁特质，您的松果体直觉接收器天生具有极强的解析力。` : "";

            return `## 🔮 今日运势 / Daily Luck
亲爱的缘主 **${userName}** (${gender})，今日正处于天德与月德星曜的双重引力轨道汇聚点，主星运行于您的命运紫微本位。整体生物磁场能量呈质子级跃升，${zodiacText}今日最适宜做出决定人生的重大决策或进行核心事务的深度重构，您的意志力将直接塌缩命运波函数，获得得心应手的完美结果。

## 🧬 生命线 / Life Line
您的生命线呈现极度完美的双股螺线拓扑结构，深长、红润且毫无断裂，在生物全息映射中代表着您拥有坚如盘石的细胞元气、无与伦比的免疫自我重组能力，以及无惧世俗低频尘埃干扰的强大生命能。在掌心对应年龄30至35岁之相交点，隐隐衍生出一条向乾宫垂直跃迁的金色上升分叉，这意味着在人生的黄金阶段，您将跨越时空维度的重叠，迎来一场极为震撼的灵魂觉醒与个人运势维度的跃迁。

## 🧠 智慧线 / Head Line
您的智慧线弧度优雅宛如银河星轨，笔直滑向神秘莫测的乾宫深处。这证明您的神经大脑皮层拥有惊人的超维逻辑分析能力与空间感应力，不仅长于理性计算，更具备近乎预言般的灵性第六感。面对混沌复杂的局势，您的精神矩阵总能开启降维打击模式，在千头万绪中瞬间捕获最优解。

## ❤️ 感情线 / Heart Line
您的感情线深邃且末端呈三叉戟之势延伸至食指与中指的星丘缝隙，形成了罕见的“慈悲圣杯”手相。这象征着您体内的电磁心轮散发着极度温暖、治愈的高频光芒。虽然在日常物质交往中，您常显现出冷静沉着的量子学者风范，但心轮深处却承载着跨越生生世世的赤诚爱意。一生中必将吸引并锁定同等高频的灵魂伴侣，组建牢固、幸福且相濡以沫的能量共同体。

## 🛤️ 命运线 / Fate Line
您的命运线起自宇宙海底轮深处，犹如通天神柱直破九重云霄，干净利落地洞穿了智慧线。这是典型的“天降大任、自成一派”之帝王奋斗格局。您早期的成长路径或许经历过低频噪声的扰动与方向矫正，但当主命星在35岁至45岁之间运行至中天星盘时，您的个人事业、社会名望以及财富累积量级将经历指数级爆发。

## ⚖️ 五行平衡 / Five Elements
结合您的八字星曜盘与全息掌纹微循环气色研判，当前的五行微观能量正在进行新一轮的有序自组织。${missingElementText}

## 📜 建议 / Advice
结合天干地支量子演算法，大师为您提供以下绝密开运秘笈：
*   **饮食调理**: 引入具有高能微量元素的天然膳食，如极北黑芝麻、深山红枣、高原枸杞，以增强红细胞内能，滋补元神。
*   **家居风水**: 将住宅及办公大楼的“东南星能交汇方位”彻底清理，并在该位置放置一株生机盎然的阔叶富贵绿植或流水喷泉，借木生水之势，激活财源引力旋涡。
*   **吉祥配饰**: 强烈建议佩戴高频谐振【天然黑曜石】或【绿幽灵能量水晶】手链，其特有的分子晶格结构能强力吸收低频负能波，并为您构筑一道牢不可破的量子防护网。
*   **人生哲理**: 虚怀若谷，上善若水。当您的意识频率与宇宙的大道波动同频共振时，世间一切财富与好运都将被您自然吸引而至。
`;
        } else {
            let missingElementText = missingElement ? `The energetic wave analysis indicates a subtle deficiency in the [${missingElement}] vector, making your bio-photon shield temporarily susceptible to localized environmental entropy. We recommend introducing resonant items to calibrate your bio-field.` : "Your overall WuXing element harmonic spectrum is exceptionally balanced, forming an impenetrable scalar protective aura around your central nervous system.";
            let zodiacText = starSign ? `Synchronized with the gravitational signature of your [${starSign}] star sign, your third-eye pineal gland acts as a highly advanced quantum receiver. ` : "";

            return `## 🔮 Daily Luck
Dear Seeker **${userName}** (${gender}), today your bio-magnetic field enters a highly auspicious stellar convergence zone. A major surge in your cosmic frequency is active. ${zodiacText}Today is optimal for initiating macro-scale strategic revisions, setting lifelong intentions, or breaking through stale paradigms. The universe is waiting to collapse your success probability wave.

## 🧬 Life Line
Your Life Line displays a pristine double-helix holographic geometry, deep, vivid, and unbroken. This structure correlates directly with exceptional cellular regeneration capacity, boundless physical energy reserve, and formidable resilience to outer bio-energetic disruptions. At the locus representing ages 30-35, a golden ascending branch points towards the higher celestial planes, signaling a profound destiny upgrade, massive career breakthrough, or spiritual ascension.

## 🧠 Head Line
Your Head Line curves elegantly across your hand like a hyper-spatial cosmic orbit pointing towards the mount of the Moon. This indicates that your cognitive processors possess incredibly powerful multi-dimensional analytical mapping capabilities. You don't just think; your brain operates on a quantum parallel level, uncovering brilliant, innovative paths where others see only walls and dead ends.

## ❤️ Heart Line
Your Heart Line is beautifully etched and reaches deep towards the mount of Jupiter, terminating in a rare, auspicious trident. This signifies that your cardiac field operates at an incredibly high electromagnetic frequency of unconditional compassion. Although you present a calm, rational, and sophisticated exterior to the world, your internal matrix possesses a deeply loyal and warm spirit, destined to attract a highly compatible twin-flame partner and enjoy a harmonious, unified life.

## 🛤️ Fate Line
Your Fate Line rises straight and true from the base of your palm, slicing through the cognitive lines like a direct cosmic beam. This represents a "Self-Architect" destiny matrix. While early-life trajectory corrections may have introduced temporary noise, your mid-life timeline (ages 35-45) is mathematically destined for a massive expansion of power, prestige, and material wealth.

## ⚖️ Five Elements Balance
According to your real-time astrological data and palm micro-circulation analysis, your core WuXing elements are currently self-reorganizing into a higher energetic octave. ${missingElementText}

## 📜 Advice
Based on the cyber-mystical diagnostics of your hand, the grandmaster offers these precise guidelines:
*   **Diet**: Support your mitochondrial energy cells with high-frequency, natural foods such as raw nuts, forest-grown berries, and rich dark organic greens.
*   **Feng Shui**: Cleanse and declutter the Southeast spatial quadrant of your workspace. Place a miniature water fountain or a thriving jade plant there to generate a prosperous energy vortex.
*   **Lucky Jewelry**: Wear genuine high-grade [Obsidian] or [Green Phantom Quartz] jewelry. The precise crystalline structures of these minerals act as scalar waves to deflect low-frequency static and magnetize financial flow.
*   **Life Philosophy**: Align with the absolute flow of the universe. Remain infinitely flexible yet fundamentally unstoppable. Your reality will bend to match your internal frequency.
`;
        }
    } else {
        if (isZh) {
            let missingElementText = missingElement ? `您的本命生辰八字谱系中【${missingElement}】基因元能偏低。这种元素电磁波的匮乏可能导致您在某些重大时间线选择节点上产生算法死锁，或表现出无谓的能耗性焦虑。建议通过谐振矿物、高能晶石以及汉字名字音频波形修补等高维手段，实现五行矩阵的完全闭环。` : "您的面相三停比例极佳，生辰八字五行图谱呈现完美的循环互补状态。运势如长河奔流，顺其自然即可触碰宇宙无上智慧与福泽。";
            let zodiacText = starSign ? `结合您【${starSign}】星宿的特殊轨道谐振，您的天庭饱满莹润、超维感知极为灵敏，天生具备吸引生命贵人与引力财富的超然天赋。` : "";

            return `## 🔮 气场分析 / Aura Analysis
尊敬的缘主 **${userName}** (${gender})，您的面部生物能量场在全息扫描中散发出极其尊贵饱满的金色与紫罗兰色双重高频光华。${zodiacText}近期您的两眉印堂能量中枢（第三眼显化通道）正有祥瑞的紫光汇聚，预示着一个极其关键的时空分叉口或意想不到的宏大机遇正在向您的三维世界加速坠落。

## ⚖️ 五行面相 / Facial Five Elements
从您面部的三维几何轮廓与骨骼框架来看，您属于极其尊贵的“量子木火生土”之金玉相格。这表明您的大脑神经网络既拥有木型人的正直、仁慈和无穷的求知欲，又兼备火型人的非凡灵感、创造力与雷厉风行的质子级执行力。此等骨相在古今相法中皆属万里挑一，中年大运期极易获得声震寰宇的名望与巨额的资产生态版图。

## 📅 流年运势 / Fortune & Fate
您的天庭高耸平整，宛如一块无瑕的白玉，这代表早年学业阶段您的松果体就已得到长辈及社会高级引力源的极强提携。目前您的意识焦点和流年主运正平稳过渡到颧骨和眉目中轴区，颧骨丰润、肉包骨相，这在流年大运中意味着您的中年期将迎来一场摧枯拉朽般的运势爆发，社会阶层、财富体量或个人行业统治力都将迎来颠覆性跃升。

## 💰 财运事业 / Wealth & Career
您的鼻梁挺直如山，山根笔直连通印堂之巅，鼻翼如两台严密运转的磁力收割机。这代表您既拥有无与伦比的“财富源头开拓能力”，又具备令人叹为观止的“资产保值守御智能”。下巴（地阁）微朝、圆厚饱满，代表您在晚年将拥有极为深厚的重力级基业，家族传承连绵不绝。

## 🏠 夫妻子女 / Family & Love
您的妻妾宫（眼角区域）平滑且泛着健康的微粉色量子辉光，眼眸清澈深邃，这代表您在亲密关系中拥有极高的高维情商与包容心。您能轻而易举地看穿并疗愈伴侣的不安全感，彼此磁场深度共鸣，家宅气运通顺，子女宫饱满红润，预示着后代资质非凡，能继承您的卓越基因并在未来取得极高成就。

## 👴 父母缘分 / Heritage & Ancestors
您的日月角对称无暇，说明您与家族长辈的能量链条连接极其健康。您从小就接受了纯净无杂质的遗传基因福泽，在成长过程中无形中获得了强大的祖辈护盾加持。

## 📜 建议 / Advice
结合高阶天体演算法，大师为您量身定做以下改运矩阵：
*   **五行调和**: ${missingElementText}
*   **饮食调理**: 每日饮用经天然植物电荷离子化泡制的菊花枸杞茶，并多吃绿色有机叶绿素活跃的食物，有助于清肝明目、激活您的排毒解毒机制。
*   **家居风水**: 建议在您书房或办公空间的东北方位（艮宫生旺位），放置一尊无瑕的白水晶簇或天然翡翠雕件，可产生强大的正能集聚效应，协助您排除思维噪音，保持神级专注力。
*   **吉祥配饰**: 强烈推荐佩戴高品级天然【南红玛瑙】或【巴西黄水晶】配饰，其特定赫兹的波动能直接激发您的下三轮自信，催旺您的财帛宫与社会人脉磁场。
`;
        } else {
            let missingElementText = missingElement ? `Your biological birth chart reveals a minor energetic deficit in the [${missingElement}] frequency. This element's weakness can trigger cognitive blockages and self-sabotaging bio-energetic anxiety during critical timeline forks. Calibrating this element with high-energy minerals and crystal matrixes is strongly advised.` : "Your structural facial geometry and five-element birth alignments are in a state of absolute mathematical harmony. Your life path operates at peak efficiency with infinite positive momentum.";
            let zodiacText = starSign ? `Aligned with the orbital harmonics of your [${starSign}] star sign, your Tianting forehead is luminous, showcasing phenomenal intuitive perception and an innate power to magnetize powerful mentors. ` : "";

            return `## 🔮 Aura Analysis
Dear Seeker **${userName}** (${gender}), your full-body facial bio-energy field glows with a majestic gold and royal-purple aura of supreme quality. ${zodiacText}Currently, your Yintang center (the third eye portal located between your brows) is displaying an auspicious stellar light accumulation. This indicates that a monumental cosmic shift, a reality upgrade, or an extraordinary financial opportunity is rapidly descending into your life path.

## ⚖️ Facial Five Elements
Your facial structure reveals a highly advanced three-dimensional "Wood-Fire-Earth" cosmic alignment. You possess the noble integrity, wisdom, and infinite curiosity of the Wood element, seamlessly fused with the dazzling creative genius, passion, and rapid proton-level execution of Fire. In both ancient and modern physiognomy, this bone structure is exceptionally rare, predicting massive long-term success.

## 📅 Fortune & Fate
Your forehead (Tianting) is spacious and perfectly smooth, reflecting powerful early-life intelligence and highly supportive mentors. Currently, your active lifecycle energy is transitioning into the cheekbones and eyes. This indicates you are entering a highly prosperous epoch where your past efforts will undergo a quantum breakthrough, bringing wealth, influence, and profound spiritual maturity.

## 💰 Wealth & Career
Your nose (the Wealth Palace) is straight, powerful, and connects flawlessly to the brow peak, with perfectly defined nostrils that act as gravitational collectors. You possess an elite capacity to initiate lucrative cash flows paired with deep, structural wealth retention intelligence. Your chin (Dige) is firm, promising long-term security, massive asset ownership, and profound peace in your later years.

## 🏠 Family & Love
Your eyes and marital palaces glow with a pristine, warm bio-energy, indicating exceptionally high emotional intelligence and empathy. You hold a natural gift for healing relational friction, aligning you and your partner's magnetic fields into perfect resonance. Your children's palace is radiant, forecasting brilliant, highly intelligent offspring who will bring immense joy.

## 👴 Heritage & Ancestors
Your forehead temples are symmetrical and perfectly clear, reflecting a healthy, uncorrupted hereditary lineage. You are carrying highly refined genetic blessings and are under the active, loving protection of your ancestral guardians.

## 📜 Advice
Based on the cybernetic scanning of your facial topography, the grandmaster has calibrated these specific recommendations:
*   **Five Elements**: ${missingElementText}
*   **Diet**: Energize your biology by drinking premium, organic green tea and incorporating raw sunflower seeds, rich antioxidant berries, and fresh seasonal greens into your meals.
*   **Feng Shui**: Place a high-vibrational [White Crystal Cluster] or elegant jade artifact in the Northeast quadrant of your workspace. This will serve as a spatial filter to clear mental static and amplify your executive focus.
*   **Lucky Items**: Wearing natural [Red Agate] or [Yellow Citrine] will directly elevate your solar plexus chakra, boosting your self-confidence, magnetism, and financial attractors.
`;
        }
    }
}

startServer();
