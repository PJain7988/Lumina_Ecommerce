import { FiPackage, FiShoppingBag, FiTag, FiPercent, FiUserCheck, FiBarChart2 } from 'react-icons/fi'

const placeholder = (Icon, title, desc) => function Page() {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">{title}</h1>
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <Icon className="text-5xl text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500">{desc}</p>
      </div>
    </div>
  )
}

export const AdminProducts = placeholder(FiPackage, 'Product Management', 'Manage, approve, or remove products from the marketplace.')
export const AdminOrders = placeholder(FiShoppingBag, 'Order Management', 'View all orders, update statuses, handle refunds and cancellations.')
export const AdminCategories = placeholder(FiTag, 'Category Management', 'Add, edit, or remove product categories and subcategories.')
export const AdminCoupons = placeholder(FiPercent, 'Coupon Management', 'Create and manage discount coupons and promotional codes.')
export const AdminSellers = placeholder(FiUserCheck, 'Seller Management', 'Review seller applications, manage seller accounts.')
export const AdminReports = placeholder(FiBarChart2, 'Reports & Analytics', 'View detailed reports on sales, revenue, users, and more.')

export default AdminProducts
