import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiPlus, FiPackage } from 'react-icons/fi'
import productService from '../../services/productService'
import toast from 'react-hot-toast'

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getSellerProducts()
      .then((res) => setProducts(res.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      toast.success('Product deleted')
    } catch { toast.error('Failed to delete product') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">My Products</h1>
        <Link to="/seller/products/add" className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors">
          <FiPlus /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiPackage className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No products yet. Start selling!</p>
          <Link to="/seller/products/add" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors inline-block">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                      <img src={p.images?.[0] || 'https://picsum.photos/seed/p1/80/80'} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">₹{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>{p.stock > 0 ? p.stock : 'Out of stock'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/seller/products/edit/${p._id}`} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <FiEdit2 className="text-sm" />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
