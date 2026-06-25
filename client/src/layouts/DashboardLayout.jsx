import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/slices/authSlice'
import {
  FiHome, FiUser, FiShoppingBag, FiHeart, FiMapPin,
  FiStar, FiBell, FiLogOut, FiChevronRight
} from 'react-icons/fi'

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard', exact: true },
  { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  { path: '/dashboard/orders', icon: FiShoppingBag, label: 'My Orders' },
  { path: '/dashboard/wishlist', icon: FiHeart, label: 'Wishlist' },
  { path: '/dashboard/addresses', icon: FiMapPin, label: 'Addresses' },
  { path: '/dashboard/reviews', icon: FiStar, label: 'Reviews' },
  { path: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
]

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="card p-6 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-semibold text-lg">{user?.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-brand truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="card overflow-hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                      isActive
                        ? 'bg-primary/5 text-primary font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="text-base shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <FiChevronRight className="text-xs text-gray-300" />
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="text-base" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
