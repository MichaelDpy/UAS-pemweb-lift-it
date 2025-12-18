// File: src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 👇 1. Import Dua Komponen Penting Ini
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 2. Bungkus App dengan Router */}
    <BrowserRouter>
      {/* 👇 3. Bungkus App dengan AuthProvider (Listriknya) */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
