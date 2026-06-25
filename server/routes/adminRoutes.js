const express = require('express')
const router = express.Router()
const {
  getDashboardStats, getAllUsers, updateUserStatus, deleteUser,
  approveProduct, getCategories, createCategory, updateCategory, deleteCategory,
  getSellers, approveSeller, getReports,
} = require('../controllers/adminController')
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController')
const { protect, authorize } = require('../middlewares/auth')

// All routes require admin
router.use(protect, authorize('admin'))

// Dashboard
router.get('/stats', getDashboardStats)
router.get('/reports', getReports)

// Users
router.get('/users', getAllUsers)
router.put('/users/:id/status', updateUserStatus)
router.delete('/users/:id', deleteUser)

// Sellers
router.get('/sellers', getSellers)
router.put('/sellers/:id/approve', approveSeller)

// Products
router.put('/products/:id/approve', approveProduct)

// Orders
router.get('/orders', getAllOrders)
router.put('/orders/:id/status', updateOrderStatus)

// Categories
router.get('/categories', getCategories)
router.post('/categories', createCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

module.exports = router
