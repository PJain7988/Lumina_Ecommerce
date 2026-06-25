import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi'
import { addToCart } from '../../redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../redux/slices/wishlistSlice'
import { setQuickViewProduct } from '../../redux/slices/uiSlice'

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const dispatch = useDispatch()
  const isWishlisted = useSelector(selectIsWishlisted(product._id))

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1 }))
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    dispatch(toggleWishlist(product))
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    dispatch(setQuickViewProduct(product))
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group card-hover overflow-hidden"
    >
      <Link to={`/product/${product.slug || product._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          {!imageLoaded && <div className="skeleton absolute inset-0" />}
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="badge bg-red-500 text-white">{discount}% OFF</span>
            )}
            {product.isNew && (
              <span className="badge bg-accent text-white">New</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-500 text-white">Out of Stock</span>
            )}
          </div>

          {/* Actions overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <FiHeart className={isWishlisted ? 'fill-current' : ''} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
            >
              <FiEye />
            </motion.button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3 bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="text-sm" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.brand && (
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium text-brand line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
