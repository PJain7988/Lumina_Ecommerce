const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGO_URI = "mongodb+srv://pj0431205_db_user:IN6CpcJ3V5gj1LeT@cluster0.eqoioip.mongodb.net/Lumina_Ecommerce";

const dummyProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise cancellation, two processors control 8 microphones for unprecedented noise cancellation. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions and environment.',
    price: 348,
    originalPrice: 398,
    category: 'electronics',
    brand: 'Sony',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    rating: 4.8,
    numReviews: 1250,
    status: 'active',
    isFeatured: true,
    totalSales: 3400
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'The 14-inch MacBook Pro blasts forward with M3 Pro, an incredibly advanced chip that brings massive performance and capabilities for more demanding workflows.',
    price: 1999,
    category: 'electronics',
    brand: 'Apple',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    rating: 4.9,
    numReviews: 856,
    status: 'active',
    isFeatured: true,
    totalSales: 1200
  },
  {
    name: 'Minimalist Leather Tote Bag',
    description: 'Handcrafted from premium full-grain leather, this tote bag is designed for both work and weekend. Features a laptop compartment and interior zip pocket.',
    price: 129,
    originalPrice: 159,
    category: 'fashion',
    brand: 'Everlane',
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    rating: 4.6,
    numReviews: 320,
    status: 'active',
    flashDeal: { isActive: true, discountPercent: 20, startTime: new Date(), endTime: new Date(Date.now() + 86400000 * 3) },
    totalSales: 850
  },
  {
    name: 'Ceramic Pour-Over Coffee Maker',
    description: 'Elevate your morning routine with this beautifully crafted ceramic pour-over coffee maker. Includes a reusable stainless steel filter.',
    price: 45,
    category: 'home',
    brand: 'Fellow',
    stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1544243689-53e34ba677c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    rating: 4.7,
    numReviews: 180,
    status: 'active',
    totalSales: 450
  },
  {
    name: 'Hydrating Facial Cleanser',
    description: 'A gentle, daily facial cleanser that removes dirt and makeup without disrupting the skin’s natural protective barrier. Formulated with ceramides and hyaluronic acid.',
    price: 15,
    category: 'beauty',
    brand: 'CeraVe',
    stock: 500,
    images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    rating: 4.8,
    numReviews: 4500,
    status: 'active',
    isFeatured: true,
    totalSales: 9800
  },
  {
    name: 'Men\'s Classic White Sneakers',
    description: 'The ultimate everyday sneaker. Made with premium Italian leather and a durable rubber sole for all-day comfort and style.',
    price: 95,
    category: 'fashion',
    brand: 'Oliver Cabell',
    stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }],
    rating: 4.5,
    numReviews: 210,
    status: 'active',
    totalSales: 600
  }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    let seller = await User.findOne({ email: 'seller@lumina.com' });
    if (!seller) {
      console.log('Creating dummy seller...');
      seller = await User.create({
        name: 'Lumina Official Store',
        email: 'seller@lumina.com',
        password: 'password123',
        role: 'seller',
        isVerified: true,
        sellerInfo: {
          storeName: 'Lumina Official',
          description: 'The official Lumina retail store',
          isApproved: true
        }
      });
    }

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log('Inserting products...');
    const productsWithSeller = dummyProducts.map(p => ({ ...p, seller: seller._id }));
    await Product.create(productsWithSeller);

    console.log('Successfully seeded database with professional products!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
