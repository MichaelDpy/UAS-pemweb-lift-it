// Sistem autentikasi untuk React

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.users = JSON.parse(localStorage.getItem('liftit_users')) || [];
    this.initializeSession();
  }

  // Inisialisasi session dari localStorage
  initializeSession() {
    const savedUser = localStorage.getItem('liftit_current_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('liftit_current_user');
      }
    }
  }

  // Daftar user baru
  register(userData) {
    // Validasi data
    if (!userData.email || !userData.password || !userData.nama) {
      return { success: false, message: 'Harap isi semua data!' };
    }

    // Cek apakah email sudah terdaftar
    if (this.users.some(user => user.email === userData.email)) {
      return { success: false, message: 'Email sudah terdaftar!' };
    }

    // Validasi password
    if (userData.password.length < 8) {
      return { success: false, message: 'Password minimal 8 karakter!' };
    }

    // Buat user baru
    const newUser = {
      id: this.generateUserId(),
      email: userData.email,
      password: userData.password,
      nama: userData.nama,
      tanggalDaftar: new Date().toISOString(),
      data: {
        profil: {
          berat: userData.berat || 70,
          tinggi: userData.tinggi || 170,
          usia: userData.usia || 25,
          jenisKelamin: userData.jenisKelamin || 'pria',
          aktivitas: userData.aktivitas || 1.375,
          tujuan: userData.tujuan || 'bulking'
        },
        progress: {
          berat: [],
          lingkar: { lengan: [], dada: [], paha: [] },
          latihan: [],
          nutrisi: []
        },
        goals: {
          targetBerat: userData.targetBerat || 75,
          targetProtein: userData.berat ? userData.berat * 2 : 140,
          latihanPerMinggu: 4
        },
        settings: {
          notifikasi: true,
          tema: 'dark',
          satuan: 'metric'
        }
      }
    };

    // Tambahkan ke database
    this.users.push(newUser);
    this.saveUsers();

    // Login otomatis setelah registrasi
    return this.login(userData.email, userData.password);
  }

  // Login user
  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Email atau password salah!' };
    }

    // Set current user
    this.currentUser = user;
    localStorage.setItem('liftit_current_user', JSON.stringify(user));

    return { 
      success: true, 
      message: 'Login berhasil!',
      user: user 
    };
  }

  // Logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem('liftit_current_user');
    return { success: true, message: 'Logout berhasil!' };
  }

  // Update user data
  updateUserData(userId, newData) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    // Update data
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...newData
    };

    // Update current user jika sama
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = this.users[userIndex];
      localStorage.setItem('liftit_current_user', JSON.stringify(this.currentUser));
    }

    this.saveUsers();
    return true;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user by ID
  getUserById(userId) {
    return this.users.find(u => u.id === userId);
  }

  // Generate unique user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('liftit_users', JSON.stringify(this.users));
  }
}

// Export instance
const auth = new AuthSystem();
export default auth;