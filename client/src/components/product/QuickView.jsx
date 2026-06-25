import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { clearQuickView } from '../../redux/slices/uiSlice'
import { addToCart } from '../../redux/slices/cartSlice'
import { toggleWishlist } from '../../redux/slices/wishlistSlice'
import { Link } from 'react-router-dom'

export default function QuickView({ product }) {
  const dispatch = useDispatch()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={() => dispatch(clearQuickView())}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        >
          <div className="flex">
            {/* Image */}
            <div className="w-1/2 bg-gray-50 aspect-square">
              <img
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {product.brand && <p className="text-xs text-gray-400 uppercase mb-1">{product.brand}</p>}
                  <h2 className="font-display font-semibold text-lg text-brand line-clamp-2">{product.name}</h2>
                </div>
                <button onClick={() => dispatch(clearQuickView())} className="text-gray-400 hover:text-gray-600 ml-2">
                  <FiX />
                </button>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({product.numReviews} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-brand">₹{product.price?.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{product.description}</p>
              )}

              <div className="mt-auto space-y-3">
                <button
                  onClick={() => { dispatch(addToCart({ product, quantity: 1 })); dispatch(clearQuickView()) }}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(toggleWishlist(product))}
                    className="btn-outline flex-1 flex items-center justify-center gap-2"
                  >
                    <FiHeart /> Wishlist
                  </button>
                  <Link
                    to={`/product/${product.slug || product._id}`}
                    onClick={() => dispatch(clearQuickView())}
                    className="btn-secondary flex-1 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
