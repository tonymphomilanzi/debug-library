import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#111',
          border: '1px solid #2a2a2a',
          color: '#ededed',
          fontFamily: 'Ubuntu, sans-serif',
          fontSize: '13px',
        },
      }}
      theme="dark"
    />
  </StrictMode>
)