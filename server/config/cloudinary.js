const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'Lumina_Ecommerce'

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Local storage fallback
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

// Storage configurations
const getStorage = (folder) => {
  if (useCloudinary) {
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `lumina/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
      },
    })
  }
  return localStorage
}

const uploadProduct = multer({
  storage: getStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 6)

const uploadAvatar = multer({
  storage: getStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar')

const uploadReview = multer({
  storage: getStorage('reviews'),
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 3)

const deleteImage = async (publicId) => {
  if (!useCloudinary) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
  }
}

module.exports = { cloudinary, uploadProduct, uploadAvatar, uploadReview, deleteImage }
