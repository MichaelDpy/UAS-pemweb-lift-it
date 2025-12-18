import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chart from 'chart.js/auto';
import Footer from '../components/Footer';
import  '../Beranda.css';
import '../Navbar.css';


const Beranda = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 1234,
    totalWorkouts: 56789,
    recipes: 156,
    progress: 87
  });

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    berat: '',
    tinggi: '',
    usia: '',
    aktivitas: '1.375',
    tujuan: 'maintenance'
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    if (chartRef.current) {
      initChart();
    }

    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const initChart = () => {
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Karbohidrat', 'Lemak'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#dc2626', '#3b82f6', '#f59e0b'],
          borderWidth: 0,
          borderColor: 'transparent'
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d1d5db',
              font: {
                size: 14,
                family: "'Inter', sans-serif"
              },
              padding: 20
            }
          }
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [hasil, setHasil] = useState(null);

  const handleHitung = () => {
    const { berat, tinggi, usia, aktivitas, tujuan } = formData;
    
    if (!berat || !tinggi || !usia) {
      alert('Harap isi semua data!');
      return;
    }
    
    const beratNum = parseFloat(berat);
    const tinggiNum = parseFloat(tinggi);
    const usiaNum = parseInt(usia);
    const aktivitasNum = parseFloat(aktivitas);
    
    // Hitung BMR
    const bmr = 10 * beratNum + 6.25 * tinggiNum - 5 * usiaNum + 5;
    const tdee = bmr * aktivitasNum;
    
    // Sesuaikan berdasarkan tujuan
    let targetKalori;
    switch(tujuan) {
      case 'bulking':
        targetKalori = tdee + 500;
        break;
      case 'cutting':
        targetKalori = tdee - 500;
        break;
      default:
        targetKalori = tdee;
    }
    
    // Hitung makronutrien
    const proteinGram = beratNum * 2;
    const proteinKalori = proteinGram * 4;
    const lemakGram = beratNum * 0.8;
    const lemakKalori = lemakGram * 9;
    const sisaKalori = targetKalori - proteinKalori - lemakKalori;
    const karboGram = sisaKalori / 4;
    
    // Update chart
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = [proteinGram, karboGram, lemakGram];
      chartInstance.current.update();
    }
    
    setHasil({
      targetKalori: Math.round(targetKalori),
      proteinGram: Math.round(proteinGram),
      karboGram: Math.round(karboGram),
      lemakGram: Math.round(lemakGram)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hitam">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-merah border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hitam text-white font-inter">
      {/* Hero Section - Diperbaiki */}
     
<section className="hero-section pt-32 pb-20 px-4">
  <div className="container mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="hero-content">
        <h1 className="hero-title">
          Transformasi Tubuh
          <span className="gradient-text">Dimulai dari Sini</span>
        </h1>
        <p className="hero-subtitle">
          LIFTIT membantu Anda mencapai tujuan fitness dengan program latihan terstruktur, 
          kalkulator nutrisi akurat, dan komunitas yang mendukung.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="cta-button-primary">
                <i className="fas fa-chart-line"></i> Lihat Dashboard
              </Link>
              <Link to="/kalkulator" className="cta-button-secondary">
                <i className="fas fa-calculator"></i> Kalkulator Nutrisi
              </Link>
            </>
          ) : (
            <>
              <Link to="/daftar" className="cta-button-primary">
                <i className="fas fa-user-plus"></i> Daftar 
              </Link>
              <Link to="/masuk" className="cta-button-secondary">
                <i className="fas fa-sign-in-alt"></i> Masuk
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="hero-stats-card">
        <div className="hero-icon-wrapper">
          <i className="fas fa-dumbbell text-4xl"></i>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-center">Mulai Perjalanan Fitness Anda</h3>
        <p className="text-gray-300 mb-6 text-center">
          Bergabung dengan <span className="text-merah font-bold">{stats.totalUsers.toLocaleString()}+</span> anggota lainnya
        </p>
        <div className="hero-stats-grid">
          <div className="stat-item">
            <div className="stat-number text-merah">{stats.recipes}</div>
            <div className="stat-label">Resep</div>
          </div>
          <div className="stat-item">
            <div className="stat-number text-blue-400">{stats.totalWorkouts.toLocaleString()}</div>
            <div className="stat-label">Latihan</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="langkah-section">
  <div className="container mx-auto px-4">
    <div className="langkah-card">
      <h2 className="langkah-title">
        <i className="fas fa-play-circle"></i>
        Mulai dalam 3 Langkah Mudah
      </h2>
      
      <div className="langkah-grid">
        {/* Step 1 */}
        <div className="langkah-item">
          <div className="relative mb-6">
            <div className="langkah-number">1</div>
            <div className="langkah-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
          <h3 className="langkah-subtitle">Hitung Makro</h3>
          <p className="langkah-description">
            Gunakan kalkulator untuk mengetahui kebutuhan kalori dan protein harian Anda
          </p>
          <div className="langkah-icon">
            <i className="fas fa-calculator"></i>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="langkah-item">
          <div className="relative mb-6">
            <div className="langkah-number">2</div>
            <div className="langkah-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
          <h3 className="langkah-subtitle">Ikuti Program</h3>
          <p className="langkah-description">
            Pilih program latihan sesuai level dan tujuan Anda dengan panduan video
          </p>
          <div className="langkah-icon">
            <i className="fas fa-dumbbell"></i>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="langkah-item">
          <div className="mb-6">
            <div className="langkah-number">3</div>
          </div>
          <h3 className="langkah-subtitle">Track Progress</h3>
          <p className="langkah-description">
            Pantau perkembangan dengan dashboard lengkap dan grafik interaktif
          </p>
          <div className="langkah-icon">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12 pt-8 border-t border-gray-800">
        <Link to="/daftar" className="cta-button-sec">
          <i className="fas fa-play"></i>
          Mulai Sekarang 
        </Link>
        <p className="text-gray-400 mt-4 text-sm">
          Sudah punya akun? <Link to="/masuk" className="text-merah font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  </div>
</section>

      {/* 3 Langkah Mudah - Diperbaiki */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="kartu p-8 md:p-12 mb-16 rounded-2xl">
            <h2 className="text-3xl font-bold mb-10 text-center">
              <i className="fas fa-play-circle text-merah mr-3"></i>
              Mulai dalam 3 Langkah Mudah
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-merah to-merah-gelap rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                    <i className="fas fa-arrow-right text-2xl text-gray-600"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Hitung Makro</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Gunakan kalkulator untuk mengetahui kebutuhan kalori dan protein harian Anda
                </p>
                <div className="mt-6">
                  <div className="w-20 h-20 bg-merah/10 rounded-full flex items-center justify-center mx-auto">
                    <i className="fas fa-calculator text-3xl text-merah"></i>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="text-center relative">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-merah to-merah-gelap rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                    <i className="fas fa-arrow-right text-2xl text-gray-600"></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Ikuti Program</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Pilih program latihan sesuai level dan tujuan Anda dengan panduan video
                </p>
                <div className="mt-6">
                  <div className="w-20 h-20 bg-merah/10 rounded-full flex items-center justify-center mx-auto">
                    <i className="fas fa-dumbbell text-3xl text-merah"></i>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="text-center relative">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-merah to-merah-gelap rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Pantau perkembangan dengan dashboard lengkap dan grafik interaktif
                </p>
                <div className="mt-6">
                  <div className="w-20 h-20 bg-merah/10 rounded-full flex items-center justify-center mx-auto">
                    <i className="fas fa-chart-line text-3xl text-merah"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12 pt-8 border-t border-gray-800">
              <Link to="/daftar" className="text-merah font-bold hover:underline">
                <i className="fas fa-play mr-3"></i>
                Mulai Sekarang 
              </Link>
              <p className="text-gray-400 mt-4 text-sm">
                Sudah punya akun? <Link to="/masuk" className="text-merah font-bold hover:underline">Masuk di sini</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kalkulator Nutrisi - Diperbaiki */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="kartu p-8 md:p-10 mb-16 rounded-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <i className="fas fa-calculator text-merah mr-3"></i>
              Kalkulator Nutrisi
            </h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-3 font-medium">Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="berat"
                      value={formData.berat}
                      onChange={handleInputChange}
                      className="input-style focus:ring-2 focus:ring-merah focus:border-transparent"
                      placeholder="Contoh: 70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-3 font-medium">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      name="tinggi"
                      value={formData.tinggi}
                      onChange={handleInputChange}
                      className="input-style focus:ring-2 focus:ring-merah focus:border-transparent"
                      placeholder="Contoh: 175"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-3 font-medium">Usia</label>
                    <input
                      type="number"
                      name="usia"
                      value={formData.usia}
                      onChange={handleInputChange}
                      className="input-style focus:ring-2 focus:ring-merah focus:border-transparent"
                      placeholder="Contoh: 25"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-3 font-medium">Level Aktivitas</label>
                    <select
                      name="aktivitas"
                      value={formData.aktivitas}
                      onChange={handleInputChange}
                      className="input-style focus:ring-2 focus:ring-merah focus:border-transparent"
                    >
                      <option value="1.2">Sedentary (Hampir tidak berolahraga)</option>
                      <option value="1.375">Ringan (Olahraga 1-3 hari/minggu)</option>
                      <option value="1.55">Moderat (Olahraga 3-5 hari/minggu)</option>
                      <option value="1.725">Aktif (Olahraga 6-7 hari/minggu)</option>
                      <option value="1.9">Sangat Aktif (Olahraga berat setiap hari)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-3 font-medium">Tujuan</label>
                    <select
                      name="tujuan"
                      value={formData.tujuan}
                      onChange={handleInputChange}
                      className="input-style focus:ring-2 focus:ring-merah focus:border-transparent"
                    >
                      <option value="cutting">Menurunkan Berat Badan (Cutting)</option>
                      <option value="maintenance">Mempertahankan Berat Badan</option>
                      <option value="bulking">Menambah Massa Otot (Bulking)</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleHitung}
                    className="tombol-merah w-full py-4 text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-red-900/30 transition-all duration-300"
                  >
                    <i className="fas fa-calculator mr-3"></i> Hitung Kebutuhan Nutrisi
                  </button>
                </div>
              </div>
              
              <div>
                <div className="h-72 mb-8 flex items-center justify-center">
                  <canvas ref={chartRef} id="grafikMakro" className="max-w-full"></canvas>
                </div>
                
                {hasil ? (
                  <div id="hasil-kalkulator" className="kartu p-6 rounded-xl">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-black text-merah mb-2">{hasil.targetKalori}</div>
                      <div className="text-gray-400 text-lg">Kalori/hari</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-xl font-bold text-white">{hasil.proteinGram}g</div>
                        <div className="text-sm text-gray-400">Protein</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-xl font-bold text-white">{hasil.karboGram}g</div>
                        <div className="text-sm text-gray-400">Karbohidrat</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-xl font-bold text-white">{hasil.lemakGram}g</div>
                        <div className="text-sm text-gray-400">Lemak</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300 flex items-start">
                        <i className="fas fa-lightbulb text-merah mr-3 mt-1"></i>
                        <span>Tips: Konsumsi <span className="text-white font-semibold">{hasil.proteinGram}g</span> protein per hari untuk optimalisasi pembentukan otot</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="kartu p-8 text-center rounded-xl">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-calculator text-3xl text-gray-600"></i>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Masukkan Data Anda</h4>
                    <p className="text-gray-400">
                      Isi form di sebelah kiri untuk melihat kebutuhan nutrisi harian
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Lengkap - Diperbaiki */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Fitur Lengkap untuk Progress Optimal</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Semua yang Anda butuhkan untuk mencapai tujuan fitness dalam satu platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="kartu p-6 hover:transform hover:-translate-y-3 transition-all duration-300 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-merah/20 to-merah/10 rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-calculator text-2xl text-merah"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Kalkulator Nutrisi</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-merah to-merah-gelap mb-4 rounded-full"></div>
              <p className="text-gray-400 mb-6">
                Hitung kebutuhan kalori dan makronutrien berdasarkan data pribadi dan tujuan fitness Anda.
              </p>
              <Link to="/kalkulator" className="cta-button-secondary">
                Coba Sekarang <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="kartu p-6 hover:transform hover:-translate-y-3 transition-all duration-300 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-dumbbell text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Program Latihan</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 mb-4 rounded-full"></div>
              <p className="text-gray-400 mb-6">
                Program latihan terstruktur untuk semua level, dari pemula hingga advanced.
              </p>
              <Link to="/latihan" className="cta-button-secondary">
                Lihat Program <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="kartu p-6 hover:transform hover:-translate-y-3 transition-all duration-300 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-utensils text-2xl text-green-400"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Resep Tinggi Protein</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-green-600 mb-4 rounded-full"></div>
              <p className="text-gray-400 mb-6">
                100+ resep sehat dan lezat untuk mendukung program bulking dan cutting.
              </p>
              <Link to="/resep" className="cta-button-secondary">
                Eksplor Resep <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="kartu p-6 hover:transform hover:-translate-y-3 transition-all duration-300 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-2xl text-purple-400"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Tracking Progress</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-purple-600 mb-4 rounded-full"></div>
              <p className="text-gray-400 mb-6">
                Pantau perkembangan berat badan, lingkar tubuh, dan kekuatan latihan.
              </p>
              <Link to="/dashboard" className="cta-button-secondary">
                Track Progress <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="kartu p-6 hover:transform hover:-translate-y-3 transition-all duration-300 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-book-open text-2xl text-yellow-400"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Artikel Edukasi</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-yellow-600 mb-4 rounded-full"></div>
              <p className="text-gray-400 mb-6">
                Informasi terbaru tentang nutrisi, latihan, dan tips fitness dari para ahli.
              </p>
              <Link to="/artikel" className="cta-button-secondary">
                Baca Artikel <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 via-hitam to-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Siap Transformasi Tubuh Anda?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Bergabung dengan LIFTIT hari ini dan mulai perjalanan fitness Anda dengan panduan yang tepat.
          </p>
          {user ? (
            <Link to="/dashboard" className="tombol-merah px-12 py-5 text-xl font-semibold inline-block rounded-lg hover:shadow-2xl hover:shadow-red-900/40 transition-all duration-300 transform hover:-translate-y-1">
              <i className="fas fa-rocket mr-3"></i> Lanjutkan Perjalanan
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/daftar" className="tombol-merah px-12 py-5 text-xl font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-900/40 transition-all duration-300 transform hover:-translate-y-1">
                <i className="fas fa-user-plus mr-3"></i> Daftar 
              </Link>
              <Link to="/masuk" className="cta-button-secondary">
                <i className="fas fa-sign-in-alt mr-3"></i> Masuk
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


export default Beranda;
