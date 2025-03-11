import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.scss';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx';
import { ToastProvider } from './components/Toast/ToastProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>
);
