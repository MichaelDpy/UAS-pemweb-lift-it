// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-abu-card border-t border-abu-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Tentang */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-merah rounded-lg flex items-center justify-center">
                <i className="fas fa-dumbbell text-xl text-white"></i>
              </div>
              <span className="ml-3 text-2xl font-bold">
                <span className="text-white">LIFT</span><span className="text-merah">IT</span>
              </span>
            </div>
            <p className="text-gray-400">
              Platform lengkap untuk pembentukan massa otot berbasis data dan ilmu.
            </p>
            
          </div>
          
          
          
          {/* Tim */}
          <div>
            <h4 className="text-lg font-bold mb-4">Tim Kami</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Naufal Khayri Lubis-241401089</li>
              <li>Octho Rivaldo Sinaga-241401122</li>
              <li>Michael Alexius Depari-241401119</li>
            </ul>
          </div>
          
          {/* Kontak */}
          <div>
            <h4 className="text-lg font-bold mb-4">Kontak</h4>
            <ul className="space-y-2">
              <li className="text-gray-400"><i className="fas fa-phone text-merah mr-2"></i> +62 857-6139-1255</li>
            </ul>
            
            {/* Newsletter */}
          
          </div>
        </div>
        
        <div className="border-t border-abu-border pt-8 text-center text-gray-400">
          <p>&copy; 2025 LIFTIT - Tracker Pembentukan Otot.</p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;