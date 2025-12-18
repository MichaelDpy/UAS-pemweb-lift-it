import auth from './auth';

class UserManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 menit
  }

  // Hitung kebutuhan makro untuk user
  calculateUserMacros(userId) {
    try {
      const user = auth.getUserById(userId);
      if (!user) {
        console.error('User tidak ditemukan:', userId);
        return null;
      }

      const profil = user.data?.profil;
      if (!profil) {
        console.error('Profil user tidak ditemukan');
        return null;
      }

      // Validasi data yang diperlukan
      const requiredFields = ['jenisKelamin', 'berat', 'tinggi', 'usia', 'aktivitas', 'tujuan'];
      for (const field of requiredFields) {
        if (!profil[field] && profil[field] !== 0) {
          console.error(`Field ${field} tidak ada di profil`);
          return {
            kalori: 0,
            protein: 0,
            karbohidrat: 0,
            lemak: 0,
            bmr: 0,
            tdee: 0
          };
        }
      }
      
      // Hitung BMR
      let bmr;
      if (profil.jenisKelamin === 'pria') {
        bmr = 88.362 + (13.397 * profil.berat) + (4.799 * profil.tinggi) - (5.677 * profil.usia);
      } else {
        bmr = 447.593 + (9.247 * profil.berat) + (3.098 * profil.tinggi) - (4.330 * profil.usia);
      }

      // Hitung TDEE
      const tdee = bmr * profil.aktivitas;

      // Sesuaikan dengan tujuan
      let targetKalori;
      switch(profil.tujuan) {
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
      const proteinGram = Math.round(profil.tujuan === 'bulking' ? profil.berat * 2 : profil.berat * 1.6);
      const proteinKalori = proteinGram * 4;

      const lemakKalori = targetKalori * 0.25;
      const lemakGram = Math.round(lemakKalori / 9);

      const karboKalori = targetKalori - proteinKalori - lemakKalori;
      const karboGram = Math.round(karboKalori / 4);

      return {
        kalori: targetKalori,
        protein: proteinGram,
        karbohidrat: karboGram,
        lemak: lemakGram,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
      };
    } catch (error) {
      console.error('Error dalam calculateUserMacros:', error);
      return null;
    }
  }

  // Get dashboard summary
  getDashboardSummary(userId) {
    try {
      const user = auth.getUserById(userId);
      if (!user) {
        console.error('User tidak ditemukan di getDashboardSummary');
        return null;
      }

      // Clear cache untuk memastikan data fresh
      this.cache.delete(`dashboard_${userId}`);
      
      const stats = this.getUserStats(userId);
      const macros = this.calculateUserMacros(userId);
      const progress = user.data?.progress || {
        berat: [],
        latihan: [],
        nutrisi: [],
        lingkar: {}
      };

      // Data hari ini
      const today = new Date().toDateString();
      const todayWorkout = progress.latihan?.find(l => {
        try {
          return new Date(l.tanggal).toDateString() === today;
        } catch {
          return false;
        }
      });
      
      const todayNutrition = progress.nutrisi?.find(n => {
        try {
          return new Date(n.tanggal).toDateString() === today;
        } catch {
          return false;
        }
      });

      return {
        user: {
          nama: user.nama,
          email: user.email,
          profil: user.data?.profil || {}
        },
        stats: stats || {
          beratTerakhir: user.data?.profil?.berat || 0,
          beratAwal: user.data?.profil?.berat || 0,
          targetBerat: user.data?.goals?.targetBerat || 0,
          progress: 0,
          streak: 0,
          totalLatihan: 0,
          totalHari: 0
        },
        macros: macros || {
          kalori: 0,
          protein: 0,
          karbohidrat: 0,
          lemak: 0,
          bmr: 0,
          tdee: 0
        },
        hariIni: {
          latihan: todayWorkout || null,
          nutrisi: todayNutrition || null
        },
        streak: this.calculateStreak(progress.latihan || [])
      };
    } catch (error) {
      console.error('Error dalam getDashboardSummary:', error);
      return null;
    }
  }

  // Get user stats
  getUserStats(userId) {
    try {
      const user = auth.getUserById(userId);
      if (!user) return null;

      const progress = user.data?.progress || { berat: [], latihan: [] };
      const goals = user.data?.goals || { targetBerat: 0 };
      
      // Berat terakhir atau default
      let beratTerakhir;
      if (progress.berat && progress.berat.length > 0) {
        // Ambil berat terbaru (diurutkan berdasarkan tanggal)
        const sortedBerat = [...progress.berat].sort((a, b) => 
          new Date(b.tanggal) - new Date(a.tanggal)
        );
        beratTerakhir = sortedBerat[0].nilai;
      } else {
        beratTerakhir = user.data?.profil?.berat || 0;
      }

      const targetBerat = goals.targetBerat || user.data?.profil?.berat || 0;
      const progressPercentage = targetBerat > 0 ? 
        ((beratTerakhir / targetBerat) * 100).toFixed(1) : 0;

      return {
        beratTerakhir: beratTerakhir,
        beratAwal: user.data?.profil?.berat || 0,
        targetBerat: targetBerat,
        progress: progressPercentage,
        streak: this.calculateStreak(progress.latihan || []),
        totalLatihan: progress.latihan?.length || 0,
        totalHari: new Set(progress.latihan?.map(l => {
          try {
            return new Date(l.tanggal).toDateString();
          } catch {
            return '';
          }
        }) || []).size
      };
    } catch (error) {
      console.error('Error dalam getUserStats:', error);
      return null;
    }
  }

  // Hitung streak
  calculateStreak(latihanData) {
    try {
      if (!latihanData || latihanData.length === 0) return 0;
      
      // Ambil tanggal unik dan urutkan
      const dates = [...new Set(latihanData.map(l => {
        try {
          return new Date(l.tanggal).toDateString();
        } catch {
          return '';
        }
      }))].filter(date => date !== '')
        .sort((a, b) => new Date(b) - new Date(a));
      
      if (dates.length === 0) return 0;
      
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < dates.length; i++) {
        const workoutDate = new Date(dates[i]);
        workoutDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(currentDate.getDate() - i);
        
        if (workoutDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error dalam calculateStreak:', error);
      return 0;
    }
  }

  // Tambah progress data
  addProgressData(userId, type, data) {
    try {
      const user = auth.getUserById(userId);
      if (!user) {
        console.error('User tidak ditemukan untuk addProgressData');
        return false;
      }

      // Inisialisasi progress jika belum ada
      if (!user.data.progress) {
        user.data.progress = {
          berat: [],
          latihan: [],
          nutrisi: [],
          lingkar: {}
        };
      }

      const timestamp = new Date().toISOString();
      
      switch(type) {
        case 'berat':
          if (!user.data.progress.berat) user.data.progress.berat = [];
          user.data.progress.berat.push({
            tanggal: timestamp,
            nilai: data.nilai,
            catatan: data.catatan || ''
          });
          break;

        case 'latihan':
          if (!user.data.progress.latihan) user.data.progress.latihan = [];
          user.data.progress.latihan.push({
            tanggal: timestamp,
            jenis: data.jenis,
            durasi: data.durasi,
            kalori: data.kalori || 0
          });
          break;

        case 'nutrisi':
          if (!user.data.progress.nutrisi) user.data.progress.nutrisi = [];
          user.data.progress.nutrisi.push({
            tanggal: timestamp,
            kalori: data.kalori || 0,
            protein: data.protein || 0,
            karbohidrat: data.karbo || 0,
            lemak: data.lemak || 0
          });
          break;

        case 'lingkar':
          if (!user.data.progress.lingkar) user.data.progress.lingkar = {};
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (!user.data.progress.lingkar[key]) {
                user.data.progress.lingkar[key] = [];
              }
              user.data.progress.lingkar[key].push({
                tanggal: timestamp,
                nilai: value
              });
            }
          });
          break;
      }

      // Clear cache setelah update
      this.cache.delete(`dashboard_${userId}`);
      
      // Simpan ke localStorage
      const success = auth.updateUserData(userId, user);
      
      // Update current user di auth jika perlu
      if (auth.currentUser && auth.currentUser.id === userId) {
        auth.currentUser = user;
        localStorage.setItem('liftit_current_user', JSON.stringify(user));
      }
      
      return success;
    } catch (error) {
      console.error('Error dalam addProgressData:', error);
      return false;
    }
  }

  // Helper methods yang lebih baik
  addWorkoutSession = (userId, workoutData) => {
    return this.addProgressData(userId, 'latihan', workoutData);
  }

  addNutritionData = (userId, nutritionData) => {
    return this.addProgressData(userId, 'nutrisi', {
      kalori: nutritionData.kalori || 0,
      protein: nutritionData.protein || 0,
      karbo: nutritionData.karbohidrat || nutritionData.karbo || 0,
      lemak: nutritionData.lemak || 0
    });
  }

  addWeightMeasurement = (userId, weight, catatan = '') => {
    return this.addProgressData(userId, 'berat', { 
      nilai: parseFloat(weight), 
      catatan: catatan 
    });
  }

  addBodyMeasurements = (userId, measurements) => {
    return this.addProgressData(userId, 'lingkar', measurements);
  }

  // Update profile
  updateProfile(userId, newProfile) {
    try {
      const user = auth.getUserById(userId);
      if (!user) return false;

      user.data.profil = {
        ...user.data.profil,
        ...newProfile
      };

      // Clear cache
      this.cache.delete(`dashboard_${userId}`);
      
      return auth.updateUserData(userId, user);
    } catch (error) {
      console.error('Error dalam updateProfile:', error);
      return false;
    }
  }

  // Update goals
  updateGoals(userId, newGoals) {
    try {
      const user = auth.getUserById(userId);
      if (!user) return false;

      user.data.goals = {
        ...user.data.goals,
        ...newGoals
      };

      // Clear cache
      this.cache.delete(`dashboard_${userId}`);
      
      return auth.updateUserData(userId, user);
    } catch (error) {
      console.error('Error dalam updateGoals:', error);
      return false;
    }
  }

  // Get recent activities (untuk dashboard)
  getRecentActivities(userId, limit = 10) {
    try {
      const user = auth.getUserById(userId);
      if (!user) return [];

      const progress = user.data?.progress || {};
      const activities = [];

      // Tambahkan latihan terbaru
      const recentWorkouts = progress.latihan?.slice(-5).reverse() || [];
      recentWorkouts.forEach(workout => {
        activities.push({
          type: 'workout',
          value: workout.jenis,
          duration: workout.durasi,
          calories: workout.kalori,
          time: this.formatRelativeTime(workout.tanggal),
          rawTime: workout.tanggal
        });
      });

      // Tambahkan nutrisi terbaru
      const recentNutrition = progress.nutrisi?.slice(-5).reverse() || [];
      recentNutrition.forEach(nutrition => {
        activities.push({
          type: 'nutrition',
          value: `${nutrition.protein}g protein`,
          calories: nutrition.kalori,
          time: this.formatRelativeTime(nutrition.tanggal),
          rawTime: nutrition.tanggal
        });
      });

      // Tambahkan berat terbaru
      const recentWeight = progress.berat?.slice(-3).reverse() || [];
      recentWeight.forEach(weight => {
        activities.push({
          type: 'weight',
          value: `${weight.nilai} kg`,
          note: weight.catatan || 'Pengukuran berat',
          time: this.formatRelativeTime(weight.tanggal),
          rawTime: weight.tanggal
        });
      });

      // Urutkan berdasarkan waktu dan ambil yang terbaru
      return activities
        .sort((a, b) => new Date(b.rawTime) - new Date(a.rawTime))
        .slice(0, limit);
    } catch (error) {
      console.error('Error dalam getRecentActivities:', error);
      return [];
    }
  }

  // Helper untuk format waktu relatif
  formatRelativeTime(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) {
        return 'Baru saja';
      } else if (diffHours < 24) {
        return `${diffHours} jam yang lalu`;
      } else if (diffDays === 1) {
        return 'Kemarin';
      } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
      } else {
        return date.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'short' 
        });
      }
    } catch {
      return 'Waktu tidak diketahui';
    }
  }
}

// Export instance
const userManager = new UserManager();
export default userManager;