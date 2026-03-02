import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed
  name: { type: String },
  authType: { type: String, default: 'email' },
  registeredAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  items: { type: String },
  total: { type: Number },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'paid' },
  customerName: { type: String },
  shippingAddress: { type: String },
  paymentMethod: { type: String },
  phone: { type: String }
});

const HistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: Date, default: Date.now },
  resultText: { type: String },
  gender: { type: String },
  name: { type: String },
  birthDate: { type: String },
  readingType: { type: String },
  elements: { type: Object },
  summary: { type: String }
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nameKey: { type: String },
  defaultName: { type: String },
  price: { type: String },
  numericPrice: { type: Number },
  category: { type: String },
  zodiac: { type: String },
  imagePrompt: { type: String },
  descKey: { type: String },
  defaultDescription: { type: String },
  imageUrl: { type: String },
  element: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const HomepageConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'banner1', 'fengshui'
  type: { type: String, required: true }, // 'banner' or 'section'
  title: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  imagePrompt: { type: String }, // For AI generation fallback
  order: { type: Number, default: 0 }
});

export const User = mongoose.model('User', UserSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const History = mongoose.model('History', HistorySchema);
export const Product = mongoose.model('Product', ProductSchema);
export const HomepageConfig = mongoose.model('HomepageConfig', HomepageConfigSchema);
