
import { Product } from './types';
import { CHINESE_ZODIAC, WESTERN_SIGNS, ZODIAC_ELEMENTS } from './utils';

export const SHOP_PRODUCTS: Product[] = [];

// 1. Chinese Zodiac Products
CHINESE_ZODIAC.forEach(z => {
   const element = ZODIAC_ELEMENTS[z] || 'Metal'; // Default to Metal if not found
   
   SHOP_PRODUCTS.push({
      id: `brace_${z}`,
      nameKey: 'productNameBracelet',
      defaultName: `${z} Fortune Bracelet`,
      price: "$99.99",
      numericPrice: 99.99,
      imagePrompt: `luxury chinese zodiac ${z} obsidian gold feng shui bracelet product photography black background`,
      descKey: 'productDescBracelet',
      category: 'bracelet',
      zodiac: z,
      element: element
   });
   SHOP_PRODUCTS.push({
      id: `pend_${z}`,
      nameKey: 'productNamePendant',
      defaultName: `${z} Jade Pendant`,
      price: "$169.99",
      numericPrice: 169.99,
      imagePrompt: `luxury chinese green jade pendant necklace zodiac ${z} carving product photography black background`,
      descKey: 'productDescPendant',
      category: 'pendant',
      zodiac: z,
      element: element
   });
});

// 2. Western Zodiac Products (Assigned somewhat arbitrarily to elements for balance variety, or based on Astrology elements)
const WESTERN_ELEMENT_MAP: any = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Metal', 'Libra': 'Metal', 'Aquarius': 'Metal', // Air often maps to Metal in some systems, or Wood. Using Metal for balance.
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
};

WESTERN_SIGNS.forEach(sign => {
    const element = WESTERN_ELEMENT_MAP[sign] || 'Wood';

    SHOP_PRODUCTS.push({
        id: `amulet_${sign}`,
        nameKey: 'productNameAmulet',
        defaultName: `Golden ${sign} Amulet`,
        price: "$129.99",
        numericPrice: 129.99,
        imagePrompt: `luxury gold necklace pendant zodiac sign ${sign} diamonds jewelry product photography black background`,
        descKey: 'productDescAmulet',
        category: 'amulet',
        zodiac: sign,
        element: element
    });
});
