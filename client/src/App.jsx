import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'

function App() {
  const dispatch = useDispatch()

  const { darkMode } = useSelector((state) => state.ui)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F172A',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#2563EB', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
    </Router>
  )
}

export default App
