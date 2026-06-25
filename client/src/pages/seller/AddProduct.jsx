import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiUpload, FiX, FiPlus } from 'react-icons/fi'
import productService from '../../services/productService'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  stock: z.string().min(1, 'Stock is required'),
  sku: z.string().optional(),
})

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive']

export default function AddProduct() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [specs, setSpecs] = useState([{ key: '', value: '' }])

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }])
  const removeSpec = (i) => setSpecs(specs.filter((_, idx) => idx !== i))
  const updateSpec = (i, field, val) => setSpecs(specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

  const onSubmit = async (data) => {
    if (images.length === 0) { toast.error('Add at least one product image'); return }
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v))
      images.forEach((img) => formData.append('images', img))
      formData.append('specifications', JSON.stringify(specs.filter((s) => s.key && s.value)))
      await productService.createProduct(formData)
      toast.success('Product added successfully!')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Product Name *</label>
                  <input {...register('name')} className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Enter product name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea {...register('description')} className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`} rows={5} placeholder="Describe your product in detail..." />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category *</label>
                    <select {...register('category')} className={`input-field ${errors.category ? 'border-red-400' : ''}`}>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c} value={c.toLowerCase().replace(/\s+/g, '-')}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="label">Brand</label>
                    <input {...register('brand')} className="input-field" placeholder="Brand name" />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Product Images *</h2>
              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                    <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <FiX className="text-xs" />
                    </button>
                  </div>
                ))}
                {previews.length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    <FiUpload className="text-2xl text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Upload</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">Upload up to 6 images. First image will be the main image.</p>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Specifications</h2>
                <button type="button" onClick={addSpec} className="text-primary text-sm flex items-center gap-1 hover:underline">
                  <FiPlus className="text-xs" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} className="input-field flex-1" placeholder="e.g. Color" />
                    <input value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} className="input-field flex-1" placeholder="e.g. Red" />
                    <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Selling Price *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input {...register('price')} type="number" className={`input-field pl-8 ${errors.price ? 'border-red-400' : ''}`} placeholder="0.00" />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="label">MRP / Original Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input {...register('originalPrice')} type="number" className="input-field pl-8" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Stock Quantity *</label>
                  <input {...register('stock')} type="number" className={`input-field ${errors.stock ? 'border-red-400' : ''}`} placeholder="0" />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input {...register('sku')} className="input-field" placeholder="SKU-001" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
