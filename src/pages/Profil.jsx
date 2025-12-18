import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userManager from '../utils/userManager';
import { formatTanggal } from '../utils/main';

const Profil = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [formData, setFormData] = useState({
    nama: '',
    jenisKelamin: 'pria',
    usia: '',
    berat: '',
    tinggi: '',
    aktivitas: '1.375',
    tujuan: 'bulking',
    targetBerat: '',
    targetProtein: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/masuk');
      return;
    }

    // Load user data into form
    setFormData({
      nama: user.nama || '',
      jenisKelamin: user.data.profil.jenisKelamin || 'pria',
      usia: user.data.profil.usia || '',
      berat: user.data.profil.berat || '',
      tinggi: user.data.profil.tinggi || '',
      aktivitas: user.data.profil.aktivitas || '1.375',
      tujuan: user.data.profil.tujuan || 'bulking',
      targetBerat: user.data.goals.targetBerat || '',
      targetProtein: user.data.goals.targetProtein || ''
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = {
        ...user,
        nama: formData.nama,
        data: {
          ...user.data,
          profil: {
            ...user.data.profil,
            jenisKelamin: formData.jenisKelamin,
            usia: parseInt(formData.usia),
            berat: parseFloat(formData.berat),
            tinggi: parseFloat(formData.tinggi),
            aktivitas: parseFloat(formData.aktivitas),
            tujuan: formData.tujuan
          }
        }
      };

      const success = updateUser(user.id, updatedUser);
      
      if (success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoals = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = {
        ...user,
        data: {
          ...user.data,
          profil: {
            ...user.data.profil,
            tujuan: formData.tujuan
          },
          goals: {
            ...user.data.goals,
            targetBerat: parseFloat(formData.targetBerat),
            targetProtein: parseInt(formData.targetProtein)
          }
        }
      };

      const success = updateUser(user.id, updatedUser);
      
      if (success) {
        setMessage({ type: 'success', text: 'Tujuan berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal memperbarui tujuan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    // Implement password change logic
    alert('Fitur ubah password akan segera hadir!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
      // Implement account deletion logic
      logout();
      navigate('/');
    }
  };

  const calculateMacros = () => {
    if (!user) return null;
    return userManager.calculateUserMacros(user.id);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-merah mb-4"></i>
          <p className="text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  const macros = calculateMacros();

  return (
    <div className="min-h-screen bg-hitam pt-6 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil & Pengaturan</h1>
          <p className="text-gray-400">Kelola data pribadi, tujuan fitness, dan pengaturan akun</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-abu-border mb-8 overflow-x-auto">
          {['profil', 'tujuan', 'pengaturan', 'keamanan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-merah text-merah'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'profil' && <><i className="fas fa-user mr-2"></i> Data Profil</>}
              {tab === 'tujuan' && <><i className="fas fa-bullseye mr-2"></i> Tujuan Fitness</>}
              {tab === 'pengaturan' && <><i className="fas fa-cog mr-2"></i> Pengaturan</>}
              {tab === 'keamanan' && <><i className="fas fa-shield-alt mr-2"></i> Keamanan</>}
            </button>
          ))}
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' :
            'bg-red-900/30 border border-red-800 text-red-300'
          }`}>
            <i className={`fas ${
              message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
            } mr-2`}></i>
            {message.text}
          </div>
        )}

        {/* Tab Content */}
        <div>
          {/* Tab 1: Profil */}
          {activeTab === 'profil' && (
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Informasi Dasar</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="input-custom w-full bg-gray-800"
                      disabled
                    />
                    <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah</p>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Tanggal Bergabung</label>
                    <input
                      type="text"
                      value={formatTanggal(user.tanggalDaftar)}
                      className="input-custom w-full bg-gray-800"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Member ID</label>
                    <input
                      type="text"
                      value={user.id.substring(0, 8)}
                      className="input-custom w-full bg-gray-800"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Physical Data */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Data Fisik</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
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
                      min="15"
                      max="80"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="berat"
                      value={formData.berat}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                      step="0.1"
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
                    />
                  </div>
                  <div>
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
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="tombol-merah px-8 py-3 flex items-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Goals */}
          {activeTab === 'tujuan' && (
            <div className="space-y-8">
              {/* Fitness Goals */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Tujuan Fitness</h3>
                
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
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Target Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="targetBerat"
                      value={formData.targetBerat}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-400 mt-1">Berat yang ingin dicapai</p>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Target Protein Harian (g)</label>
                    <input
                      type="number"
                      name="targetProtein"
                      value={formData.targetProtein}
                      onChange={handleInputChange}
                      className="input-custom w-full"
                    />
                    <p className="text-xs text-gray-400 mt-1">Rekomendasi: 1.6-2g per kg berat</p>
                  </div>
                </div>
              </div>

              {/* Macro Recommendations */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Rekomendasi Kebutuhan Harian</h3>
                
                {macros ? (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-merah">{macros.kalori}</div>
                      <div className="text-sm text-gray-400">Kalori/hari</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{macros.protein}g</div>
                      <div className="text-sm text-gray-400">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{macros.karbohidrat}g</div>
                      <div className="text-sm text-gray-400">Karbohidrat</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{macros.lemak}g</div>
                      <div className="text-sm text-gray-400">Lemak</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    <p>Tidak dapat menghitung rekomendasi</p>
                  </div>
                )}
                
                <div className="mt-6">
                  <button 
                    onClick={() => window.location.href = '/kalkulator'}
                    className="tombol-merah px-6 py-3"
                  >
                    <i className="fas fa-calculator mr-2"></i> Kalkulator Lengkap
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveGoals}
                  disabled={loading}
                  className="tombol-merah px-8 py-3 flex items-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Simpan Tujuan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Settings */}
          {activeTab === 'pengaturan' && (
            <div className="space-y-8">
              {/* Display Settings */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Pengaturan Tampilan</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Mode Tema</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="theme" 
                          value="dark" 
                          className="mr-2 text-merah" 
                          defaultChecked 
                        />
                        <span className="text-gray-300">Gelap</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="theme" 
                          value="light" 
                          className="mr-2 text-merah" 
                        />
                        <span className="text-gray-300">Terang</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Satuan Pengukuran</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="units" 
                          value="metric" 
                          className="mr-2 text-merah" 
                          defaultChecked 
                        />
                        <span className="text-gray-300">Metrik (kg, cm)</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="units" 
                          value="imperial" 
                          className="mr-2 text-merah" 
                        />
                        <span className="text-gray-300">Imperial (lbs, inch)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Pengaturan Notifikasi</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifikasi Email</p>
                      <p className="text-sm text-gray-400">Update progress dan tips fitness</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked 
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-merah"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pengingat Latihan</p>
                      <p className="text-sm text-gray-400">Pengingat jadwal latihan</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked 
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-merah"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="tombol-merah px-8 py-3">
                  <i className="fas fa-save mr-2"></i> Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Security */}
          {activeTab === 'keamanan' && (
            <div className="space-y-8">
              {/* Change Password */}
              <div className="kartu p-6">
                <h3 className="text-xl font-bold mb-6">Ubah Password</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Password Saat Ini</label>
                    <input
                      type="password"
                      className="input-custom w-full"
                      placeholder="Masukkan password saat ini"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Password Baru</label>
                    <input
                      type="password"
                      className="input-custom w-full"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      className="input-custom w-full"
                      placeholder="Ulangi password baru"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={handleChangePassword}
                      className="tombol-merah px-8 py-3"
                    >
                      <i className="fas fa-key mr-2"></i> Ubah Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="kartu p-6 border border-red-900/50">
                <h3 className="text-xl font-bold mb-4 text-red-400">Zona Berbahaya</h3>
                <p className="text-gray-400 mb-4">Hapus akun Anda secara permanen. Aksi ini tidak dapat dibatalkan.</p>
                <button
                  onClick={handleDeleteAccount}
                  className="px-6 py-3 bg-red-900/30 text-red-400 border border-red-800 rounded-lg hover:bg-red-900/50"
                >
                  <i className="fas fa-trash mr-2"></i> Hapus Akun Saya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;