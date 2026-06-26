const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const path = require('path')
const logger = require('./utils/logger')
const errorHandler = require('./middlewares/errorMiddleware')
const AppError = require('./utils/AppError')
require('dotenv').config()

const app = express()
const server = http.createServer(app)

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000']

// Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

// Make io accessible in routes
app.set('io', io)

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(mongoSanitize())
app.use(hpp())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})
app.use('/api/', limiter)

// Auth rate limit (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
})
app.use('/api/auth/', authLimiter)

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))
app.use('/api/coupons', require('./routes/couponRoutes'))
app.use('/api/seller', require('./routes/sellerRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/upload', require('./routes/uploadRoutes'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lumina API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// 404
app.use('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404))
})

// Error handler
app.use(errorHandler)

// Socket.io events
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`)
    logger.info(`User ${userId} joined their room`)
  })

  socket.on('join_seller', (sellerId) => {
    socket.join(`seller_${sellerId}`)
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// DB + Start server
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('✅ MongoDB connected')
    server.listen(PORT, () => {
      logger.info(`🚀 Lumina server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    logger.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })

module.exports = { app, io }
