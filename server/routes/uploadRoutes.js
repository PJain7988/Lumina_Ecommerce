const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/auth')
const { cloudinary } = require('../config/cloudinary')
const multer = require('multer')
const { asyncHandler } = require('../middlewares/error')

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// Generic image upload (returns URL)
router.post('/image', protect, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

  const b64 = Buffer.from(req.file.buffer).toString('base64')
  const dataURI = `data:${req.file.mimetype};base64,${b64}`

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'lumina/misc',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  })

  res.json({ success: true, url: result.secure_url, public_id: result.public_id })
}))

module.exports = router
