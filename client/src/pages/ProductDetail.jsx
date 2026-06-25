import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import { FiHeart, FiShoppingCart, FiZoomIn, FiStar, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus } from 'react-icons/fi'
import { fetchProductById } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../redux/slices/wishlistSlice'
import ProductCard from '../components/product/ProductCard'
import productService from '../services/productService'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { currentProduct: product, loading } = useSelector((state) => state.product)
  const isWishlisted = useSelector(selectIsWishlisted(product?._id))

  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [related, setRelated] = useState([])
  const [zoomImage, setZoomImage] = useState(null)

  useEffect(() => {
    dispatch(fetchProductById(slug))
    window.scrollTo(0, 0)
  }, [slug, dispatch])

  useEffect(() => {
    if (product?._id) {
      productService.getRelatedProducts(product._id)
        .then((res) => setRelated(res.products || []))
        .catch(() => {})
    }
  }, [product?._id])

  if (loading) return <ProductDetailSkeleton />
  if (!product) return (
    <div className="container-custom py-20 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="font-display font-bold text-2xl text-brand mb-2">Product not found</h2>
      <Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
    </div>
  )

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/category/${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-brand line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <div>
          <Swiper
            modules={[Thumbs, Navigation]}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            navigation
            className="rounded-2xl overflow-hidden mb-3 aspect-square bg-gray-50"
          >
            {(product.images?.length ? product.images : ['https://picsum.photos/seed/prod/600/600']).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative group">
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setZoomImage(img)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiZoomIn className="text-sm" />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={8}
            watchSlidesProgress
            className="thumbs-swiper"
          >
            {(product.images?.length ? product.images : ['https://picsum.photos/seed/prod/600/600']).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 cursor-pointer border-2 border-transparent swiper-slide-thumb-active:border-primary">
                  <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <Link to={`/shop?brand=${product.brand}`} className="text-xs text-primary font-semibold uppercase tracking-widest hover:underline">
              {product.brand}
            </Link>
          )}
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand mt-2 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.numReviews || 0} reviews)</span>
            {product.stock > 0 ? (
              <span className="badge bg-green-100 text-green-700">In Stock ({product.stock})</span>
            ) : (
              <span className="badge bg-red-100 text-red-700">Out of Stock</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
            <span className="font-display font-bold text-3xl text-brand">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="badge bg-red-100 text-red-600 text-sm">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Description snippet */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description?.slice(0, 200)}...</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 hover:bg-gray-100 transition-colors"
              >
                <FiMinus className="text-sm" />
              </button>
              <span className="px-5 py-2.5 text-sm font-semibold border-x border-gray-200">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2.5 hover:bg-gray-100 transition-colors"
              >
                <FiPlus className="text-sm" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => dispatch(addToCart({ product, quantity }))}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => dispatch(toggleWishlist(product))}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500'}`}
            >
              <FiHeart className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl">
            {[
              { icon: FiTruck, text: 'Free Delivery', sub: 'Above ₹999' },
              { icon: FiShield, text: 'Secure Payment', sub: 'SSL Protected' },
              { icon: FiRefreshCw, text: 'Easy Returns', sub: '30 days' },
            ].map((badge) => (
              <div key={badge.text} className="text-center">
                <badge.icon className="mx-auto mb-1 text-primary" />
                <p className="text-xs font-medium text-brand">{badge.text}</p>
                <p className="text-xs text-gray-400">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-brand'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
                {product.description || 'No description available.'}
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(product.specifications || []).map((spec, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                    <span className="font-medium text-brand w-32 shrink-0">{spec.key}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
                {(!product.specifications || product.specifications.length === 0) && (
                  <p className="text-gray-500 text-sm">No specifications available.</p>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <ReviewsSection productId={product._id} rating={product.rating} numReviews={product.numReviews} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomImage(null)}
          >
            <img src={zoomImage} alt="zoom" className="max-w-full max-h-full object-contain rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ReviewsSection({ productId, rating, numReviews }) {
  return (
    <div>
      <div className="flex items-center gap-6 mb-6 p-6 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <p className="font-display font-bold text-5xl text-brand">{rating?.toFixed(1) || '0.0'}</p>
          <div className="flex justify-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar key={i} className={`text-sm ${i < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{numReviews || 0} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 w-3">{star}</span>
              <FiStar className="text-yellow-400 fill-current text-xs" />
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${Math.random() * 80 + 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-gray-500 text-sm text-center">Reviews are loaded from the API when connected.</p>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-4 rounded w-20" />
          <div className="skeleton h-8 rounded w-3/4" />
          <div className="skeleton h-4 rounded w-1/3" />
          <div className="skeleton h-10 rounded w-1/2" />
          <div className="skeleton h-20 rounded" />
          <div className="skeleton h-12 rounded" />
        </div>
      </div>
    </div>
  )
}
