import { Outlet, NavLink } from 'react-router-dom'
import {
  FiGrid, FiUsers, FiPackage, FiShoppingBag,
  FiTag, FiPercent, FiUserCheck, FiBarChart2
} from 'react-icons/fi'

const navItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/sellers', icon: FiUserCheck, label: 'Sellers' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/categories', icon: FiTag, label: 'Categories' },
  { path: '/admin/coupons', icon: FiPercent, label: 'Coupons' },
  { path: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-secondary-900 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white font-display font-bold text-xl">
            Lumina <span className="text-accent text-xs font-medium bg-accent/20 px-2 py-0.5 rounded-full ml-1">Admin</span>
          </h1>
        </div>
        <nav className="p-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
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

      <main className="ml-60 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
