import { Outlet, NavLink } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiAlertCircle } from 'react-icons/fi'

const navItems = [
  { path: '/seller', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/seller/products', icon: FiPackage, label: 'Products' },
  { path: '/seller/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/seller/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/seller/inventory', icon: FiAlertCircle, label: 'Inventory' },
]

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-56 bg-secondary min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white font-display font-bold text-xl">
            Lumina <span className="text-accent text-sm font-medium">Seller</span>
          </h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="text-base" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
