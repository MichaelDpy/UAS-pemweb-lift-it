import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-hitam flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-merah mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="tombol-merah px-8 py-3">
            <i className="fas fa-home mr-2"></i> Kembali ke Beranda
          </Link>
          <Link to="/dashboard" className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700">
            <i className="fas fa-chart-line mr-2"></i> Ke Dashboard
          </Link>
        </div>
        <div className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/artikel" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800">
              <i className="fas fa-book-open text-merah text-xl mb-2 block"></i>
              <div>Artikel</div>
            </Link>
            <Link to="/latihan" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800">
              <i className="fas fa-dumbbell text-blue-400 text-xl mb-2 block"></i>
              <div>Latihan</div>
            </Link>
            <Link to="/resep" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800">
              <i className="fas fa-utensils text-green-400 text-xl mb-2 block"></i>
              <div>Resep</div>
            </Link>
            <Link to="/kalkulator" className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800">
              <i className="fas fa-calculator text-yellow-400 text-xl mb-2 block"></i>
              <div>Kalkulator</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;