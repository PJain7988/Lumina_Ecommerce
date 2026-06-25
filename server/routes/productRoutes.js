const express = require('express')
const router = express.Router()
const {
  getProducts, getProduct, getFeaturedProducts, getTrendingProducts,
  getNewArrivals, getBestSellers, getFlashDeals, searchProducts,
  getRelatedProducts, createProduct, updateProduct, deleteProduct,
  addReview, getReviews,
} = require('../controllers/productController')
const { protect, authorize, optionalAuth } = require('../middlewares/auth')
const { uploadProduct, uploadReview } = require('../config/cloudinary')

const handleProductUpload = (req, res, next) => {
  uploadProduct(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })
}

const handleReviewUpload = (req, res, next) => {
  uploadReview(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })
}

// Public routes
router.get('/', optionalAuth, getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/trending', getTrendingProducts)
router.get('/new-arrivals', getNewArrivals)
router.get('/best-sellers', getBestSellers)
router.get('/flash-deals', getFlashDeals)
router.get('/search', searchProducts)
router.get('/:id', optionalAuth, getProduct)
router.get('/:id/related', getRelatedProducts)
router.get('/:id/reviews', getReviews)

// Protected routes
router.post('/', protect, authorize('seller', 'admin'), handleProductUpload, createProduct)
router.put('/:id', protect, authorize('seller', 'admin'), handleProductUpload, updateProduct)
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct)
router.post('/:id/reviews', protect, handleReviewUpload, addReview)

module.exports = router
