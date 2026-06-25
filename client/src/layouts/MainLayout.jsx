import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import QuickView from '../components/product/QuickView'
import { useSelector } from 'react-redux'

export default function MainLayout() {
  const { quickViewProduct } = useSelector((state) => state.ui)

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      {quickViewProduct && <QuickView product={quickViewProduct} />}
    </div>
  )
}
