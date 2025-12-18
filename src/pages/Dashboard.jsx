import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalLatihan: 0,
    totalMenit: 0,
    totalKalori: 0,
    streak: 0
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Hitung BMI
  const hitungBMI = () => {
    if (!user?.weight || !user?.height) return 0;
    const tinggiMeter = user.height / 100;
    return (user.weight / (tinggiMeter * tinggiMeter)).toFixed(1);
  };

  // LOAD DATA DARI DATABASE
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          // ✅ UPDATE: Ganti localhost ke URL backend Vercel
          const response = await fetch('https://backend-lift-it.vercel.app/api/workouts', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // 1. Hitung Statistik
            const totalLatihan = data.length;
            const totalMenit = data.reduce((sum, item) => sum + (item.duration || 0), 0);
            const totalKalori = data.reduce((sum, item) => sum + (item.calories || 0), 0);
            
            // 2. Hitung Streak (Hari berturut-turut)
            const dates = [...new Set(data.map(item => new Date(item.date).toDateString()))]
              .sort((a, b) => new Date(b) - new Date(a));
            
            let streak = 0;
            let currentDate = new Date();
            for (let i = 0; i < dates.length; i++) {
              const workoutDate = new Date(dates[i]);
              const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
              if (diffDays === i) streak++;
              else break;
            }

            setStats({ totalLatihan, totalMenit, totalKalori, streak });
            setRecentHistory(data.slice(0, 5)); // Ambil 5 latihan terakhir
          }
        } catch (error) {
          console.error("Gagal ambil data dashboard:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="container mx-auto max-w-6xl">
        
        {/* HEADER: Sapaan User */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Halo, <span className="text-red-600">{user?.username || 'User'}</span>! 👋
            </h1>
            <p className="text-gray-400">Teruslah konsisten, hasil tidak akan mengkhianati usaha!</p>
          </div>
          <div className="flex gap-3">
             <Link to="/latihan" className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-bold transition">
                + Latihan Baru
             </Link>
             <button 
                onClick={logout} 
                className="border border-red-900 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/50 transition"
              >
                <i className="fas fa-sign-out-alt"></i> Keluar
              </button>
          </div>
        </div>

        {/* SECTION 1: STATISTIK CARD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Total Latihan */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            <div className="text-gray-400 mb-1 text-sm">Total Latihan</div>
            <div className="text-3xl font-bold text-white">{stats.totalLatihan}</div>
            <div className="text-xs text-green-500 mt-1">Sesi selesai</div>
          </div>

          {/* Kalori Terbakar */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            <div className="text-gray-400 mb-1 text-sm">Kalori Terbakar</div>
            <div className="text-3xl font-bold text-orange-500">{stats.totalKalori}</div>
            <div className="text-xs text-gray-500 mt-1">kcal total</div>
          </div>

          {/* Total Durasi */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            <div className="text-gray-400 mb-1 text-sm">Total Waktu</div>
            <div className="text-3xl font-bold text-blue-500">{Math.round(stats.totalMenit / 60)}</div>
            <div className="text-xs text-gray-500 mt-1">Jam latihan</div>
          </div>

          {/* BMI Score */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            <div className="text-gray-400 mb-1 text-sm">BMI Score</div>
            <div className="text-3xl font-bold text-white">{hitungBMI()}</div>
            <div className="text-xs text-gray-500 mt-1">
               Berat: {user?.weight}kg
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECTION 2: RIWAYAT TERAKHIR (Kiri - Lebar) */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Riwayat Latihan Terakhir</h3>
            <div className="space-y-3">
              {recentHistory.length > 0 ? (
                recentHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-red-900/50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
                        <i className="fas fa-dumbbell"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.program_name}</h4>
                        <p className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{item.duration} m</div>
                      <div className="text-xs text-orange-400">{item.calories} kcal</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-neutral-900 rounded-xl border border-dashed border-neutral-700">
                  <p className="text-gray-500 mb-4">Belum ada riwayat latihan.</p>
                  <Link to="/latihan" className="text-red-500 font-bold hover:underline">Mulai Latihan Sekarang &rarr;</Link>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: TARGET & GOAL (Kanan - Sempit) */}
          <div>
            <h3 className="text-xl font-bold mb-4">Target Kamu</h3>
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 mb-6">
               <div className="mb-4">
                  <span className="text-gray-400 text-sm">Program Saat Ini</span>
                  <div className="text-xl font-bold text-white capitalize">{user?.goal || 'General Fitness'}</div>
               </div>
               
               <div className="mb-4">
                  <span className="text-gray-400 text-sm">Target Berat Badan</span>
                  <div className="flex items-end gap-2">
                     <span className="text-3xl font-bold text-red-500">{user?.target_weight || '-'}</span>
                     <span className="text-gray-500 mb-1">kg</span>
                  </div>
               </div>

               <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: user?.weight && user?.target_weight ? `${Math.min((user.weight / user.target_weight) * 100, 100)}%` : '0%' }}
                  ></div>
               </div>
               <p className="text-xs text-gray-500">Progress menuju target</p>
            </div>

            {/* Quote of the day */}
            <div className="bg-gradient-to-br from-red-900 to-black p-6 rounded-xl border border-red-900/30">
               <i className="fas fa-quote-left text-red-500/50 text-2xl mb-2"></i>
               <p className="text-gray-300 italic text-sm">
                 "Jangan berhenti saat kamu lelah. Berhentilah saat kamu selesai."
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
