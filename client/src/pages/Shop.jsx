import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import { fetchProducts, setFilters } from '../redux/slices/productSlice'
import ProductCard from '../components/product/ProductCard'

const sortOptions = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-sales', label: 'Best Selling' },
]

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹5000', min: 1000, max: 5000 },
  { label: '₹5000 – ₹10000', min: 5000, max: 10000 },
  { label: 'Above ₹10000', min: 10000, max: '' },
]

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)

  const dispatch = useDispatch()
  const { products, pagination, filters, loading } = useSelector((state) => state.product)

  const fetchWithParams = useCallback(() => {
    const params = {
      ...filters,
      page,
      limit: 12,
      search: searchParams.get('q') || filters.search,
      category: searchParams.get('category') || filters.category,
      sort: searchParams.get('sort') || filters.sort,
    }
    dispatch(fetchProducts(params))
  }, [dispatch, filters, page, searchParams])

  useEffect(() => {
    fetchWithParams()
  }, [fetchWithParams])

  const handleFilter = (key, value) => {
    dispatch(setFilters({ [key]: value }))
    setPage(1)
  }

  const skeletons = Array.from({ length: 12 })

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand">
            {searchParams.get('q') ? `Results for "${searchParams.get('q')}"` : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total || 0} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => handleFilter('sort', e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {/* View mode */}
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
              <FiGrid />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
              <FiList />
            </button>
          </div>
          {/* Mobile filter */}
          <button onClick={() => setFilterOpen(true)} className="md:hidden btn-outline flex items-center gap-2">
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="card p-5 space-y-6 sticky top-20">
            {/* Category */}
            <div>
              <h3 className="font-semibold text-sm text-brand mb-3">Category</h3>
              <div className="space-y-2">
                {['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
                    <input
                      type="radio"
                      name="category"
                      value={cat === 'All' ? '' : cat.toLowerCase()}
                      checked={filters.category === (cat === 'All' ? '' : cat.toLowerCase())}
                      onChange={(e) => handleFilter('category', e.target.value)}
                      className="text-primary"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-semibold text-sm text-brand mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => handleFilter('minPrice', range.min) || handleFilter('maxPrice', range.max)}
                      className="text-primary"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold text-sm text-brand mb-3">Min Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
                    <input type="radio" name="rating" value={r} onChange={(e) => handleFilter('rating', e.target.value)} className="text-primary" />
                    {'⭐'.repeat(r)} & above
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => dispatch(setFilters({ category: '', minPrice: '', maxPrice: '', rating: '' }))} className="btn-outline w-full text-xs">
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {loading
              ? skeletons.map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton aspect-square" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-4 rounded w-3/4" />
                      <div className="skeleton h-3 rounded w-1/2" />
                      <div className="skeleton h-5 rounded w-1/3" />
                    </div>
                  </div>
                ))
              : products.length === 0
              ? (
                  <div className="col-span-full text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <h3 className="font-semibold text-lg text-brand mb-2">No products found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
                  </div>
                )
              : products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
