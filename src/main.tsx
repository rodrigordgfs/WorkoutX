import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MenuProvider } from './context/MenuContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { ToastContainer } from 'react-toastify';
import { WorkoutProvider } from './context/WorkoutContext.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Clerk - Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <MenuProvider>
          <WorkoutProvider>
            <App />
          </WorkoutProvider>
        </MenuProvider>
      </ClerkProvider>
    </BrowserRouter>
    <ToastContainer />
  </StrictMode>,
)
