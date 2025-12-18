// Fungsi utilitas utama

// Simpan data ke localStorage
export const simpanData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Ambil data dari localStorage
export const ambilData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Kalkulator BMR dan TDEE
export const hitungKebutuhanKalori = (berat, tinggi, usia, jenisKelamin, aktivitas, tujuan) => {
  let bmr;
  if (jenisKelamin === 'pria') {
    bmr = 88.362 + (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia);
  } else {
    bmr = 447.593 + (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia);
  }
  
  const tdee = bmr * aktivitas;
  
  switch(tujuan) {
    case 'bulking':
      return tdee + 500;
    case 'cutting':
      return tdee - 500;
    default:
      return tdee;
  }
};

// Hitung kebutuhan makronutrien
export const hitungMakronutrien = (kalori, berat, tujuan) => {
  const proteinGram = tujuan === 'bulking' ? berat * 2 : berat * 1.6;
  const proteinKalori = proteinGram * 4;
  
  const lemakKalori = kalori * 0.25;
  const lemakGram = lemakKalori / 9;
  
  const karboKalori = kalori - proteinKalori - lemakKalori;
  const karboGram = karboKalori / 4;
  
  return {
    protein: Math.round(proteinGram),
    lemak: Math.round(lemakGram),
    karbohidrat: Math.round(karboGram),
    kalori: Math.round(kalori)
  };
};

// Format tanggal Indonesia
export const formatTanggal = (tanggal) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(tanggal).toLocaleDateString('id-ID', options);
};

// Validasi email
export const validasiEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validasi password
export const validasiPassword = (password) => {
  return password.length >= 8;
};

// Hitung progress percentage
export const hitungProgress = (nilaiSekarang, nilaiTarget) => {
  return Math.min(Math.round((nilaiSekarang / nilaiTarget) * 100), 100);
};

// Generate ID unik
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format angka dengan titik
export const formatAngka = (angka) => {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};