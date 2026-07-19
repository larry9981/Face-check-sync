import { Product } from './types';
import { CHINESE_ZODIAC, WESTERN_SIGNS, ZODIAC_ELEMENTS, ProductDataCache } from './utils';

const generateProducts = (): Product[] => {
    const products: Product[] = [];

    // 1. Chinese Zodiac Products
    CHINESE_ZODIAC.forEach(z => {
       const element = ZODIAC_ELEMENTS[z] || 'Metal';
       
       // Jade + Chinese Zodiac Bracelet
       products.push({
          id: `jade_brace_${z.toLowerCase()}`,
          nameKey: 'productNameJadeBracelet',
          defaultName: `Jade ${z} Bracelet`,
          price: "$139.99",
          numericPrice: 139.99,
          imagePrompt: `exquisite premium natural white jade beads combined with a beautiful gold ${z} zodiac lucky charm bracelet, spiritual feng shui energy beads, soft peaceful glow, luxury product shot, white velvet background`,
          descKey: 'productDescJadeBracelet',
          category: 'bracelet',
          zodiac: z,
          element: element
       });
       
       // Jade Chinese Zodiac Pendant Necklace
       products.push({
          id: `jade_pend_${z.toLowerCase()}`,
          nameKey: 'productNameJadePendant',
          defaultName: `Jade ${z} Necklace Pendant`,
          price: "$189.99",
          numericPrice: 189.99,
          imagePrompt: `sacred natural green jadeite jade necklace pendant carving of chinese zodiac ${z} guardian spirit, gold bail, mystical peaceful aura, floating in ethereal mist, spiritual healing jewelry, high resolution product photography`,
          descKey: 'productDescJadePendant',
          category: 'pendant',
          zodiac: z,
          element: element
       });
    });

    // 2. Western Zodiac Products
    const WESTERN_ELEMENT_MAP: any = {
        'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
        'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
        'Gemini': 'Metal', 'Libra': 'Metal', 'Aquarius': 'Metal',
        'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };

    WESTERN_SIGNS.forEach(sign => {
        const element = WESTERN_ELEMENT_MAP[sign] || 'Wood';

        // Jade Western Constellation Bracelet
        products.push({
            id: `jade_brace_${sign.toLowerCase()}`,
            nameKey: 'productNameStarJadeBracelet',
            defaultName: `Jade ${sign} Constellation Bracelet`,
            price: "$149.99",
            numericPrice: 149.99,
            imagePrompt: `mystical light blue jadeite beads and lapis lazuli cosmic constellation ${sign} star sign bracelet, detailed sacred geometry golden charm, soft stardust aura, dark velvet background, premium spiritual jewelry`,
            descKey: 'productDescStarJadeBracelet',
            category: 'bracelet',
            zodiac: sign,
            element: element
        });

        // Jade Western Constellation Necklace Pendant
        products.push({
            id: `jade_pend_${sign.toLowerCase()}`,
            nameKey: 'productNameStarJadePendant',
            defaultName: `Jade ${sign} Constellation Pendant`,
            price: "$199.99",
            numericPrice: 199.99,
            imagePrompt: `beautifully hand-polished premium raw crystalline jade gemstone necklace pendant, custom engraved with celestial ${sign} constellation emblem, delicate silver chain, glowing with starlight nebula, luxury product shot`,
            descKey: 'productDescStarJadePendant',
            category: 'pendant',
            zodiac: sign,
            element: element
        });
    });

    return products;
};

// INITIALIZATION LOGIC
// Check if we have cached product data (text/structure) to avoid re-generating standard data 
// and to persist any dynamic changes if we add them later.
let cachedData = ProductDataCache.get();
if (!cachedData || !Array.isArray(cachedData) || cachedData.length === 0) {
    cachedData = generateProducts();
    ProductDataCache.set(cachedData);
} else {
    // If cache exists but has the old products structure, regenerate to match new requirement
    const hasOldStructure = cachedData.some(p => p.id.startsWith('amulet_') || p.id.startsWith('brace_') && !p.id.startsWith('jade_'));
    if (hasOldStructure) {
        cachedData = generateProducts();
        ProductDataCache.set(cachedData);
    }
}

export const SHOP_PRODUCTS: Product[] = cachedData;
