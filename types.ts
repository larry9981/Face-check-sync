
export interface UserState {
  trialStartDate: string | null; // ISO Date string for when the first reading happened
  isSubscribed: boolean;
  hasPaidSingle: boolean;
  history: HistoryRecord[]; // Added history array
}

export interface HistoryRecord {
  id: number;
  date: string;
  resultText: string;
  elements: any;
  name: string;
  gender: string;
  birthDate: string;
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

export interface Order {
  id: string;
  customerName: string;
  items: string;
  total: number;
  date: string;
  status: 'paid' | 'pending';
  shippingAddress: string;
  paymentMethod: string;
  email?: string;
  phone?: string;
}
