import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import PageLoader from '../components/common/PageLoader'

// Public Pages
const Home = lazy(() => import('../pages/Home'))
const Shop = lazy(() => import('../pages/Shop'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Category = lazy(() => import('../pages/Category'))
const Search = lazy(() => import('../pages/Search'))
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))
const HelpCenter = lazy(() => import('../pages/HelpCenter'))
const FAQ = lazy(() => import('../pages/FAQ'))

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'))

// Cart & Checkout
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'))

// User Dashboard
const UserDashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const UserProfile = lazy(() => import('../pages/dashboard/Profile'))
const UserOrders = lazy(() => import('../pages/dashboard/Orders'))
const OrderDetail = lazy(() => import('../pages/dashboard/OrderDetail'))
const Wishlist = lazy(() => import('../pages/dashboard/Wishlist'))
const UserAddresses = lazy(() => import('../pages/dashboard/Addresses'))
const UserReviews = lazy(() => import('../pages/dashboard/Reviews'))
const UserNotifications = lazy(() => import('../pages/dashboard/Notifications'))

// Seller Dashboard
const SellerDashboard = lazy(() => import('../pages/seller/Dashboard'))
const SellerProducts = lazy(() => import('../pages/seller/Products'))
const AddProduct = lazy(() => import('../pages/seller/AddProduct'))
const EditProduct = lazy(() => import('../pages/seller/EditProduct'))
const SellerOrders = lazy(() => import('../pages/seller/Orders'))
const SellerAnalytics = lazy(() => import('../pages/seller/Analytics'))
const SellerInventory = lazy(() => import('../pages/seller/Inventory'))

// Admin Dashboard
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('../pages/admin/Users'))
const AdminProducts = lazy(() => import('../pages/admin/Products'))
const AdminOrders = lazy(() => import('../pages/admin/Orders'))
const AdminCategories = lazy(() => import('../pages/admin/Categories'))
const AdminCoupons = lazy(() => import('../pages/admin/Coupons'))
const AdminSellers = lazy(() => import('../pages/admin/Sellers'))
const AdminReports = lazy(() => import('../pages/admin/Reports'))

// 404
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Protected - Customer */}
        <Route element={<ProtectedRoute roles={['customer', 'seller', 'admin']} />}>
          <Route element={<MainLayout />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />
            <Route path="/dashboard/orders" element={<UserOrders />} />
            <Route path="/dashboard/orders/:id" element={<OrderDetail />} />
            <Route path="/dashboard/wishlist" element={<Wishlist />} />
            <Route path="/dashboard/addresses" element={<UserAddresses />} />
            <Route path="/dashboard/reviews" element={<UserReviews />} />
            <Route path="/dashboard/notifications" element={<UserNotifications />} />
          </Route>
        </Route>

        {/* Protected - Seller */}
        <Route element={<ProtectedRoute roles={['seller', 'admin']} />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/products/add" element={<AddProduct />} />
            <Route path="/seller/products/edit/:id" element={<EditProduct />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/analytics" element={<SellerAnalytics />} />
            <Route path="/seller/inventory" element={<SellerInventory />} />
          </Route>
        </Route>

        {/* Protected - Admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/sellers" element={<AdminSellers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
