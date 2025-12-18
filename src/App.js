import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LatihanPage from './pages/LatihanPage';
import KalkulatorPage from './pages/KalkulatorPage';
import ResepPage from './pages/ResepPage';
import ArtikelPage from './pages/ArtikelPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hitam">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/latihan" element={<LatihanPage />} />
          <Route path="/kalkulator" element={<KalkulatorPage />} />
          <Route path="/resep" element={<ResepPage />} />
          <Route path="/artikel" element={<ArtikelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;