const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'upi', 'cod'],
    required: true,
  },
  paymentResult: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    stripePaymentIntentId: String,
    status: String,
    paidAt: Date,
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  coupon: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  trackingNumber: String,
  trackingUrl: String,
  notes: String,
  cancellationReason: String,
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'processing', 'completed'],
    default: 'none',
  },
  refundAmount: Number,
}, { timestamps: true })

// Indexes
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ 'items.seller': 1 })

module.exports = mongoose.model('Order', orderSchema)
