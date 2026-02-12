import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Debug: mark app bundle execution in console
console.log('frontend: main.jsx loaded');
window.__FRONTEND_BUNDLE_LOADED__ = true;
import DOMPurify from 'dompurify';
window.__DOMPURIFY_AVAILABLE__ = !!DOMPurify;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
