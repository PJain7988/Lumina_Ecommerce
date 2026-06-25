const mongoose = require('mongoose')
const slugify = require('slugify')

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: String,
  image: {
    public_id: String,
    url: String,
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true })
  }
  next()
})

const Category = mongoose.model('Category', categorySchema)

// ─── Coupon Model ──────────────────────────────────────────────

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
  },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableCategories: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

couponSchema.index({ expiryDate: 1 })

const Coupon = mongoose.model('Coupon', couponSchema)

module.exports = { Category, Coupon }
