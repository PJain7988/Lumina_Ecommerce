const express = require('express')
const router = express.Router()
const { getSellerOrders, updateOrderStatus } = require('../controllers/orderController')
const { protect, authorize } = require('../middlewares/auth')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { asyncHandler } = require('../middlewares/error')

// All routes require seller or admin role
router.use(protect, authorize('seller', 'admin'))

// Products
router.get('/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query
  const query = { seller: req.user._id }
  if (status) query.status = status

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit)).limit(Number(limit)),
    Product.countDocuments(query),
  ])
  res.json({ success: true, products, pagination: { page: Number(page), total } })
}))

// Orders
router.get('/orders', getSellerOrders)
router.put('/orders/:id/status', updateOrderStatus)

// Analytics
router.get('/analytics', asyncHandler(async (req, res) => {
  const [totalProducts, orders] = await Promise.all([
    Product.countDocuments({ seller: req.user._id }),
    Order.find({ 'items.seller': req.user._id, status: { $nin: ['cancelled'] } }),
  ])

  const totalRevenue = orders.reduce((acc, o) => {
    const sellerItems = o.items.filter((i) => i.seller?.toString() === req.user._id.toString())
    return acc + sellerItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }, 0)

  res.json({
    success: true,
    analytics: {
      totalProducts,
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    },
  })
}))

// Inventory alerts (low stock)
router.get('/inventory/alerts', asyncHandler(async (req, res) => {
  const lowStock = await Product.find({
    seller: req.user._id,
    stock: { $lte: 10 },
    status: 'active',
  }).select('name stock images price')

  const outOfStock = await Product.find({
    seller: req.user._id,
    stock: 0,
    status: 'active',
  }).select('name images price')

  res.json({ success: true, lowStock, outOfStock })
}))

module.exports = router
