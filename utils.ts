
export const CHINESE_ZODIAC = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
export const WESTERN_SIGNS = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];

// Map Zodiacs to their Fixed Elements
export const ZODIAC_ELEMENTS: Record<string, string> = {
    'Rat': 'Water', 'Ox': 'Earth', 'Tiger': 'Wood', 'Rabbit': 'Wood', 
    'Dragon': 'Earth', 'Snake': 'Fire', 'Horse': 'Fire', 'Goat': 'Earth', 
    'Monkey': 'Metal', 'Rooster': 'Metal', 'Dog': 'Earth', 'Pig': 'Water'
};

export const ELEMENT_ADVICE: any = {
    'Metal': {
        color: 'Gold, Silver, White',
        direction: 'West',
        habit: 'Organization, Structure, Deep Breathing',
        desc: 'Your Metal energy is weak. To balance this, you need more structure and clarity. Wear metal jewelry or white clothing.',
        shopFilter: 'Metal',
        diet: 'Eat more white foods (pears, cauliflower, radish) and spicy flavors in moderation. Avoid too much bitter food.',
        home: 'Place metal ornaments or wind chimes in the West sector of your home. Use white or metallic decor themes.'
    },
    'Wood': {
        color: 'Green, Cyan',
        direction: 'East',
        habit: 'Growth, Learning, Gardening',
        desc: 'Your Wood energy is weak. You need to cultivate growth and flexibility. Spend time in nature and wear green accessories.',
        shopFilter: 'Wood',
        diet: 'Eat more green leafy vegetables and sour foods (lemons, green apples). Avoid excessive spicy food.',
        home: 'Place healthy plants or wooden furniture in the East sector. Use green colors in your living space.'
    },
    'Water': {
        color: 'Black, Blue',
        direction: 'North',
        habit: 'Reflection, Wisdom, Hydration',
        desc: 'Your Water energy is weak. Flow and adaptability are needed. Wear black or blue, and keep obsidian close to you.',
        shopFilter: 'Water',
        diet: 'Eat more black/dark foods (black beans, seaweed, black sesame) and salty flavors. Stay hydrated.',
        home: 'Place a water feature (fountain, aquarium) or mirrors in the North sector. Use blue or black decor.'
    },
    'Fire': {
        color: 'Red, Purple, Orange',
        direction: 'South',
        habit: 'Passion, Socializing, Sunlight',
        desc: 'Your Fire energy is weak. You lack warmth and drive. Wear red items or gold to ignite your inner passion.',
        shopFilter: 'Fire',
        diet: 'Eat more red foods (tomatoes, red peppers, red beans) and bitter flavors. Avoid cold/raw foods.',
        home: 'Ensure the South sector is well-lit. Use candles, lamps, or red decor accents to boost energy.'
    },
    'Earth': {
        color: 'Yellow, Brown, Beige',
        direction: 'Center / Northeast',
        habit: 'Grounding, Stability, Meditation',
        desc: 'Your Earth energy is weak. You need stability. Wear gemstones like Jade or Citrine to ground yourself.',
        shopFilter: 'Earth',
        diet: 'Eat more yellow/orange foods (pumpkin, corn, sweet potato) and sweet natural flavors.',
        home: 'Place ceramics, crystals, or stones in the Northeast or Center of your home. Use earth tones.'
    }
};

export const getChineseZodiac = (dateStr: string) => {
  if (!dateStr) return null;
  const year = new Date(dateStr).getFullYear();
  return CHINESE_ZODIAC[(year - 4) % 12];
};

export const getWesternZodiac = (dateStr: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
  return null;
};

export const calculateAge = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    const birthDate = new Date(dateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

export const calculateWuXing = (year: string, month: string, day: string, hour: string, minute: string, second: string) => {
    const numStr = `${year}${month}${day}${hour}${minute}${second}`;
    let hash = 0;
    for (let i = 0; i < numStr.length; i++) {
        hash = ((hash << 5) - hash) + numStr.charCodeAt(i);
        hash |= 0;
    }
    const seed = Math.abs(hash);
    
    const scores = {
        Metal: (seed % 100),
        Wood: ((seed >> 2) % 100),
        Water: ((seed >> 4) % 100),
        Fire: ((seed >> 6) % 100),
        Earth: ((seed >> 8) % 100),
    };
    
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const normalized = {
        Metal: Math.round((scores.Metal / total) * 100),
        Wood: Math.round((scores.Wood / total) * 100),
        Water: Math.round((scores.Water / total) * 100),
        Fire: Math.round((scores.Fire / total) * 100),
        Earth: Math.round((scores.Earth / total) * 100),
    };

    let minVal = 100;
    let missingElement = 'Metal';
    (Object.keys(normalized) as Array<keyof typeof normalized>).forEach(key => {
        if (normalized[key] < minVal) {
            minVal = normalized[key];
            missingElement = key;
        }
    });

    return { scores: normalized, missingElement };
};

// --- IMAGE PERSISTENCE (INDEXEDDB) ---
// This acts as a "Local Folder" for the website.
export const ImagePersistence = {
    DB_NAME: 'MysticShopCache',
    STORE_NAME: 'images',
    dbPromise: null as Promise<IDBDatabase> | null,

    init: function() {
        if (this.dbPromise) return this.dbPromise;

        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event: any) => resolve(event.target.result);
            request.onerror = (event: any) => reject(event.target.error);
        });
        return this.dbPromise;
    },

    loadImage: async function(productId: string, prompt: string, size: number = 512): Promise<string> {
        try {
            const db = await this.init();
            
            // 1. Check if image exists in DB
            const tx = db.transaction(this.STORE_NAME, 'readonly');
            const store = tx.objectStore(this.STORE_NAME);
            
            // Create a composite key for cache versioning (if prompt changes, id should conceptually change, 
            // but we use productId here. You might want to append hash of prompt if descriptions change often)
            const cacheKey = `${productId}_${size}`; 

            const cachedRecord: any = await new Promise((resolve) => {
                const req = store.get(cacheKey);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(null);
            });

            if (cachedRecord && cachedRecord.blob) {
                // Return local URL from Blob
                return URL.createObjectURL(cachedRecord.blob);
            }

            // 2. If not, generate/fetch it
            const seed = hashCode(productId);
            // Add 'flux' or other model params if needed, but keeping it standard for speed
            const remoteUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${size}&height=${size}&nologo=true&seed=${seed}`;
            
            const response = await fetch(remoteUrl);
            const blob = await response.blob();

            // 3. Save to DB
            const txWrite = db.transaction(this.STORE_NAME, 'readwrite');
            const storeWrite = txWrite.objectStore(this.STORE_NAME);
            storeWrite.put({ id: cacheKey, blob: blob, date: Date.now() });

            return URL.createObjectURL(blob);

        } catch (error) {
            console.error("ImagePersistence Error:", error);
            // Fallback to direct URL if DB fails
            const seed = hashCode(productId);
            return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${size}&height=${size}&nologo=true&seed=${seed}`;
        }
    }
};
