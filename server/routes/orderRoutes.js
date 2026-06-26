const express = require('express')
const router = express.Router()
const {
  createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, getCustomerDashboardStats
} = require('../controllers/orderController')
const { protect, authorize } = require('../middlewares/auth')

router.post('/', protect, createOrder)
router.get('/dashboard-stats', protect, getCustomerDashboardStats)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrder)
router.put('/:id/cancel', protect, cancelOrder)

module.exports = router
