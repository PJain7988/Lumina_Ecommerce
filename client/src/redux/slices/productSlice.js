import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../services/productService'

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await productService.getProducts(params)
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

export const fetchProductById = createAsyncThunk('product/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await productService.getProductById(id)
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

export const fetchFeaturedProducts = createAsyncThunk('product/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    return await productService.getFeaturedProducts()
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    featured: [],
    currentProduct: null,
    pagination: { page: 1, totalPages: 1, total: 0 },
    filters: {
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'createdAt',
      search: '',
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { category: '', minPrice: '', maxPrice: '', rating: '', sort: 'createdAt', search: '' }
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
      .addCase(fetchProductById.pending, (state) => { state.loading = true })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload.products
      })
  },
})

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer
