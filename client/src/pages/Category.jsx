import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters } from '../redux/slices/productSlice'
import ProductCard from '../components/product/ProductCard'

export default function Category() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(setFilters({ category: slug }))
    dispatch(fetchProducts({ category: slug, limit: 12 }))
  }, [slug, dispatch])

  const categoryName = slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="container-custom py-8">
      <h1 className="font-display font-bold text-2xl text-brand mb-2">{categoryName}</h1>
      <p className="text-gray-500 text-sm mb-6">{products.length} products found</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="card overflow-hidden"><div className="skeleton aspect-square" /><div className="p-4 space-y-2"><div className="skeleton h-4 rounded w-3/4" /><div className="skeleton h-5 rounded w-1/3" /></div></div>)
          : products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  )
}
