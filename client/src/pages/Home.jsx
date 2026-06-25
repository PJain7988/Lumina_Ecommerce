import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import ProductCard from '../components/product/ProductCard'
import productService from '../services/productService'

const heroSlides = [
  {
    id: 1,
    title: 'Discover Premium Products',
    subtitle: 'Curated collection of the finest brands',
    cta: 'Shop Now',
    link: '/shop',
    bg: 'from-primary to-accent',
  },
  {
    id: 2,
    title: 'New Season Arrivals',
    subtitle: 'Explore the latest trends in fashion & lifestyle',
    cta: 'Explore Now',
    link: '/category/fashion',
    bg: 'from-secondary to-gray-700',
  },
  {
    id: 3,
    title: 'Flash Deals Today',
    subtitle: 'Up to 70% off on selected items',
    cta: 'Grab Deals',
    link: '/shop?sale=true',
    bg: 'from-accent to-pink-600',
  },
]

const categories = [
  { name: 'Electronics', slug: 'electronics', emoji: '📱', color: 'bg-blue-50 text-blue-600' },
  { name: 'Fashion', slug: 'fashion', emoji: '👗', color: 'bg-pink-50 text-pink-600' },
  { name: 'Home & Living', slug: 'home-living', emoji: '🏠', color: 'bg-amber-50 text-amber-600' },
  { name: 'Sports', slug: 'sports', emoji: '⚽', color: 'bg-green-50 text-green-600' },
  { name: 'Beauty', slug: 'beauty', emoji: '💄', color: 'bg-purple-50 text-purple-600' },
  { name: 'Books', slug: 'books', emoji: '📚', color: 'bg-orange-50 text-orange-600' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function Home() {
  const [trending, setTrending] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, arrivalsRes, sellersRes] = await Promise.all([
          productService.getTrendingProducts().catch(() => ({ products: [] })),
          productService.getNewArrivals().catch(() => ({ products: [] })),
          productService.getBestSellers().catch(() => ({ products: [] })),
        ])
        setTrending(trendingRes.products || [])
        setNewArrivals(arrivalsRes.products || [])
        setBestSellers(sellersRes.products || [])
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[420px] md:h-[520px]"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className={`h-full bg-gradient-to-r ${slide.bg} flex items-center`}>
                <div className="container-custom">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-xl text-white"
                  >
                    <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-white/80 text-lg mb-8">{slide.subtitle}</p>
                    <Link to={slide.link} className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-block">
                      {slide.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories */}
      <section className="container-custom py-12">
        <motion.div {...fadeInUp} className="text-center mb-8">
          <h2 className="section-title">Featured Categories</h2>
          <p className="section-subtitle">Shop by your favorite category</p>
        </motion.div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${cat.color} hover:scale-105 transition-transform duration-200`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-center">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <ProductSection
        title="Trending Now"
        subtitle="Most popular products this week"
        products={trending}
        loading={loading}
        viewAllLink="/shop?sort=trending"
      />

      {/* Flash Deals Banner */}
      <section className="container-custom py-6">
        <motion.div {...fadeInUp} className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="badge bg-white/20 text-white mb-3 inline-flex">⚡ Flash Deals</span>
            <h2 className="font-display font-bold text-3xl mb-2">Up to 70% Off</h2>
            <p className="text-white/80 mb-6">Limited time offers on premium products</p>
            <Link to="/shop?sale=true" className="bg-white text-primary px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors inline-block">
              Shop Deals
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <div className="w-64 h-64 rounded-full bg-white absolute -right-20 -top-20" />
            <div className="w-40 h-40 rounded-full bg-white absolute right-20 bottom-0" />
          </div>
        </motion.div>
      </section>

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh products just landed"
        products={newArrivals}
        loading={loading}
        viewAllLink="/shop?sort=newest"
      />

      {/* Best Sellers */}
      <ProductSection
        title="Best Sellers"
        subtitle="Top-rated products loved by customers"
        products={bestSellers}
        loading={loading}
        viewAllLink="/shop?sort=sales"
      />

      {/* Trust Badges */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
          ].map((badge) => (
            <motion.div
              key={badge.title}
              {...fadeInUp}
              className="flex items-center gap-4 p-5 card"
            >
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <h4 className="font-semibold text-sm text-brand">{badge.title}</h4>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductSection({ title, subtitle, products, loading, viewAllLink }) {
  const skeletons = Array.from({ length: 4 })

  return (
    <section className="container-custom py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        <Link to={viewAllLink} className="text-sm text-primary font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? skeletons.map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-5 rounded w-1/3" />
                </div>
              </div>
            ))
          : products.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <DemoProductCard key={i} index={i} />
            ))
          : products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  )
}

function DemoProductCard({ index }) {
  const demos = [
    { name: 'Premium Wireless Headphones', price: 4999, originalPrice: 7999, brand: 'SoundPro', rating: 4.5, numReviews: 128 },
    { name: 'Smart Fitness Watch', price: 8999, originalPrice: 12999, brand: 'TechFit', rating: 4.3, numReviews: 89 },
    { name: 'Organic Face Serum', price: 1299, originalPrice: 1999, brand: 'GlowLab', rating: 4.7, numReviews: 203 },
    { name: 'Running Shoes Pro', price: 3499, originalPrice: 5499, brand: 'SpeedStep', rating: 4.4, numReviews: 156 },
  ]
  const demo = demos[index] || demos[0]

  return (
    <ProductCard
      product={{
        _id: `demo-${index}`,
        slug: `demo-${index}`,
        ...demo,
        images: [`https://picsum.photos/seed/product${index}/400/400`],
        isNew: index === 0,
      }}
    />
  )
}
