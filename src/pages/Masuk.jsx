import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Masuk = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(email, password);
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hitam p-4 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-merah rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-dumbbell text-2xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-white">LIFT</span>
            <span className="text-merah">IT</span>
          </h1>
          <p className="text-gray-400 mt-2">Tracker Pembentukan Otot</p>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <div className="kartu p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Masuk ke Akun Anda</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Alamat Email</label>                   <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-custom w-full pl-12 pr-4 py-3"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Password</label>                    <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-custom w-full pl-12 pr-12 py-3"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

            

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`tombol-merah w-full py-3 text-lg mb-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Masuk
                  </>
                )}
              </button>

              

            </form>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Belum punya akun?{' '}
                <Link to="/daftar" className="text-merah font-bold hover:text-red-400">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Masuk;