const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
  isDefault: { type: Boolean, default: false },
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer',
  },
  avatar: {
    public_id: String,
    url: { type: String, default: '' },
  },
  phone: String,
  bio: String,
  addresses: [addressSchema],
  isVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  },
  rewardPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Seller fields
  sellerInfo: {
    storeName: String,
    storeDescription: String,
    isApproved: { type: Boolean, default: false },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },

  // Auth tokens
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  refreshTokens: [{ token: String, createdAt: Date }],

  lastLogin: Date,
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Generate JWT access token
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

// Generate refresh token
userSchema.methods.getRefreshToken = function () {
  const token = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  )
  this.refreshTokens.push({ token, createdAt: new Date() })
  return token
}

// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function () {
  const token = crypto.randomBytes(20).toString('hex')
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex')
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  return token
}

// Generate password reset token
userSchema.methods.getPasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000 // 30 minutes
  return token
}

// Generate referral code
userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = this.name.replace(/\s+/g, '').toUpperCase().slice(0, 4) +
      Math.random().toString(36).substring(2, 6).toUpperCase()
  }
  next()
})

module.exports = mongoose.model('User', userSchema)
