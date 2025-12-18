// File: src/pages/Daftar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validasiEmail, validasiPassword } from '../utils/main'; // Pastikan file ini ada

const Daftar = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    jenisKelamin: 'pria',
    usia: '',
    berat: '',
    tinggi: '',
    aktivitas: '1.375',
    tujuan: 'bulking',
    targetBerat: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [terms, setTerms] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const nextStep = () => {
    setError('');
    
    // Validasi Step 1
    if (step === 1) {
      if (!formData.nama || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Harap isi semua data!');
        return;
      }
      
      if (!validasiEmail(formData.email)) {
        setError('Format email tidak valid!');
        return;
      }
      
      if (!validasiPassword(formData.password)) {
        setError('Password minimal 8 karakter!');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Password tidak sama!');
        return;
      }
    }
    
    // Validasi Step 2
    if (step === 2) {
      if (!formData.usia || !formData.berat || !formData.tinggi) {
        setError('Harap isi semua data fisik!');
        return;
      }
      
      if (formData.usia < 15 || formData.usia > 80) {
        setError('Usia harus antara 15-80 tahun!');
        return;
      }
      
      if (formData.berat < 30 || formData.berat > 200) {
        setError('Berat badan harus antara 30-200 kg!');
        return;
      }
      
      if (formData.tinggi < 100 || formData.tinggi > 250) {
        setError('Tinggi badan harus antara 100-250 cm!');
        return;
      }
    }
    
    if (step === 3 && !terms) {
      setError('Anda harus menyetujui syarat dan ketentuan!');
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const calculateMacros = () => {
    const { berat, tinggi, usia, jenisKelamin, aktivitas, tujuan } = formData;
    
    // Hitung BMR
    let bmr;
    if (jenisKelamin === 'pria') {
      bmr = 88.362 + (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia);
    } else {
      bmr = 447.593 + (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia);
    }
    
    // Hitung TDEE
    const tdee = bmr * aktivitas;
    
    // Sesuaikan dengan tujuan
    let targetKalori;
    switch(tujuan) {
      case 'bulking':
        targetKalori = Math.round(tdee + 500);
        break;
      case 'cutting':
        targetKalori = Math.round(tdee - 500);
        break;
      default:
        targetKalori = Math.round(tdee);
    }
    
    // Hitung makronutrien
    const proteinGram = Math.round(tujuan === 'bulking' ? berat * 2 : berat * 1.6);
    const proteinKalori = proteinGram * 4;
    
    const lemakKalori = targetKalori * 0.25;
    const lemakGram = Math.round(lemakKalori / 9);
    
    const karboKalori = targetKalori - proteinKalori - lemakKalori;
    const karboGram = Math.round(karboKalori / 4);
    
    return { targetKalori, proteinGram, karboGram, lemakGram };
  };

  // ✅ Aku tambahkan async/await di sini biar fungsi register jalan
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!terms) {
      setError('Anda harus menyetujui syarat dan ketentuan!');
      return;
    }
    
    if (!formData.targetBerat) {
      setError('Harap masukkan target berat badan!');
      return;
    }
    
    // Panggil register (akan dihandle AuthContext)
    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Gagal Mendaftar');
    }
  };

  const progressWidth = ((step - 1) * 33.33) + '%';

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-dumbbell text-2xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-white">
            LIFT<span className="text-red-600">IT</span>
          </h1>
          <p className="text-gray-400 mt-2">Bergabunglah dengan komunitas fitness</p>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center mb-2 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 z-10 transition-all duration-300"
              style={{ width: progressWidth }}
            ></div>
            
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="relative z-20 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-white ${
                  stepNum <= step ? 'bg-red-600' : 'bg-gray-800'
                }`}>
                  <span className="font-bold">{stepNum}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {stepNum === 1 && 'Data Diri'}
                  {stepNum === 2 && 'Tujuan Fitness'}
                  {stepNum === 3 && 'Selesai'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div id="step1">
                <h2 className="text-2xl font-bold mb-6 text-white">Informasi Pribadi</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600 pr-12"
                        placeholder="Minimal 8 karakter"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Konfirmasi Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600 pr-12"
                        placeholder="Ulangi password"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
                  >
                    Selanjutnya <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Fitness Goals */}
            {step === 2 && (
              <div id="step2">
                <h2 className="text-2xl font-bold mb-6 text-white">Tujuan & Data Fisik</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Jenis Kelamin</label>
                    <select
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600"
                    >
                      <option value="pria">Pria</option>
                      <option value="wanita">Wanita</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Usia</label>
                    <input
                      type="number"
                      name="usia"
                      value={formData.usia}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-red-600"
                      placeholder="25"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                   <div>
                    <label className="block text-gray-300 mb-2">Berat (kg)</label>
                    <input type="number" name="berat" value={formData.berat} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded" />
                   </div>
                   <div>
                    <label className="block text-gray-300 mb-2">Tinggi (cm)</label>
                    <input type="number" name="tinggi" value={formData.tinggi} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded" />
                   </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Tujuan Utama</label>
                  <div className="grid grid-cols-3 gap-3 text-white">
                     {['bulking', 'cutting', 'maintain'].map((goal) => (
                       <label key={goal} className={`cursor-pointer border border-gray-700 p-4 rounded text-center ${formData.tujuan === goal ? 'border-red-600 bg-red-900/20' : ''}`}>
                         <input type="radio" name="tujuan" value={goal} checked={formData.tujuan === goal} onChange={handleInputChange} className="hidden" />
                         <span className="capitalize">{goal}</span>
                       </label>
                     ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="text-gray-400 hover:text-white">Kembali</button>
                  <button type="button" onClick={nextStep} className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700">Selanjutnya</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div id="step3">
                 <h2 className="text-2xl font-bold mb-6 text-white">Selesai</h2>
                 {/* Area Kalkulasi Macro */}
                 <div className="mb-6 p-4 bg-gray-800 rounded">
                    <p className="text-gray-300 mb-4">Target Kalori Harian: <span className="text-red-500 font-bold">{calculateMacros().targetKalori} kkal</span></p>
                 </div>
                 
                 <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Target Berat (kg)</label>
                    <input type="number" name="targetBerat" value={formData.targetBerat} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded" required />
                 </div>

                 <div className="mb-6 flex items-center">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mr-2" />
                    <span className="text-gray-400 text-sm">Saya setuju dengan Syarat & Ketentuan</span>
                 </div>

                 <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="text-gray-400 hover:text-white">Kembali</button>
                    <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded hover:bg-red-700 font-bold">Buat Akun</button>
                 </div>
              </div>
            )}
          </form>
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Daftar;
