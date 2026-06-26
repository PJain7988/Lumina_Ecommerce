import api from './api'

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  getMyOrders: async (params) => {
    const response = await api.get('/orders/my-orders', { params })
    return response.data
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getCustomerDashboardStats: async () => {
    const response = await api.get('/orders/dashboard-stats')
    return response.data
  },

  // Seller operations
  getSellerOrders: async (params) => {
    const response = await api.get('/seller/orders', { params })
    return response.data
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/seller/orders/${orderId}/status`, statusData)
    return response.data
  },

  getSellerAnalytics: async () => {
    const response = await api.get('/seller/analytics')
    return response.data
  },

  getInventoryAlerts: async () => {
    const response = await api.get('/seller/inventory/alerts')
    return response.data
  },

  cancelOrder: async (id, reason) => {
    const response = await api.put(`/orders/${id}/cancel`, { reason })
    return response.data
  },

  // Payment
  createPaymentOrder: async (data) => {
    const response = await api.post('/payment/create-order', data)
    return response.data
  },

  verifyPayment: async (data) => {
    const response = await api.post('/payment/verify', data)
    return response.data
  },

  // Seller
  getSellerOrders: async (params) => {
    const response = await api.get('/seller/orders', { params })
    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/seller/orders/${id}/status`, { status })
    return response.data
  },

  // Admin
  getAllOrders: async (params) => {
    const response = await api.get('/admin/orders', { params })
    return response.data
  },
}

export default orderService
