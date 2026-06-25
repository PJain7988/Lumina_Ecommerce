const express = require('express')
const router = express.Router()
const { validateCoupon, createCoupon, getCoupons, updateCoupon, deleteCoupon } = require('../controllers/adminController')
const { protect, authorize } = require('../middlewares/auth')

router.post('/validate', protect, validateCoupon)
router.get('/', protect, authorize('admin'), getCoupons)
router.post('/', protect, authorize('admin'), createCoupon)
router.put('/:id', protect, authorize('admin'), updateCoupon)
router.delete('/:id', protect, authorize('admin'), deleteCoupon)

module.exports = router
