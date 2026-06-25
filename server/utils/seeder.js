const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User')
const Product = require('../models/Product')
const { Category } = require('../models/Category')

const categories = [
  { name: 'Electronics', slug: 'electronics', order: 1 },
  { name: 'Fashion', slug: 'fashion', order: 2 },
  { name: 'Home & Living', slug: 'home-living', order: 3 },
  { name: 'Sports', slug: 'sports', order: 4 },
  { name: 'Beauty', slug: 'beauty', order: 5 },
  { name: 'Books', slug: 'books', order: 6 },
  { name: 'Toys', slug: 'toys', order: 7 },
  { name: 'Automotive', slug: 'automotive', order: 8 },
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
    ])
    console.log('Cleared existing data')

    // Create categories
    await Category.insertMany(categories)
    console.log('✅ Categories seeded')

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lumina.shop',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
      status: 'active',
    })
    console.log('✅ Admin user created:', admin.email)

    // Create seller
    const seller = await User.create({
      name: 'Demo Seller',
      email: 'seller@lumina.shop',
      password: 'Seller@123',
      role: 'seller',
      isVerified: true,
      status: 'active',
      sellerInfo: {
        storeName: 'Demo Store',
        storeDescription: 'Premium quality products',
        isApproved: true,
      },
    })
    console.log('✅ Seller created:', seller.email)

    // Create customer
    await User.create({
      name: 'Demo Customer',
      email: 'customer@lumina.shop',
      password: 'Customer@123',
      role: 'customer',
      isVerified: true,
      status: 'active',
    })
    console.log('✅ Customer created: customer@lumina.shop')

    // Sample products
    const sampleProducts = [
      {
        name: 'Premium Wireless Noise-Cancelling Headphones',
        description: 'Experience crystal-clear audio with our flagship wireless headphones. Features 30-hour battery life, active noise cancellation, and premium leather ear cushions for all-day comfort.',
        price: 4999,
        originalPrice: 7999,
        category: 'electronics',
        brand: 'SoundPro',
        stock: 50,
        images: [{ public_id: 'demo1', url: 'https://picsum.photos/seed/headphones/600/600' }],
        rating: 4.5,
        numReviews: 128,
        isFeatured: true,
        isNew: true,
        status: 'active',
        totalSales: 320,
        tags: ['headphones', 'wireless', 'audio', 'noise-cancelling'],
        specifications: [
          { key: 'Battery Life', value: '30 hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.0' },
          { key: 'Weight', value: '250g' },
          { key: 'Warranty', value: '1 year' },
        ],
        seller: seller._id,
      },
      {
        name: 'Smart Fitness Tracker Watch',
        description: 'Track your fitness goals with this advanced smartwatch. Monitor heart rate, steps, sleep, and over 20 sports modes. Water-resistant up to 50 meters.',
        price: 8999,
        originalPrice: 12999,
        category: 'electronics',
        brand: 'TechFit',
        stock: 35,
        images: [{ public_id: 'demo2', url: 'https://picsum.photos/seed/watch/600/600' }],
        rating: 4.3,
        numReviews: 89,
        isFeatured: true,
        status: 'active',
        totalSales: 215,
        tags: ['smartwatch', 'fitness', 'health', 'tracker'],
        seller: seller._id,
      },
      {
        name: 'Organic Vitamin C Face Serum',
        description: 'Brighten and rejuvenate your skin with our potent 20% Vitamin C serum. Enriched with hyaluronic acid and niacinamide for maximum hydration and glow.',
        price: 1299,
        originalPrice: 1999,
        category: 'beauty',
        brand: 'GlowLab',
        stock: 120,
        images: [{ public_id: 'demo3', url: 'https://picsum.photos/seed/serum/600/600' }],
        rating: 4.7,
        numReviews: 203,
        isFeatured: true,
        status: 'active',
        totalSales: 580,
        tags: ['skincare', 'vitamin-c', 'serum', 'organic'],
        seller: seller._id,
      },
      {
        name: 'Professional Running Shoes',
        description: 'Engineered for performance, these running shoes feature responsive cushioning, breathable mesh upper, and durable rubber outsole for ultimate comfort on any surface.',
        price: 3499,
        originalPrice: 5499,
        category: 'sports',
        brand: 'SpeedStep',
        stock: 80,
        images: [{ public_id: 'demo4', url: 'https://picsum.photos/seed/shoes/600/600' }],
        rating: 4.4,
        numReviews: 156,
        isFeatured: true,
        status: 'active',
        totalSales: 445,
        tags: ['shoes', 'running', 'sports', 'fitness'],
        seller: seller._id,
      },
      {
        name: 'Minimalist Leather Wallet',
        description: 'Slim RFID-blocking genuine leather wallet. Holds up to 8 cards with a dedicated cash slot. Perfect for the modern professional.',
        price: 799,
        originalPrice: 1299,
        category: 'fashion',
        brand: 'LeatherCraft',
        stock: 200,
        images: [{ public_id: 'demo5', url: 'https://picsum.photos/seed/wallet/600/600' }],
        rating: 4.6,
        numReviews: 342,
        status: 'active',
        totalSales: 890,
        tags: ['wallet', 'leather', 'accessories', 'rfid'],
        seller: seller._id,
      },
      {
        name: 'Stainless Steel Water Bottle 1L',
        description: 'Keep your drinks cold for 24 hours or hot for 12 hours with our vacuum-insulated water bottle. BPA-free, leak-proof lid, and eco-friendly.',
        price: 599,
        originalPrice: 899,
        category: 'sports',
        brand: 'HydroFlow',
        stock: 300,
        images: [{ public_id: 'demo6', url: 'https://picsum.photos/seed/bottle/600/600' }],
        rating: 4.8,
        numReviews: 512,
        isFeatured: true,
        status: 'active',
        totalSales: 1200,
        tags: ['bottle', 'water', 'insulated', 'eco'],
        seller: seller._id,
      },
    ]

    await Product.insertMany(sampleProducts)
    console.log('✅ Sample products seeded')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('Admin:    admin@lumina.shop    / Admin@123')
    console.log('Seller:   seller@lumina.shop   / Seller@123')
    console.log('Customer: customer@lumina.shop / Customer@123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeder error:', error)
    process.exit(1)
  }
}

seedDatabase()
