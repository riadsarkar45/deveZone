import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/Route.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './Auth/AuthProvider/AuthProvider.jsx'
import User from './Global/User.jsx'
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <User>
          <RouterProvider router={router}></RouterProvider>
        </User>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
