const express = require('express')
const router = express.Router()
const { getCategories } = require('../controllers/adminController')

router.get('/', getCategories)

module.exports = router
