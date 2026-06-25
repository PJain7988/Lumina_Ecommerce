import { FiShoppingBag } from 'react-icons/fi'

export function SellerOrders() {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Orders</h1>
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
        <FiShoppingBag className="text-5xl text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500">No orders received yet</p>
      </div>
    </div>
  )
}

export function SellerAnalytics() {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sales', value: '₹0' },
          { label: 'Orders', value: '0' },
          { label: 'Products', value: '0' },
          { label: 'Avg. Order', value: '₹0' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="font-bold text-2xl text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center py-16">
        <p className="text-gray-400 text-sm">Analytics charts will populate as you make sales.</p>
      </div>
    </div>
  )
}

export function SellerInventory() {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Inventory Management</h1>
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
        <p className="text-gray-500">No inventory alerts. All products are well-stocked.</p>
      </div>
    </div>
  )
}

export function EditProduct() {
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Edit Product</h1>
      <p className="text-gray-500">Product edit form loads data from API.</p>
    </div>
  )
}

export default SellerOrders
