import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Add this

// Pages
import Beranda from './pages/Beranda';
import Artikel from './pages/Artikel';
import Daftar from './pages/Daftar';
import Dashboard from './pages/Dashboard';
import Kalkulator from './pages/Kalkulator';
import Latihan from './pages/Latihan';
import Masuk from './pages/Masuk';
import Profil from './pages/Profil';
import Resep from './pages/Resep';
import NotFound from './pages/NotFound';


// Initialize localStorage data if not exists
if (!localStorage.getItem('liftit_users')) {
  localStorage.setItem('liftit_users', JSON.stringify([]));
}

// Private Route Component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('liftit_current_user'));
  return user ? children : <Navigate to="/masuk" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-hitam flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Beranda />} />
              <Route path="/artikel" element={<Artikel />} />
              <Route path="/daftar" element={<Daftar />} />
              <Route path="/masuk" element={<Masuk />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="/kalkulator" element={<Kalkulator />} />
              <Route path="/latihan" element={<Latihan />} />
              <Route 
                path="/profil" 
                element={
                  <PrivateRoute>
                    <Profil />
                  </PrivateRoute>
                } 
              />
              <Route path="/resep" element={<Resep />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer /> {/* Add this */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;