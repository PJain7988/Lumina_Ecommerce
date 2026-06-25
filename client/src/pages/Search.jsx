import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import ProductCard from '../components/product/ProductCard'
import { FiSearch } from 'react-icons/fi'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.product)

  useEffect(() => {
    if (q) dispatch(fetchProducts({ search: q, limit: 20 }))
  }, [q, dispatch])

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-3 mb-6">
        <FiSearch className="text-2xl text-gray-400" />
        <div>
          <h1 className="font-display font-bold text-2xl text-brand">Search Results</h1>
          <p className="text-gray-500 text-sm">for "{q}" — {products.length} results</p>
        </div>
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-semibold text-lg text-brand mb-2">No results for "{q}"</h3>
          <p className="text-gray-500 text-sm">Try different keywords or browse categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="card overflow-hidden"><div className="skeleton aspect-square" /><div className="p-4 space-y-2"><div className="skeleton h-4 rounded w-3/4" /><div className="skeleton h-5 rounded w-1/3" /></div></div>)
            : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}
