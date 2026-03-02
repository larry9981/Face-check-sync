
import { Product } from './types';
import { CHINESE_ZODIAC, WESTERN_SIGNS, ZODIAC_ELEMENTS, ProductDataCache } from './utils';

const generateProducts = (): Product[] => {
    const products: Product[] = [];

    // 1. Chinese Zodiac Products
    CHINESE_ZODIAC.forEach(z => {
       const element = ZODIAC_ELEMENTS[z] || 'Metal';
       
       products.push({
          id: `brace_${z}`,
          nameKey: 'productNameBracelet',
          defaultName: `${z} Fortune Bracelet`,
          price: "$99.99",
          numericPrice: 99.99,
          imagePrompt: `mystical spiritual chinese zodiac ${z} obsidian gold feng shui bracelet, soft ethereal lighting, zen garden background, soul healing aesthetic, high resolution product photography`,
          descKey: 'productDescBracelet',
          category: 'bracelet',
          zodiac: z,
          element: element
       });
       
       products.push({
          id: `pend_${z}`,
          nameKey: 'productNamePendant',
          defaultName: `${z} Jade Pendant`,
          price: "$169.99",
          numericPrice: 169.99,
          imagePrompt: `sacred chinese green jade pendant necklace zodiac ${z} carving, mystical aura, floating in ethereal mist, spiritual healing, soft cinematic lighting, high resolution`,
          descKey: 'productDescPendant',
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

        products.push({
            id: `amulet_${sign}`,
            nameKey: 'productNameAmulet',
            defaultName: `Golden ${sign} Amulet`,
            price: "$129.99",
            numericPrice: 129.99,
            imagePrompt: `celestial golden ${sign} zodiac amulet, glowing with cosmic energy, starry nebula background, mystical spiritual jewelry, high resolution cinematic photography`,
            descKey: 'productDescAmulet',
            category: 'amulet',
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
}

export const SHOP_PRODUCTS: Product[] = cachedData;
