// Navbar.jsx yang sudah diperbaiki
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Beranda', icon: 'fa-home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { path: '/kalkulator', label: 'Kalkulator', icon: 'fa-calculator' },
    { path: '/resep', label: 'Resep', icon: 'fa-utensils' },
    { path: '/artikel', label: 'Artikel', icon: 'fa-book-open' },
    { path: '/latihan', label: 'Latihan', icon: 'fa-dumbbell' },
    { path: '/Profil', label: 'Profil', icon: 'fa-user' },
 
  ];

  return (
    <nav className="bg-hitam/95 border-b border-abu-border fixed w-full z-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center no-underline">
            <div className="w-10 h-10 bg-merah rounded-lg flex items-center justify-center">
              <i className="fas fa-dumbbell text-white"></i>
            </div>
            <span className="ml-3 text-xl font-bold">
              <span className="text-white">LIFT</span>
              <span className="text-merah">IT</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-merah text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-merah rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <span className="text-gray-300 text-sm">{user.nama?.split(' ')[0] || 'User'}</span>
                </div>
                <button
                  onClick={logout}
                  className="tombol-merah px-4 py-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/masuk" className="tombol-merah px-4 py-2">
                <i className="fas fa-sign-in-alt mr-2"></i>
                <span>Masuk</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white text-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 slide-up">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-merah text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-800 pt-3 mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
                      <div className="w-8 h-8 bg-merah rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-white text-sm"></i>
                      </div>
                      <span>{user.nama}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 w-full text-left"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/masuk"
                    className="tombol-merah px-4 py-3 flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    <span>Masuk</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;