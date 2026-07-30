import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed
  name: { type: String },
  authType: { type: String, default: 'email' },
  registeredAt: { type: Date, default: Date.now },
  // Address info
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  country: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  streetAddress: { type: String, default: '' },
  buildingName: { type: String, default: '' },
  roomNumber: { type: String, default: '' },
  // Subscription info
  isSubscribed: { type: Boolean, default: false },
  subscriptionPlan: { type: String, default: '' },
  subscribedAt: { type: Date },
  subscriptionExpiresAt: { type: Date },
  
  // Custom free welcome credits for newly registered users (3 Face & 3 Palm scans)
  freeFaceRemaining: { type: Number, default: 3 },
  freePalmRemaining: { type: Number, default: 3 },
  trialStartDate: { type: String, default: null },
  totalTests: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, index: true },
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
  sku: { type: String, default: '' },
  status: { type: String, default: 'active' }, // 'active' for listed, 'inactive' for delisted
  longDescription: { type: String, default: '' },
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

const ArticleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleEn: { type: String },
  category: { type: String, default: '面相识人' },
  categoryEn: { type: String, default: 'Physiognomy' },
  summary: { type: String },
  summaryEn: { type: String },
  readTime: { type: String, default: '5 min read' },
  publishDate: { type: String },
  author: { type: String, default: '天机之眼命理研究院' },
  authorEn: { type: String, default: 'TianJiEyes Institute' },
  coverImage: { type: String },
  tags: [{ type: String }],
  content: { type: String, required: true },
  contentEn: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const History = mongoose.model('History', HistorySchema);
export const Product = mongoose.model('Product', ProductSchema);
export const HomepageConfig = mongoose.model('HomepageConfig', HomepageConfigSchema);
export const ArticleModel = mongoose.model('Article', ArticleSchema);
