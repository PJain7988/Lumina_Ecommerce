const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { asyncHandler, AppError } = require('../middlewares/error')
const { sendEmail, emailTemplates } = require('../services/emailService')

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getAccessToken()
  const refreshToken = user.getRefreshToken()

  user.save({ validateBeforeSave: false })

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar?.url || '',
    isVerified: user.isVerified,
    phone: user.phone,
    rewardPoints: user.rewardPoints,
    sellerInfo: user.sellerInfo,
  }

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: userResponse,
  })
}

// @route POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  if (await User.findOne({ email })) {
    throw new AppError('Email already registered', 400)
  }

  const user = await User.create({ name, email, password, role: role === 'seller' ? 'seller' : 'customer' })

  // Send verification email
  try {
    const token = user.getEmailVerificationToken()
    await user.save({ validateBeforeSave: false })
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`
    const template = emailTemplates.verifyEmail(user.name, url)
    await sendEmail({ to: user.email, ...template })
  } catch (err) {
    console.error('Email send failed:', err)
  }

  sendTokenResponse(user, 201, res)
})

// @route POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) throw new AppError('Please provide email and password', 400)

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  if (user.status === 'suspended') {
    throw new AppError('Your account has been suspended. Contact support.', 403)
  }

  user.lastLogin = new Date()
  sendTokenResponse(user, 200, res)
})

// @route POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (req.user && refreshToken) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: { token: refreshToken } },
    })
  }
  res.json({ success: true, message: 'Logged out successfully' })
})

// @route GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({ success: true, user })
})

// @route PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'bio']
  const updates = {}
  allowedFields.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field] })

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
  res.json({ success: true, user })
})

// @route POST /api/auth/avatar
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please upload an image', 400)

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: { public_id: req.file.public_id, url: req.file.path } },
    { new: true }
  )
  res.json({ success: true, avatar: req.file.path, user })
})

// @route PUT /api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401)
  }

  user.password = newPassword
  await user.save()
  res.json({ success: true, message: 'Password changed successfully' })
})

// @route POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) throw new AppError('No account found with that email', 404)

  const token = user.getPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const url = `${process.env.CLIENT_URL}/reset-password/${token}`
  const template = emailTemplates.forgotPassword(user.name, url)

  try {
    await sendEmail({ to: user.email, ...template })
    res.json({ success: true, message: 'Password reset email sent' })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpire = undefined
    await user.save({ validateBeforeSave: false })
    throw new AppError('Email could not be sent', 500)
  }
})

// @route POST /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  })

  if (!user) throw new AppError('Invalid or expired reset token', 400)

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpire = undefined
  await user.save()

  res.json({ success: true, message: 'Password reset successful' })
})

// @route GET /api/auth/verify-email/:token
exports.verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  })

  if (!user) throw new AppError('Invalid or expired verification token', 400)

  user.isVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpire = undefined
  await user.save()

  res.json({ success: true, message: 'Email verified successfully' })
})

// @route POST /api/auth/refresh
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw new AppError('Refresh token required', 400)

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  const user = await User.findById(decoded.id)

  if (!user || !user.refreshTokens.some((t) => t.token === refreshToken)) {
    throw new AppError('Invalid refresh token', 401)
  }

  const newToken = user.getAccessToken()
  res.json({ success: true, token: newToken })
})

// @route POST /api/auth/addresses
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false))
  }
  user.addresses.push(req.body)
  await user.save()
  res.json({ success: true, addresses: user.addresses })
})

// @route DELETE /api/auth/addresses/:addressId
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId)
  await user.save()
  res.json({ success: true, addresses: user.addresses })
})
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route POST /api/auth/google
exports.googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new AppError('Google token is missing', 400);
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  const { email, name, picture, email_verified } = payload;

  if (!email_verified) {
    throw new AppError('Google email is not verified', 400);
  }

  let user = await User.findOne({ email });

  if (user) {
    if (user.status === 'suspended') {
      throw new AppError('Your account has been suspended. Contact support.', 403);
    }
    user.lastLogin = new Date();
  } else {
    // Generate a random password since they login via Google
    const randomPassword = crypto.randomBytes(16).toString('hex');
    user = await User.create({
      name,
      email,
      password: randomPassword,
      role: 'customer',
      isVerified: true,
      avatar: { url: picture },
    });
  }

  sendTokenResponse(user, 200, res);
});
