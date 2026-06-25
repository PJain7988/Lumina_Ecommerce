const Razorpay = require('razorpay')
const crypto = require('crypto')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { asyncHandler, AppError } = require('../middlewares/error')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
})

// @POST /api/payment/create-order
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: orderId,
    notes: { orderId, userId: req.user._id.toString() },
  })

  res.json({
    success: true,
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  })
})

// @POST /api/payment/verify
exports.verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Payment verification failed', 400)
  }

  const order = await Order.findById(orderId)
  if (!order) throw new AppError('Order not found', 404)

  order.isPaid = true
  order.paidAt = new Date()
  order.status = 'processing'
  order.paymentResult = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: 'paid',
    paidAt: new Date(),
  }
  await order.save()

  // Deduct stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, totalSales: item.quantity },
    })
  }

  // Socket notification
  const io = req.app.get('io')
  if (io) {
    io.to(`user_${order.user}`).emit('paymentSuccess', { orderId: order._id })
  }

  res.json({ success: true, order })
})

// @POST /api/payment/stripe (Stripe Intent)
exports.createStripePaymentIntent = asyncHandler(async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const { amount } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'inr',
    metadata: { userId: req.user._id.toString() },
  })

  res.json({ success: true, clientSecret: paymentIntent.client_secret })
})
