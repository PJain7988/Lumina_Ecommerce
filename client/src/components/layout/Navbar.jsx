import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiSun, FiMoon,
  FiMenu, FiX, FiChevronDown, FiBell
} from 'react-icons/fi'
import { openCart, toggleDarkMode, toggleSearch } from '../../redux/slices/uiSlice'
import { logoutUser } from '../../redux/slices/authSlice'
import { selectCartCount } from '../../redux/slices/cartSlice'
import { selectWishlistItems } from '../../redux/slices/wishlistSlice'

const categories = [
  { name: 'Electronics', slug: 'electronics', subcategories: ['Phones', 'Laptops', 'Audio', 'Cameras'] },
  { name: 'Fashion', slug: 'fashion', subcategories: ["Men's", "Women's", 'Kids', 'Accessories'] },
  { name: 'Home & Living', slug: 'home-living', subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding'] },
  { name: 'Sports', slug: 'sports', subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports'] },
  { name: 'Beauty', slug: 'beauty', subcategories: ['Skincare', 'Makeup', 'Hair', 'Fragrance'] },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState(null)
  const [userDropdown, setUserDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.ui)
  const cartCount = useSelector(selectCartCount)
  const wishlistItems = useSelector(selectWishlistItems)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    setUserDropdown(false)
    navigate('/')
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md' : 'bg-white dark:bg-secondary-900'}`}>
      {/* Top bar */}
      <div className="bg-secondary text-white text-xs py-1.5 hidden md:block">
        <div className="container-custom flex items-center justify-between">
          <p>🚀 Free shipping on orders above ₹999 | Use code <span className="font-semibold text-accent">LUMINA10</span> for 10% off</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-gray-300 transition-colors">Help Center</Link>
            <Link to="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-custom">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <span className="font-display font-bold text-2xl text-secondary dark:text-white">
              Lumi<span className="text-gradient">na</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-4 pr-12 py-2.5 border border-gray-200 dark:border-secondary-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:bg-secondary-800 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            >
              <FiSearch className="text-lg" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile search */}
            <button className="md:hidden btn-ghost p-2" onClick={() => dispatch(toggleSearch())}>
              <FiSearch className="text-lg" />
            </button>

            {/* Dark mode */}
            <button className="btn-ghost p-2 hidden md:flex" onClick={() => dispatch(toggleDarkMode())}>
              {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {/* Wishlist */}
            <Link to="/dashboard/wishlist" className="btn-ghost p-2 relative">
              <FiHeart className="text-lg" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button className="btn-ghost p-2 relative" onClick={() => dispatch(openCart())}>
              <FiShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 btn-ghost px-3 py-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary text-xs font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown className="text-xs text-gray-400 hidden md:block" />
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-52 card shadow-card-hover py-2 z-50"
                    >
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" onClick={() => setUserDropdown(false)}>
                        <FiUser className="text-gray-400" /> My Dashboard
                      </Link>
                      <Link to="/dashboard/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" onClick={() => setUserDropdown(false)}>
                        <FiShoppingCart className="text-gray-400" /> My Orders
                      </Link>
                      <Link to="/dashboard/notifications" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" onClick={() => setUserDropdown(false)}>
                        <FiBell className="text-gray-400" /> Notifications
                      </Link>
                      {(user?.role === 'seller' || user?.role === 'admin') && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          {user?.role === 'seller' && (
                            <Link to="/seller" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" onClick={() => setUserDropdown(false)}>
                              Seller Dashboard
                            </Link>
                          )}
                          {user?.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" onClick={() => setUserDropdown(false)}>
                              Admin Panel
                            </Link>
                          )}
                        </>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost px-4 py-2 text-sm hidden md:block">Login</Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button className="md:hidden btn-ghost p-2 ml-1" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-1 border-t border-gray-100 h-11">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setMegaMenu(cat.slug)}
              onMouseLeave={() => setMegaMenu(null)}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
              >
                {cat.name}
                <FiChevronDown className="text-xs" />
              </Link>

              <AnimatePresence>
                {megaMenu === cat.slug && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute left-0 top-full mt-1 w-48 card shadow-card-hover py-2 z-50"
                  >
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        to={`/category/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link to="/shop" className="ml-auto px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
            All Products →
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-2">
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pr-10"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch />
                </button>
              </form>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="block py-2 text-sm text-gray-600 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Link to="/login" className="flex-1 btn-outline text-center text-sm py-2" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="flex-1 btn-primary text-center text-sm py-2" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
