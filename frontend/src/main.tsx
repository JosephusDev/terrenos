import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { ThemeProvider } from '@/context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  </StrictMode>,
)
