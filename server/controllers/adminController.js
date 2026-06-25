const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { Category, Coupon } = require('../models/Category')
const { asyncHandler, AppError } = require('../middlewares/error')

// Dashboard stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalProducts, totalSellers, revenueResult] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
    Product.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'seller' }),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ])

  const revenue = revenueResult[0]?.total || 0

  // Monthly revenue for chart
  const monthlyRevenue = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled'] }, createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  res.json({
    success: true,
    stats: { totalUsers, totalOrders, totalProducts, totalSellers, revenue },
    monthlyRevenue,
  })
})

// Users management
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query
  const query = {}
  if (role) query.role = role
  if (status) query.status = status
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }]

  const [users, total] = await Promise.all([
    User.find(query).select('-password -refreshTokens').sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit)).limit(Number(limit)),
    User.countDocuments(query),
  ])

  res.json({ success: true, users, pagination: { page: Number(page), total, totalPages: Math.ceil(total / Number(limit)) } })
})

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new AppError('User not found', 404)
  if (user.role === 'admin') throw new AppError('Cannot modify admin status', 403)

  user.status = req.body.status
  await user.save()
  res.json({ success: true, user })
})

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new AppError('User not found', 404)
  if (user.role === 'admin') throw new AppError('Cannot delete admin', 403)
  await user.deleteOne()
  res.json({ success: true, message: 'User deleted' })
})

// Product management
exports.approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status || 'active' },
    { new: true }
  )
  if (!product) throw new AppError('Product not found', 404)
  res.json({ success: true, product })
})

// Category management
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, createdBy: req.user._id })
  res.status(201).json({ success: true, category })
})

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 })
  res.json({ success: true, categories })
})

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!category) throw new AppError('Category not found', 404)
  res.json({ success: true, category })
})

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) throw new AppError('Category not found', 404)
  await category.deleteOne()
  res.json({ success: true, message: 'Category deleted' })
})

// Coupon management
exports.createCoupon = asyncHandler(async (req, res) => {
  const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() })
  if (existing) throw new AppError('Coupon code already exists', 400)
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id })
  res.status(201).json({ success: true, coupon })
})

exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 })
  res.json({ success: true, coupons })
})

exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!coupon) throw new AppError('Coupon not found', 404)
  res.json({ success: true, coupon })
})

exports.deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Coupon deleted' })
})

// Validate coupon (used by customers)
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

  if (!coupon) throw new AppError('Invalid coupon code', 400)
  if (coupon.expiryDate < new Date()) throw new AppError('Coupon has expired', 400)
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', 400)
  if (coupon.usedBy.includes(req.user._id)) throw new AppError('You have already used this coupon', 400)
  if (orderAmount && orderAmount < coupon.minOrderAmount) {
    throw new AppError(`Minimum order amount of ₹${coupon.minOrderAmount} required`, 400)
  }

  let discount = coupon.discount
  if (coupon.type === 'percentage' && coupon.maxDiscount && orderAmount) {
    const percentDiscount = (orderAmount * coupon.discount) / 100
    discount = Math.min(percentDiscount, coupon.maxDiscount)
    discount = coupon.discount // return percent for frontend to calculate
  }

  res.json({
    success: true,
    coupon: { code: coupon.code, type: coupon.type, discount: coupon.discount, maxDiscount: coupon.maxDiscount },
  })
})

// Seller management
exports.getSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: 'seller' }).select('-password -refreshTokens').sort({ createdAt: -1 })
  res.json({ success: true, sellers })
})

exports.approveSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role !== 'seller') throw new AppError('Seller not found', 404)
  user.sellerInfo.isApproved = req.body.isApproved
  await user.save()
  res.json({ success: true, user })
})

// Reports
exports.getReports = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query
  const startDate = new Date(Date.now() - Number(period) * 24 * 60 * 60 * 1000)

  const [salesData, topProducts, topSellers, categoryData] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Product.find({ status: 'active' }).sort({ totalSales: -1 }).limit(10).select('name totalSales price images'),

    User.aggregate([
      { $match: { role: 'seller' } },
      { $sort: { 'sellerInfo.totalRevenue': -1 } },
      { $limit: 10 },
      { $project: { name: 1, 'sellerInfo.totalRevenue': 1, 'sellerInfo.totalSales': 1 } },
    ]),

    Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 }, revenue: { $sum: { $multiply: ['$price', '$totalSales'] } } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ])

  res.json({ success: true, salesData, topProducts, topSellers, categoryData })
})
