const Product = require('../models/Product')
const { asyncHandler, AppError } = require('../middlewares/error')

// Build query helper
const buildProductQuery = (queryParams) => {
  const { search, category, subcategory, brand, minPrice, maxPrice, rating, tags, seller } = queryParams
  const query = { status: 'active' }

  if (search) query.$text = { $search: search }
  if (category) query.category = category.toLowerCase()
  if (subcategory) query.subcategory = subcategory
  if (brand) query.brand = new RegExp(brand, 'i')
  if (tags) query.tags = { $in: tags.split(',') }
  if (seller) query.seller = seller
  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }
  if (rating) query.rating = { $gte: Number(rating) }

  return query
}

// @GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, sort = '-createdAt', ...rest } = req.query
  const query = buildProductQuery(rest)

  const sortMap = {
    'createdAt': { createdAt: -1 },
    '-createdAt': { createdAt: -1 },
    'price': { price: 1 },
    '-price': { price: -1 },
    '-rating': { rating: -1 },
    '-sales': { totalSales: -1 },
    '-trending': { views: -1 },
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    Product.find(query)
      .select('-reviews -__v')
      .populate('seller', 'name sellerInfo.storeName')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ])

  // Format images
  const formatted = products.map((p) => ({
    ...p,
    images: p.images?.map((img) => img.url || img) || [],
  }))

  res.json({
    success: true,
    products: formatted,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
})

// @GET /api/products/featured
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active', isFeatured: true })
    .limit(8).select('-reviews').lean()
  const formatted = products.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @GET /api/products/trending
exports.getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active' })
    .sort({ views: -1, totalSales: -1 }).limit(8).select('-reviews').lean()
  const formatted = products.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @GET /api/products/new-arrivals
exports.getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active' })
    .sort({ createdAt: -1 }).limit(8).select('-reviews').lean()
  const formatted = products.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @GET /api/products/best-sellers
exports.getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'active' })
    .sort({ totalSales: -1 }).limit(8).select('-reviews').lean()
  const formatted = products.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @GET /api/products/flash-deals
exports.getFlashDeals = asyncHandler(async (req, res) => {
  const now = new Date()
  const products = await Product.find({
    status: 'active',
    'flashDeal.isActive': true,
    'flashDeal.endTime': { $gt: now },
  }).limit(8).select('-reviews').lean()
  const formatted = products.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @GET /api/products/search
exports.searchProducts = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query
  if (!q) return res.json({ success: true, products: [] })

  const products = await Product.find({
    status: 'active',
    $or: [
      { name: new RegExp(q, 'i') },
      { brand: new RegExp(q, 'i') },
      { category: new RegExp(q, 'i') },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ],
  }).limit(Number(limit)).select('name slug images price rating brand').lean()

  const formatted = products.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: id }
    : { slug: id }

  const product = await Product.findOne({ ...query, status: 'active' })
    .populate('seller', 'name sellerInfo.storeName sellerInfo.isApproved')
    .populate('reviews.user', 'name avatar')

  if (!product) throw new AppError('Product not found', 404)

  // Increment views
  product.views = (product.views || 0) + 1
  await product.save({ validateBeforeSave: false })

  const p = product.toObject()
  p.images = p.images?.map((img) => img.url || img) || []
  res.json({ success: true, product: p })
})

// @GET /api/products/:id/related
exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)

  const related = await Product.find({
    status: 'active',
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4).select('-reviews').lean()

  const formatted = related.map((p) => ({ ...p, images: p.images?.map((img) => img.url || img) || [] }))
  res.json({ success: true, products: formatted })
})

// @POST /api/products (Seller)
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, brand, stock, sku, specifications } = req.body

  const images = req.files?.map((f) => ({ public_id: f.public_id || f.filename, url: f.path })) || []
  const specs = specifications ? JSON.parse(specifications) : []

  const product = await Product.create({
    name, description, price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category, brand, stock: Number(stock), sku,
    images, specifications: specs,
    seller: req.user._id,
    isNew: true,
  })

  res.status(201).json({ success: true, product })
})

// @PUT /api/products/:id (Seller)
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this product', 403)
  }

  const updates = { ...req.body }
  if (req.files?.length) {
    updates.images = req.files.map((f) => ({ public_id: f.public_id || f.filename, url: f.path }))
  }
  if (updates.specifications) updates.specifications = JSON.parse(updates.specifications)

  product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
  res.json({ success: true, product })
})

// @DELETE /api/products/:id (Seller)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this product', 403)
  }

  await product.deleteOne()
  res.json({ success: true, message: 'Product deleted successfully' })
})

// @POST /api/products/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment, title } = req.body
  const product = await Product.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  )
  if (alreadyReviewed) throw new AppError('You have already reviewed this product', 400)

  const images = req.files?.map((f) => f.path) || []
  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar?.url,
    rating: Number(rating),
    title,
    comment,
    images,
  })

  product.updateRating()
  await product.save()
  res.status(201).json({ success: true, message: 'Review added successfully' })
})

// @GET /api/products/:id/reviews
exports.getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar')
  if (!product) throw new AppError('Product not found', 404)

  const start = (Number(page) - 1) * Number(limit)
  const reviews = product.reviews.slice(start, start + Number(limit))

  res.json({
    success: true,
    reviews,
    pagination: {
      page: Number(page),
      total: product.reviews.length,
      totalPages: Math.ceil(product.reviews.length / Number(limit)),
    },
  })
})
