import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validasiEmail, validasiPassword } from '../utils/main';

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
    
    // Validate current step
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!terms) {
      setError('Anda harus menyetujui syarat dan ketentuan!');
      return;
    }
    
    if (!formData.targetBerat) {
      setError('Harap masukkan target berat badan!');
      return;
    }
    
    const result = register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const progressWidth = ((step - 1) * 33.33) + '%';

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
          <p className="text-gray-400 mt-2">Bergabunglah dengan komunitas fitness</p>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center mb-2 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-merah -translate-y-1/2 z-10 transition-all duration-300"
              style={{ width: progressWidth }}
            ></div>
            
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="relative z-20 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  stepNum <= step ? 'bg-merah' : 'bg-gray-800'
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
        <div className="kartu p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div id="step1">
                <h2 className="text-2xl font-bold mb-6">Informasi Pribadi</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="input-custom w-full"
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
                      className="input-custom w-full"
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
                        className="input-custom w-full pr-12"
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
                    <p className="text-xs text-gray-400 mt-1">Minimal 8 karakter</p>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Konfirmasi Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="input-custom w-full pr-12"
                        placeholder="Ulangi password"
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
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="tombol-merah px-6 py-3"
                  >
                    Selanjutnya <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Fitness Goals */}
            {step === 2 && (
              <div id="step2">
                <h2 className="text-2xl font-bold mb-6">Tujuan & Data Fisik</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Jenis Kelamin</label>
                    <select
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
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
                      name="usia"
                      value={formData.usia}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                      placeholder="25"
                      min="15"
                      max="80"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="berat"
                      value={formData.berat}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                      placeholder="70"
                      min="30"
                      max="200"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      name="tinggi"
                      value={formData.tinggi}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                      placeholder="175"
                      min="100"
                      max="250"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Level Aktivitas</label>
                  <select
                    name="aktivitas"
                    value={formData.aktivitas}
                    onChange={handleInputChange}
                    className="input-custom w-full"
                  >
                    <option value="1.2">Sedentary (Minim gerak)</option>
                    <option value="1.375">Ringan (Olahraga 1-3x/minggu)</option>
                    <option value="1.55">Moderat (Olahraga 3-5x/minggu)</option>
                    <option value="1.725">Aktif (Olahraga 6-7x/minggu)</option>
                    <option value="1.9">Sangat Aktif (Atlet)</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Tujuan Utama</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'bulking', icon: 'fa-dumbbell', label: 'Bulking', desc: 'Naik massa otot' },
                      { value: 'cutting', icon: 'fa-weight', label: 'Cutting', desc: 'Turun lemak' },
                      { value: 'maintain', icon: 'fa-balance-scale', label: 'Maintain', desc: 'Pertahankan' }
                    ].map((goal) => (
                      <label key={goal.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="tujuan"
                          value={goal.value}
                          checked={formData.tujuan === goal.value}
                          onChange={handleInputChange}
                          className="hidden peer"
                        />
                        <div className="p-4 border border-gray-700 rounded-lg peer-checked:border-merah peer-checked:bg-red-900/20 text-center">
                          <i className={`fas ${goal.icon} text-xl mb-2 block text-merah`}></i>
                          <span className="font-medium">{goal.label}</span>
                          <p className="text-xs text-gray-400 mt-1">{goal.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Kembali
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="tombol-merah px-6 py-3"
                  >
                    Selanjutnya <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {step === 3 && (
              <div id="step3">
                <h2 className="text-2xl font-bold mb-6">Hitung Kebutuhan Anda</h2>
                
                <div className="mb-6 p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-center mb-6">
                    <i className="fas fa-calculator text-4xl text-merah mb-4"></i>
                    <p className="text-gray-300">Berdasarkan data Anda, berikut rekomendasi kebutuhan harian:</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {(() => {
                      const macros = calculateMacros();
                      return (
                        <>
                          <div className="text-center p-4 bg-gray-900 rounded-lg">
                            <div className="text-2xl font-bold text-merah">{macros.targetKalori}</div>
                            <div className="text-sm text-gray-400">Kalori/hari</div>
                          </div>
                          <div className="text-center p-4 bg-gray-900 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{macros.proteinGram}g</div>
                            <div className="text-sm text-gray-400">Protein</div>
                          </div>
                          <div className="text-center p-4 bg-gray-900 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">{macros.karboGram}g</div>
                            <div className="text-sm text-gray-400">Karbohidrat</div>
                          </div>
                          <div className="text-center p-4 bg-gray-900 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{macros.lemakGram}g</div>
                            <div className="text-sm text-gray-400">Lemak</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Target Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="targetBerat"
                      value={formData.targetBerat}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                      placeholder={formData.tujuan === 'bulking' ? parseFloat(formData.berat) + 5 : formData.tujuan === 'cutting' ? parseFloat(formData.berat) - 5 : formData.berat}
                      step="0.1"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Berat badan yang ingin Anda capai</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        className="w-4 h-4 text-merah bg-gray-700 border-gray-600 rounded mt-1"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                        Saya setuju dengan <Link to="#" className="text-merah hover:text-red-400">Syarat & Ketentuan</Link> dan 
                        <Link to="#" className="text-merah hover:text-red-400"> Kebijakan Privasi</Link> LIFTIT.
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Kembali
                  </button>
                  <button
                    type="submit"
                    className="tombol-merah px-8 py-3 text-lg"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Buat Akun
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Sudah punya akun?{' '}
            <Link to="/masuk" className="text-merah font-bold hover:text-red-400">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Daftar;