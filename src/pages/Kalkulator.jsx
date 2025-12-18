// File: src/pages/Kalkulator.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Kalkulator = () => {
  const { user } = useAuth();
  const [input, setInput] = useState({
    berat: '', tinggi: '', usia: '', gender: 'pria', aktivitas: '1.2'
  });
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false); // Untuk loading tombol simpan

  // Auto-fill form dari data user
  useEffect(() => {
    if (user) {
      setInput({
        berat: user.weight || '',
        tinggi: user.height || '',
        usia: user.age || '',
        gender: user.gender || 'pria',
        aktivitas: user.activity_level || '1.2'
      });
    }
  }, [user]);

  const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const hitungKalori = (e) => {
    e.preventDefault();
    const berat = parseFloat(input.berat);
    const tinggi = parseFloat(input.tinggi);
    const usia = parseInt(input.usia);
    const aktivitas = parseFloat(input.aktivitas);

    if (!berat || !tinggi || !usia) return;

    // Rumus Mifflin-St Jeor
    let bmr = input.gender === 'pria'
      ? (10 * berat) + (6.25 * tinggi) - (5 * usia) + 5
      : (10 * berat) + (6.25 * tinggi) - (5 * usia) - 161;

    const tdee = Math.round(bmr * aktivitas);
    const tinggiM = tinggi / 100;
    const bmi = (berat / (tinggiM * tinggiM)).toFixed(1);
    
    let kategori = '';
    if (bmi < 18.5) kategori = 'Kurus';
    else if (bmi < 24.9) kategori = 'Normal';
    else if (bmi < 29.9) kategori = 'Gemuk';
    else kategori = 'Obesitas';

    setHasil({ tdee, bmi, kategori, bmr: Math.round(bmr) });
  };

  // --- FUNGSI BARU: SIMPAN TARGET KE DATABASE ---
  const simpanTarget = async (tipe) => {
    if (!hasil || !user) return;
    setLoading(true);

    // Tentukan kalori berdasarkan tipe (Cutting/Bulking/Maintain)
    let targetCal = hasil.tdee;
    if (tipe === 'bulking') targetCal += 500;
    if (tipe === 'cutting') targetCal -= 500;

    // Hitung Makro Sederhana (Protein 2g/kg BB, Lemak 25% total kalori, Sisanya Karbo)
    const beratBadan = parseFloat(input.berat);
    const protein = Math.round(beratBadan * 2); // 2g per kg
    const fat = Math.round((targetCal * 0.25) / 9); // 25% dari kalori / 9
    const carbs = Math.round((targetCal - (protein * 4) - (fat * 9)) / 4); // Sisanya

    const payload = {
      target_calories: targetCal,
      target_protein: protein,
      target_fat: fat,
      target_carbs: carbs,
      goal: tipe // Sekalian update goal user
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`✅ Target ${tipe.toUpperCase()} berhasil disimpan! Cek Dashboard.`);
        // Update local storage biar dashboard langsung berubah
        const savedUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...savedUser, ...payload }));
      } else {
        alert('Gagal menyimpan target.');
      }
    } catch (err) {
      console.error(err);
      alert('Error koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Kalkulator <span className="text-merah">Nutrisi</span></h1>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          
          {/* FORM */}
          <div className="kartu p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Parameter Fisik</h2>
            <form onSubmit={hitungKalori}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Berat (kg)</label>
                  <input type="number" name="berat" value={input.berat} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Tinggi (cm)</label>
                  <input type="number" name="tinggi" value={input.tinggi} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Usia</label>
                  <input type="number" name="usia" value={input.usia} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Aktivitas</label>
                  <select name="aktivitas" value={input.aktivitas} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                    <option value="1.2">Jarang Olahraga</option>
                    <option value="1.375">Ringan (1-3 hari)</option>
                    <option value="1.55">Sedang (3-5 hari)</option>
                    <option value="1.725">Berat (6-7 hari)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="tombol-merah w-full py-3 rounded font-bold">Hitung Sekarang</button>
            </form>
          </div>

          {/* HASIL */}
          <div className="flex flex-col gap-4">
            {!hasil ? (
              <div className="h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800 text-gray-500">
                <p>Isi form untuk melihat hasil</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <div className="text-gray-400 text-sm">Kalori Harian (Maintenance)</div>
                  <div className="text-4xl font-bold text-white mb-2">{hasil.tdee} <span className="text-sm">kkal</span></div>
                  <div className="flex justify-between text-sm mt-4 border-t border-gray-700 pt-4">
                    <span>BMI: <strong className="text-blue-400">{hasil.bmi}</strong></span>
                    <span>Kategori: <strong className="text-white">{hasil.kategori}</strong></span>
                  </div>
                </div>

                {/* PILIHAN PROGRAM (Save Buttons) */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="font-bold mb-4">Pilih Target Kamu:</h3>
                  
                  {/* Bulking */}
                  <div className="flex justify-between items-center mb-4 p-3 bg-gray-800 rounded hover:bg-gray-750 transition">
                    <div>
                      <div className="font-bold text-green-400">Bulking (+500)</div>
                      <div className="text-xs text-gray-400">{hasil.tdee + 500} kkal</div>
                    </div>
                    <button onClick={() => simpanTarget('bulking')} disabled={loading} className="text-sm bg-green-900 text-green-300 px-3 py-1 rounded hover:bg-green-800">
                      Simpan
                    </button>
                  </div>

                  {/* Cutting */}
                  <div className="flex justify-between items-center mb-4 p-3 bg-gray-800 rounded hover:bg-gray-750 transition">
                    <div>
                      <div className="font-bold text-red-400">Cutting (-500)</div>
                      <div className="text-xs text-gray-400">{hasil.tdee - 500} kkal</div>
                    </div>
                    <button onClick={() => simpanTarget('cutting')} disabled={loading} className="text-sm bg-red-900 text-red-300 px-3 py-1 rounded hover:bg-red-800">
                      Simpan
                    </button>
                  </div>

                  {/* Maintain */}
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded hover:bg-gray-750 transition">
                    <div>
                      <div className="font-bold text-blue-400">Maintenance</div>
                      <div className="text-xs text-gray-400">{hasil.tdee} kkal</div>
                    </div>
                    <button onClick={() => simpanTarget('maintenance')} disabled={loading} className="text-sm bg-blue-900 text-blue-300 px-3 py-1 rounded hover:bg-blue-800">
                      Simpan
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Kalkulator;
