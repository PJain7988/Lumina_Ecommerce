const express = require('express')
const router = express.Router()
const {
  register, login, logout, getMe, updateProfile, uploadAvatar,
  changePassword, forgotPassword, resetPassword, verifyEmail,
  refreshToken, addAddress, deleteAddress, googleAuth,
} = require('../controllers/authController')
const { protect } = require('../middlewares/auth')
const { uploadAvatar: uploadAvatarMiddleware } = require('../config/cloudinary')

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.post('/avatar', protect, (req, res, next) => {
  uploadAvatarMiddleware(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })
}, uploadAvatar)
router.put('/change-password', protect, changePassword)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/verify-email/:token', verifyEmail)
router.post('/refresh', refreshToken)
router.post('/addresses', protect, addAddress)
router.delete('/addresses/:addressId', protect, deleteAddress)

module.exports = router
