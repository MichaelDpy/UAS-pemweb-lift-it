// File: src/pages/Profil.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profil = () => {
  const { user, logout } = useAuth(); // Ambil user dari context (buat email & token)
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // State Form (Sesuai kolom database)
  const [formData, setFormData] = useState({
    username: '',
    gender: 'pria',
    age: '',
    weight: '',
    height: '',
    activity_level: '1.2',
    goal: 'maintenance',
    target_weight: ''
  });

  // 1. Load Data Asli dari Database saat halaman dibuka
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        // ✅ UPDATE: Ganti localhost ke URL backend Vercel
        const response = await fetch('https://backend-lift-it.vercel.app/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setFormData({
            username: data.username || '',
            gender: data.gender || 'pria',
            age: data.age || '',
            weight: data.weight || '',
            height: data.height || '',
            activity_level: data.activity_level || '1.2',
            goal: data.goal || 'maintenance',
            target_weight: data.target_weight || ''
          });
        }
      } catch (err) {
        console.error("Gagal load profil:", err);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Simpan Perubahan ke Database
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      // ✅ UPDATE: Ganti localhost ke URL backend Vercel
      const response = await fetch('https://backend-lift-it.vercel.app/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMsg({ type: 'success', text: '✅ Profil berhasil diperbarui!' });
        
        // Update data user di localStorage agar aplikasi lain (seperti navbar) langsung tahu
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...savedUser, ...data.user }; // Gabungkan data lama dgn yg baru
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Opsional: Reload halaman agar Context refresh (cara cepat)
        // window.location.reload(); 
      } else {
        setMsg({ type: 'error', text: '❌ Gagal update: ' + data.msg });
      }
    } catch (err) {
      setMsg({ type: 'error', text: '❌ Terjadi kesalahan server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="container mx-auto max-w-4xl">
        
        <h1 className="text-3xl font-bold mb-2">Profil & Pengaturan</h1>
        <p className="text-gray-400 mb-8">Kelola data fisikmu agar perhitungan nutrisi tetap akurat.</p>

        {/* Pesan Sukses/Error */}
        {msg.text && (
          <div className={`p-4 mb-6 rounded-lg ${msg.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Kartu Kiri: Foto & Info Akun */}
          <div className="md:col-span-1">
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
                {formData.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold mb-1">{formData.username}</h2>
              <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
              
              <button onClick={logout} className="w-full border border-red-900 text-red-500 py-2 rounded-lg hover:bg-red-900/20 transition">
                Logout
              </button>
            </div>
          </div>

          {/* Kartu Kanan: Form Edit */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
              <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Data Fisik</h3>
              
              {/* Nama & Gender */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none">
                    <option value="pria">Pria</option>
                    <option value="wanita">Wanita</option>
                  </select>
                </div>
              </div>

              {/* Usia, Berat, Tinggi */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Usia (thn)</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Berat (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tinggi (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" />
                </div>
              </div>

              {/* Aktivitas & Goal */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Level Aktivitas</label>
                <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none">
                  <option value="1.2">Sedentary (Jarang Olahraga)</option>
                  <option value="1.375">Light (1-3x seminggu)</option>
                  <option value="1.55">Moderate (3-5x seminggu)</option>
                  <option value="1.725">Active (6-7x seminggu)</option>
                  <option value="1.9">Very Active (Fisik Berat)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tujuan Utama</label>
                  <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none capitalize">
                    <option value="bulking">Bulking (Naik Massa)</option>
                    <option value="cutting">Cutting (Turun Lemak)</option>
                    <option value="maintenance">Maintenance (Jaga Berat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Target Berat (kg)</label>
                  <input type="number" name="target_weight" value={formData.target_weight} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profil;
