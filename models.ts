import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed
  name: { type: String },
  authType: { type: String, default: 'email' },
  // Subscription Management
  isSubscribed: { type: Boolean, default: false },
  subscriptionPlan: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
  subscriptionStatus: { type: String, enum: ['active', 'canceled', 'expired', 'none'], default: 'none' },
  nextBillingDate: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  
  trialStartDate: { type: Date, default: Date.now },
  hasPaidSingle: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  items: { type: String },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'paid' }
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

export const User = mongoose.model('User', UserSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const History = mongoose.model('History', HistorySchema);
