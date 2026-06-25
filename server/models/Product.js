const mongoose = require('mongoose')
const slugify = require('slugify')

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  avatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

const specificationSchema = new mongoose.Schema({
  key: String,
  value: String,
})

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: { type: String, unique: true },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    lowercase: true,
  },
  subcategory: String,
  brand: String,
  sku: { type: String, unique: true, sparse: true },
  images: [{
    public_id: String,
    url: String,
  }],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  specifications: [specificationSchema],
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'rejected'],
    default: 'pending',
  },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  flashDeal: {
    isActive: { type: Boolean, default: false },
    discountPercent: Number,
    startTime: Date,
    endTime: Date,
  },
  totalSales: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  shippingClass: {
    type: String,
    enum: ['standard', 'express', 'free'],
    default: 'standard',
  },
  returnPolicy: {
    type: String,
    default: '30 days return policy',
  },
  warranty: String,
}, { timestamps: true, suppressReservedKeysWarning: true })

// Create slug before save
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now()
  }
  next()
})

// Update rating when reviews change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0
    this.numReviews = 0
  } else {
    const totalRating = this.reviews.reduce((acc, r) => acc + r.rating, 0)
    this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10
    this.numReviews = this.reviews.length
  }
}

// Indexes for faster queries
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })
productSchema.index({ category: 1, status: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ totalSales: -1 })
productSchema.index({ seller: 1 })

module.exports = mongoose.model('Product', productSchema)
