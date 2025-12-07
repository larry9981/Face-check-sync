
export interface UserState {
  freeTrials: number;
  isSubscribed: boolean;
  hasPaidSingle: boolean;
}

export interface Plan {
  id: string;
  title: string;
  price: string;
  desc: string;
  isSub: boolean;
}

export interface Product {
  id: string;
  nameKey: string;
  defaultName: string;
  price: string;
  numericPrice: number;
  imagePrompt: string;
  descKey: string;
  category: 'bracelet' | 'pendant' | 'amulet';
  zodiac: string;
  element?: string; // Added element property
}

export interface CartItem {
  product: Product;
  quantity: number;
}
