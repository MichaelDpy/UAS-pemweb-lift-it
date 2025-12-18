// File: src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Daftar from './pages/Daftar';
import Masuk from './pages/Masuk';
import Dashboard from './pages/Dashboard';
import Kalkulator from './pages/Kalkulator';
import Latihan from './pages/Latihan';
import PrivateRoute from './components/PrivateRoute'; // 👈 Import ini

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Halaman Publik (Bisa diakses siapa saja) */}
        <Route path="/" element={<Beranda />} />
        <Route path="/daftar" element={<Daftar />} />
        <Route path="/masuk" element={<Masuk />} />

        {/* 👇 Halaman Privat (Harus Login Dulu) */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/kalkulator" 
          element={
            <PrivateRoute>
              <Kalkulator />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/latihan" 
          element={
            <PrivateRoute>
              <Latihan />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
