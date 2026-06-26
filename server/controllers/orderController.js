const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const { asyncHandler, AppError } = require('../middlewares/error')
const { sendEmail, emailTemplates } = require('../services/emailService')

// @POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  console.log('Incoming order body:', JSON.stringify(req.body, null, 2))
  const { items, shippingAddress, paymentMethod, subtotal, discount, shipping, tax, total, coupon } = req.body

  if (!items || items.length === 0) throw new AppError('No items in order', 400)

  // Validate stock and build order items
  const orderItems = []
  for (const item of items) {
    const product = await Product.findById(item.product)
    if (!product) throw new AppError(`Product ${item.product} not found`, 404)
    if (product.stock < item.quantity) throw new AppError(`${product.name} has insufficient stock`, 400)

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
      seller: product.seller,
    })
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    coupon,
    isPaid: paymentMethod === 'cod' ? false : false,
    status: 'pending',
  })

  // For COD, mark as processing
  if (paymentMethod === 'cod') {
    order.status = 'processing'
    await order.save()

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSales: item.quantity },
      })
    }
  }

  // Send confirmation email
  try {
    const template = emailTemplates.orderConfirmation(req.user.name, order)
    await sendEmail({ to: req.user.email, ...template })
  } catch (err) {
    console.error('Order email failed:', err)
  }

  // Notify via socket
  const io = req.app.get('io')
  if (io) {
    io.to(`user_${req.user._id}`).emit('orderCreated', { orderId: order._id, status: order.status })
  }

  res.status(201).json({ success: true, order })
})

// @GET /api/orders/my-orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const query = { user: req.user._id }
  if (status) query.status = status

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('items.product', 'name images'),
    Order.countDocuments(query),
  ])

  res.json({
    success: true,
    orders,
    pagination: { page: Number(page), total, totalPages: Math.ceil(total / Number(limit)) },
  })
})

// @GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images slug')
    .populate('user', 'name email')

  if (!order) throw new AppError('Order not found', 404)

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403)
  }

  res.json({ success: true, order })
})

// @PUT /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw new AppError('Order not found', 404)

  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403)
  }

  if (!['pending', 'processing'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 400)
  }

  order.status = 'cancelled'
  order.cancellationReason = req.body.reason || 'Cancelled by customer'

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, totalSales: -item.quantity },
    })
  }

  await order.save()
  res.json({ success: true, order })
})

// @GET /api/seller/orders
exports.getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const query = { 'items.seller': req.user._id }
  if (status) query.status = status

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate('user', 'name email')
    .populate('items.product', 'name images')

  res.json({ success: true, orders })
})

// @PUT /api/seller/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  let { status, trackingNumber, trackingUrl } = req.body
  
  // Defensively handle if status is an object
  if (status && typeof status === 'object') {
    status = status.status
  }

  const order = await Order.findById(req.params.id)
  if (!order) throw new AppError('Order not found', 404)

  const isSeller = order.items.some((item) => item.seller?.toString() === req.user._id.toString())
  if (!isSeller && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403)
  }

  order.status = status
  if (trackingNumber) order.trackingNumber = trackingNumber
  if (trackingUrl) order.trackingUrl = trackingUrl
  if (status === 'delivered') {
    order.isDelivered = true
    order.deliveredAt = new Date()
  }
  await order.save()

  // Notify customer
  const io = req.app.get('io')
  if (io) {
    io.to(`user_${order.user}`).emit('orderStatusUpdate', { orderId: order._id, status })
  }

  res.json({ success: true, order })
})

// @GET /api/admin/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query
  const query = {}
  if (status) query.status = status

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate('user', 'name email')

  const total = await Order.countDocuments(query)
  res.json({ success: true, orders, pagination: { page: Number(page), total, totalPages: Math.ceil(total / Number(limit)) } })
})

// @GET /api/orders/dashboard-stats
exports.getCustomerDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, recentOrders] = await Promise.all([
    Order.countDocuments({ user: req.user._id }),
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('items.product', 'name images')
  ])

  // Get total reviews given by user across all products
  const productsWithReviews = await Product.find({ 'reviews.user': req.user._id })
  let reviewsGiven = 0
  productsWithReviews.forEach(p => {
    reviewsGiven += p.reviews.filter(r => r.user.toString() === req.user._id.toString()).length
  })

  res.json({
    success: true,
    stats: {
      totalOrders,
      reviewsGiven,
      recentOrders
    }
  })
})
