import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import AdminPage from './features/admin/pages/admin-page.jsx'

const queryClient = new QueryClient()

const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAdmin ? <AdminPage /> : <App />}
    </QueryClientProvider>
  </StrictMode>,
)
