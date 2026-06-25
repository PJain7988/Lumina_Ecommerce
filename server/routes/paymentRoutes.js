const express = require('express')
const router = express.Router()
const { createRazorpayOrder, verifyRazorpayPayment, createStripePaymentIntent } = require('../controllers/paymentController')
const { protect } = require('../middlewares/auth')

router.post('/create-order', protect, createRazorpayOrder)
router.post('/verify', protect, verifyRazorpayPayment)
router.post('/stripe', protect, createStripePaymentIntent)

module.exports = router
