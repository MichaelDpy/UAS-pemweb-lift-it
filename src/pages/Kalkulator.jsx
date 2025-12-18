import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { hitungKebutuhanKalori, hitungMakronutrien } from '../utils/main';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Kalkulator = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('manual');
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    gender: 'pria',
    age: '25',
    weight: '70',
    height: '175',
    activity: '1.375',
    goal: 'bulking',
    protein: '1.6'
  });

  // Chart ref
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Load user data if in profile mode
  useEffect(() => {
    if (mode === 'profile' && user) {
      setFormData({
        gender: user.data.profil.jenisKelamin,
        age: user.data.profil.usia,
        weight: user.data.profil.berat,
        height: user.data.profil.tinggi,
        activity: user.data.profil.aktivitas,
        goal: user.data.profil.tujuan,
        protein: user.data.profil.tujuan === 'bulking' ? '2.0' : '1.6'
      });
    }
  }, [mode, user]);

  // Effect untuk mengatur chart
  useEffect(() => {
    if (results && chartRef.current) {
      renderChart();
    }

    // Cleanup chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [results]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMacros = () => {
    const { gender, age, weight, height, activity, goal, protein } = formData;
    
    // Convert to numbers
    const numAge = parseFloat(age);
    const numWeight = parseFloat(weight);
    const numHeight = parseFloat(height);
    const numActivity = parseFloat(activity);
    const numProteinMultiplier = parseFloat(protein);

    // Validate
    if (!numAge || !numWeight || !numHeight) {
      alert('Harap isi semua data yang diperlukan!');
      return;
    }

    // Calculate calories
    const calories = hitungKebutuhanKalori(
      numWeight,
      numHeight,
      numAge,
      gender,
      numActivity,
      goal
    );

    // Calculate macros
    const macros = hitungMakronutrien(
      calories,
      numWeight,
      goal
    );

    // Adjust protein based on multiplier
    const adjustedProtein = Math.round(numWeight * numProteinMultiplier);
    const adjustedMacros = {
      ...macros,
      protein: adjustedProtein,
      kalori: Math.round(calories)
    };

    setResults(adjustedMacros);
  };

  const renderChart = () => {
    if (!results || !chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Karbohidrat', 'Lemak'],
        datasets: [{
          data: [results.protein, results.karbohidrat, results.lemak],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 1,
          hoverBackgroundColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          hoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d1d5db',
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 6,
            titleFont: {
              size: 13,
              weight: 'normal'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}g`;
              }
            }
          }
        },
        cutout: '60%',
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  };

  const saveToProfile = () => {
    if (!user) {
      alert('Silakan login untuk menyimpan ke profil!');
      return;
    }

    if (results) {
      // Update user goals with calculated macros
      const updatedUser = {
        ...user,
        data: {
          ...user.data,
          goals: {
            ...user.data.goals,
            targetCalories: results.kalori,
            targetProtein: results.protein,
            targetCarbs: results.karbohidrat,
            targetFat: results.lemak
          }
        }
      };

      // Save to localStorage
      localStorage.setItem('liftit_current_user', JSON.stringify(updatedUser));
      
      // Update users array
      const users = JSON.parse(localStorage.getItem('liftit_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('liftit_users', JSON.stringify(users));
      }

      alert('Data berhasil disimpan ke profil!');
    }
  };

  return (
    <div className="min-h-screen bg-hitam pt-6 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-calculator text-merah mr-3"></i>
            Kalkulator Nutrisi
          </h1>
          <p className="text-gray-400 text-lg">
            Hitung kebutuhan kalori, protein, karbohidrat, dan lemak untuk tujuan fitness Anda
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-abu-border mb-8">
          {[
            { id: 'manual', label: 'Hitung Manual', icon: 'fa-calculator' },
            { id: 'profile', label: 'Dari Profil Saya', icon: 'fa-user' },
            { id: 'advanced', label: 'Mode Lanjutan', icon: 'fa-chart-bar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`text-black-400 text-lg ${
                mode === tab.id 
                  ? 'border-merah text-merah' 
                  : 'border-transparent text-black-400 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Mode Content */}
        {mode === 'manual' && (
          <div className="space-y-8">
            {/* Input Form */}
            <div className="kartu p-8">
              <h2 className="text-2xl font-bold mb-6">Masukkan Data Anda</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-300">Data Pribadi</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Jenis Kelamin</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="input-custom w-full"
                          >
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Usia</label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="input-custom w-full"
                            placeholder="25"
                            min="15"
                            max="80"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Berat (kg)</label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className="input-custom w-full"
                            placeholder="70"
                            step="0.1"
                            min="30"
                            max="300"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">Tinggi (cm)</label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            className="input-custom w-full"
                            placeholder="175"
                            min="100"
                            max="250"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Level */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-300">Level Aktivitas</h3>
                    <div className="space-y-3">
                      {[
                        { value: '1.2', label: 'Sedentary', desc: 'Minim gerak, kerja di depan komputer' },
                        { value: '1.375', label: 'Ringan', desc: 'Olahraga 1-3x per minggu' },
                        { value: '1.55', label: 'Moderat', desc: 'Olahraga 3-5x per minggu' },
                        { value: '1.725', label: 'Aktif', desc: 'Olahraga 6-7x per minggu' }
                      ].map((activity) => (
                        <label key={activity.value} className="flex items-center p-3 border border-gray-700 rounded-lg cursor-pointer hover:border-merah">
                          <input
                            type="radio"
                            name="activity"
                            checked={formData.activity === activity.value}
                            onChange={() => handleRadioChange('activity', activity.value)}
                            className="mr-3 text-merah"
                          />
                          <div>
                            <p className="font-medium">{activity.label}</p>
                            <p className="text-sm text-gray-400">{activity.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Fitness Goal */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-300">Tujuan Fitness</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'bulking', icon: 'fa-dumbbell', label: 'Bulking', desc: 'Naik massa otot' },
                        { value: 'cutting', icon: 'fa-weight', label: 'Cutting', desc: 'Turun lemak' },
                        { value: 'maintain', icon: 'fa-balance-scale', label: 'Maintain', desc: 'Pertahankan' }
                      ].map((goal) => (
                        <label key={goal.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="goal"
                            checked={formData.goal === goal.value}
                            onChange={() => handleRadioChange('goal', goal.value)}
                            className="hidden peer"
                          />
                          <div className={`p-4 border rounded-lg text-center transition-all ${
                            formData.goal === goal.value 
                              ? 'border-merah bg-red-900/20' 
                              : 'border-gray-700 hover:border-gray-600'
                          }`}>
                            <i className={`fas ${goal.icon} text-xl mb-2 block ${
                              formData.goal === goal.value ? 'text-merah' : 'text-gray-400'
                            }`}></i>
                            <span className={`font-medium ${
                              formData.goal === goal.value ? 'text-white' : 'text-gray-300'
                            }`}>{goal.label}</span>
                            <p className="text-xs text-gray-400 mt-1">{goal.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Protein Target */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-300">Target Protein</h3>
                    <div className="space-y-3">
                      {[
                        { value: '1.2', label: 'Pemula (1.2g/kg)', desc: 'Untuk yang baru mulai fitness' },
                        { value: '1.6', label: 'Standar (1.6g/kg)', desc: 'Untuk fitness secara umum' },
                        { value: '2.0', label: 'Intensif (2.0g/kg)', desc: 'Untuk bulking atau atlet' }
                      ].map((protein) => (
                        <label key={protein.value} className="flex items-center p-3 border border-gray-700 rounded-lg cursor-pointer hover:border-merah">
                          <input
                            type="radio"
                            name="protein"
                            checked={formData.protein === protein.value}
                            onChange={() => handleRadioChange('protein', protein.value)}
                            className="mr-3 text-merah"
                          />
                          <div>
                            <p className="font-medium">{protein.label}</p>
                            <p className="text-sm text-gray-400">{protein.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <button 
                    onClick={calculateMacros}
                    className="tombol-merah w-full py-4 text-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="fas fa-calculator mr-2"></i>
                    Hitung Kebutuhan Saya
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="kartu p-8 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Hasil Perhitungan</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-900 rounded-xl">
                <div className="text-3xl font-bold text-merah mb-2">{results.kalori}</div>
                <div className="text-gray-400">Kalori/hari</div>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-xl">
                <div className="text-3xl font-bold text-blue-400 mb-2">{results.protein}g</div>
                <div className="text-gray-400">Protein</div>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-xl">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{results.karbohidrat}g</div>
                <div className="text-gray-400">Karbohidrat</div>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-xl">
                <div className="text-3xl font-bold text-green-400 mb-2">{results.lemak}g</div>
                <div className="text-gray-400">Lemak</div>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-8 max-w-md mx-auto">
              <div className="h-64 relative">
                <canvas ref={chartRef} />
              </div>
              <div className="text-center text-gray-400 text-sm mt-4">
                <i className="fas fa-info-circle mr-2"></i>
                Distribusi makronutrien harian Anda
              </div>
            </div>

            {/* Meal Distribution Example */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-300">Contoh Pembagian Makanan</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-sun text-blue-400"></i>
                    </div>
                    <div>
                      <p className="font-medium">Sarapan</p>
                      <p className="text-sm text-gray-400">30% dari total</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {Math.round(results.kalori * 0.3)} kalori • {Math.round(results.protein * 0.3)}g protein
                  </div>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-utensils text-yellow-400"></i>
                    </div>
                    <div>
                      <p className="font-medium">Makan Siang</p>
                      <p className="text-sm text-gray-400">35% dari total</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {Math.round(results.kalori * 0.35)} kalori • {Math.round(results.protein * 0.35)}g protein
                  </div>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-moon text-purple-400"></i>
                    </div>
                    <div>
                      <p className="font-medium">Makan Malam</p>
                      <p className="text-sm text-gray-400">25% dari total</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {Math.round(results.kalori * 0.25)} kalori • {Math.round(results.protein * 0.25)}g protein
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={saveToProfile}
                  className="tombol-merah px-6 py-3 hover:bg-red-700"
                  disabled={!user}
                >
                  <i className="fas fa-save mr-2"></i> Simpan ke Profil
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <i className="fas fa-print mr-2"></i> Cetak Hasil
                </button>
                <button 
                  onClick={() => {
                    const textToCopy = `
Kebutuhan Nutrisi Harian Anda:
Kalori: ${results.kalori} kalori/hari
Protein: ${results.protein}g/hari
Karbohidrat: ${results.karbohidrat}g/hari
Lemak: ${results.lemak}g/hari

Hitung di LIFTIT Fitness Calculator
                    `;
                    navigator.clipboard.writeText(textToCopy);
                    alert('Hasil perhitungan berhasil disalin ke clipboard!');
                  }}
                  className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <i className="fas fa-copy mr-2"></i> Salin Hasil
                </button>
              </div>
              <button 
                onClick={() => {
                  setResults(null);
                  if (chartInstance.current) {
                    chartInstance.current.destroy();
                    chartInstance.current = null;
                  }
                }}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                <i className="fas fa-redo mr-2"></i> Hitung Ulang
              </button>
            </div>
          </div>
        )}

        {/* Profile Mode */}
        {mode === 'profile' && (
          <div className="space-y-8">
            <div className="kartu p-8">
              <h2 className="text-2xl font-bold mb-6">Hitung dari Profil Anda</h2>
              
              {user ? (
                <div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-bold mb-3 text-gray-300">Data Profil Anda</h3>
                      <div className="space-y-2">
                        <p><span className="text-gray-400">Nama:</span> <span className="font-medium">{user.nama}</span></p>
                        <p><span className="text-gray-400">Usia:</span> <span className="font-medium">{user.data.profil.usia} tahun</span></p>
                        <p><span className="text-gray-400">Berat:</span> <span className="font-medium">{user.data.profil.berat} kg</span></p>
                        <p><span className="text-gray-400">Tinggi:</span> <span className="font-medium">{user.data.profil.tinggi} cm</span></p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3 text-gray-300">Tujuan & Aktivitas</h3>
                      <div className="space-y-2">
                        <p><span className="text-gray-400">Tujuan:</span> <span className="font-medium">
                          {user.data.profil.tujuan === 'bulking' ? 'Bulking' : 
                           user.data.profil.tujuan === 'cutting' ? 'Cutting' : 'Maintain'}
                        </span></p>
                        <p><span className="text-gray-400">Aktivitas:</span> <span className="font-medium">
                          {user.data.profil.aktivitas === '1.2' ? 'Sedentary' :
                           user.data.profil.aktivitas === '1.375' ? 'Ringan' :
                           user.data.profil.aktivitas === '1.55' ? 'Moderat' :
                           user.data.profil.aktivitas === '1.725' ? 'Aktif' : 'Ringan'}
                        </span></p>
                        <p><span className="text-gray-400">Target Berat:</span> <span className="font-medium">{user.data.goals.targetBerat} kg</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800/30 rounded-lg mb-6">
                    <p className="text-sm text-gray-300">
                      <i className="fas fa-info-circle text-merah mr-2"></i>
                      Perhitungan akan menggunakan data dari profil Anda. Klik "Hitung dari Profil Saya" untuk melanjutkan.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (user) {
                        setMode('manual');
                        setTimeout(() => {
                          setFormData({
                            gender: user.data.profil.jenisKelamin,
                            age: user.data.profil.usia,
                            weight: user.data.profil.berat,
                            height: user.data.profil.tinggi,
                            activity: user.data.profil.aktivitas,
                            goal: user.data.profil.tujuan,
                            protein: user.data.profil.tujuan === 'bulking' ? '2.0' : '1.6'
                          });
                          setTimeout(() => {
                            calculateMacros();
                          }, 100);
                        }, 100);
                      }
                    }}
                    className="tombol-merah px-6 py-3 hover:bg-red-700"
                  >
                    <i className="fas fa-calculator mr-2"></i> Hitung dari Profil Saya
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-gray-800/50 rounded-lg text-center">
                  <i className="fas fa-user-slash text-3xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400 mb-4">Silakan login untuk menggunakan data profil</p>
                  <a href="/masuk" className="tombol-merah px-6 py-3 inline-block">
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Mode */}
        {mode === 'advanced' && (
          <div className="space-y-8">
            <div className="kartu p-8">
              <h2 className="text-2xl font-bold mb-6">Mode Lanjutan</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Metode Perhitungan</label>
                  <select className="input-custom w-full">
                    <option value="harris">Harris-Benedict (Standar)</option>
                    <option value="mifflin">Mifflin-St Jeor (Akurat)</option>
                    <option value="katch">Katch-McArdle (Lean Mass)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Body Fat Percentage (%)</label>
                  <input 
                    type="number" 
                    className="input-custom w-full" 
                    placeholder="15" 
                    min="5" 
                    max="50" 
                    step="0.1"
                  />
                  <p className="text-xs text-gray-400 mt-1">Opsional untuk perhitungan lebih akurat</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Carb Cycling</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="carbCycle" value="none" className="mr-2 text-merah" defaultChecked />
                      <span className="text-gray-300">Tidak ada</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="carbCycle" value="low" className="mr-2 text-merah" />
                      <span className="text-gray-300">Rendah Karbo</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="carbCycle" value="high" className="mr-2 text-merah" />
                      <span className="text-gray-300">Tinggi Karbo</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Split Makro Kustom</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Protein (%)</label>
                      <input type="number" className="input-custom w-full" defaultValue="30" min="10" max="50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Karbo (%)</label>
                      <input type="number" className="input-custom w-full" defaultValue="40" min="20" max="60" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Lemak (%)</label>
                      <input type="number" className="input-custom w-full" defaultValue="30" min="10" max="40" />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    alert('Mode lanjutan akan diimplementasikan dalam versi mendatang!');
                  }}
                  className="tombol-merah px-6 py-3 hover:bg-red-700"
                >
                  <i className="fas fa-chart-bar mr-2"></i> Hitung Mode Lanjutan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="kartu p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">
            <i className="fas fa-lightbulb text-merah mr-3"></i>
            Tips & Informasi
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-700 rounded-lg hover:border-merah transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-weight text-merah"></i>
                </div>
                <h3 className="font-bold">Timbang Makanan</h3>
              </div>
              <p className="text-sm text-gray-300">Gunakan food scale untuk akurasi pengukuran porsi makanan.</p>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-clock text-blue-400"></i>
                </div>
                <h3 className="font-bold">Konsisten</h3>
              </div>
              <p className="text-sm text-gray-300">Ikuti pola makan secara konsisten minimal 4 minggu untuk melihat hasil.</p>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-lg hover:border-green-400 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-tint text-green-400"></i>
                </div>
                <h3 className="font-bold">Hidrasi</h3>
              </div>
              <p className="text-sm text-gray-300">Minum 3-4 liter air per hari untuk metabolisme optimal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kalkulator;