import api from './api'

const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured')
    return response.data
  },

  getTrendingProducts: async () => {
    const response = await api.get('/products/trending')
    return response.data
  },

  getNewArrivals: async () => {
    const response = await api.get('/products/new-arrivals')
    return response.data
  },

  getFlashDeals: async () => {
    const response = await api.get('/products/flash-deals')
    return response.data
  },

  getBestSellers: async () => {
    const response = await api.get('/products/best-sellers')
    return response.data
  },

  getRelatedProducts: async (id) => {
    const response = await api.get(`/products/${id}/related`)
    return response.data
  },

  searchProducts: async (query) => {
    const response = await api.get('/products/search', { params: { q: query } })
    return response.data
  },

  // Seller operations
  createProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  updateProduct: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  getSellerProducts: async (params) => {
    const response = await api.get('/seller/products', { params })
    return response.data
  },

  // Reviews
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  getProductReviews: async (productId, params) => {
    const response = await api.get(`/products/${productId}/reviews`, { params })
    return response.data
  },
}

export default productService
