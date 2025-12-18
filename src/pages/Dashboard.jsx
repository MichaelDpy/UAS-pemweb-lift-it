import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import userManager from '../utils/userManager';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const { user, refreshUserData } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickData, setQuickData] = useState({
    weight: '',
    arm: '',
    chest: '',
    thigh: ''
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartsInitialized, setChartsInitialized] = useState(false);

  // Chart refs
  const weightChartRef = useRef(null);
  const proteinChartRef = useRef(null);
  const weightChartInstance = useRef(null);
  const proteinChartInstance = useRef(null);
  const chartsContainerRef = useRef(null);

  // Initialize charts function - dibuat dengan useCallback
  const initializeCharts = useCallback(() => {
    console.log('=== INITIALIZING CHARTS ===');
    
    // Cleanup existing charts
    if (weightChartInstance.current) {
      console.log('Destroying existing weight chart');
      weightChartInstance.current.destroy();
      weightChartInstance.current = null;
    }
    
    if (proteinChartInstance.current) {
      console.log('Destroying existing protein chart');
      proteinChartInstance.current.destroy();
      proteinChartInstance.current = null;
    }

    // Initialize Weight Chart
    if (weightChartRef.current && dashboardData) {
      console.log('Creating weight chart');
      
      try {
        const ctx = weightChartRef.current.getContext('2d');
        const weightData = generateWeightData(30);
        
        weightChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: weightData.labels,
            datasets: [{
              label: 'Berat Badan (kg)',
              data: weightData.data,
              borderColor: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#dc2626',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5
            }]
          },
          options: getChartOptions('Berat (kg)', 'line')
        });
        
        console.log('Weight chart created successfully');
      } catch (error) {
        console.error('Error creating weight chart:', error);
      }
    } else {
      console.log('Weight chart ref not available or no data');
    }

    // Initialize Protein Chart
    if (proteinChartRef.current && dashboardData) {
      console.log('Creating protein chart');
      
      try {
        const ctx = proteinChartRef.current.getContext('2d');
        const proteinData = generateProteinData(14);
        
        proteinChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: proteinData.labels,
            datasets: [{
              label: 'Protein (g)',
              data: proteinData.data,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: '#2563eb',
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
              hoverBackgroundColor: '#1d4ed8'
            }]
          },
          options: getChartOptions('Protein (g)', 'bar')
        });
        
        console.log('Protein chart created successfully');
      } catch (error) {
        console.error('Error creating protein chart:', error);
      }
    } else {
      console.log('Protein chart ref not available or no data');
    }
    
    setChartsInitialized(true);
  }, [dashboardData]);

  // Chart options helper
  const getChartOptions = (yAxisLabel, type) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#d1d5db',
          font: { size: 12, family: 'system-ui' },
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
        titleFont: { size: 13, weight: 'normal' },
        bodyFont: { size: 12 },
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: type === 'bar',
        grid: { 
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false
        },
        border: { display: false },
        ticks: { 
          color: '#9ca3af', 
          font: { size: 11 },
          padding: 8
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: '#9ca3af',
          font: { size: 12, weight: 'bold' },
          padding: { top: 10, bottom: 10 }
        }
      },
      x: {
        grid: { 
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false
        },
        border: { display: false },
        ticks: { 
          color: '#9ca3af', 
          font: { size: 11 },
          maxRotation: 0,
          padding: 8
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 0 // Disable animation to prevent flickering
    },
    elements: {
      line: {
        tension: 0.3
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 10
      }
    }
  });

  // Load dashboard data
  const loadDashboardData = useCallback(() => {
    if (!user?.id) return;
    
    console.log('=== LOADING DASHBOARD DATA ===');
    setLoading(true);
    
    try {
      const summary = userManager.getDashboardSummary(user.id);
      console.log('Dashboard summary:', summary);
      setDashboardData(summary);
      
      const activities = userManager.getRecentActivities(user.id, 10);
      setRecentActivities(activities);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  }, [user]);

  // Effect untuk load data
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Effect untuk initialize charts setelah data tersedia
  useEffect(() => {
    if (dashboardData && !chartsInitialized && !loading) {
      console.log('Data ready, initializing charts...');
      
      // Delay sedikit untuk memastikan DOM sudah siap
      const timer = setTimeout(() => {
        initializeCharts();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dashboardData, chartsInitialized, loading, initializeCharts]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log('=== CLEANING UP CHARTS ===');
      if (weightChartInstance.current) {
        weightChartInstance.current.destroy();
        weightChartInstance.current = null;
      }
      if (proteinChartInstance.current) {
        proteinChartInstance.current.destroy();
        proteinChartInstance.current = null;
      }
    };
  }, []);

  const generateWeightData = (days = 30) => {
    const labels = [];
    const data = [];
    
    // Generate dummy data jika tidak ada data asli
    const currentWeight = dashboardData?.stats?.beratTerakhir || 72.5;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
      
      // Create a realistic trend
      const trend = Math.sin(i * 0.2) * 1.5;
      const random = (Math.random() - 0.5) * 0.8;
      data.push(parseFloat((currentWeight + trend + random).toFixed(1)));
    }
    
    console.log('Generated weight data:', { labels, data });
    return { labels, data };
  };

  const generateProteinData = (days = 14) => {
    const labels = [];
    const data = [];
    
    const targetProtein = dashboardData?.macros?.protein || 150;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
      
      // Create realistic protein intake pattern
      const dayOfWeek = date.getDay();
      let base = targetProtein;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        base = targetProtein * 0.9; // Weekend mungkin lebih rendah
      }
      
      const random = (Math.random() - 0.5) * 40;
      data.push(Math.max(30, Math.round(base + random)));
    }
    
    console.log('Generated protein data:', { labels, data });
    return { labels, data };
  };

  const updateChartRange = (chartType, days) => {
    console.log(`Updating ${chartType} chart for ${days} days`);
    
    if (chartType === 'weight' && weightChartInstance.current) {
      const newData = generateWeightData(days);
      weightChartInstance.current.data.labels = newData.labels;
      weightChartInstance.current.data.datasets[0].data = newData.data;
      weightChartInstance.current.update('none');
    } else if (chartType === 'protein' && proteinChartInstance.current) {
      const newData = generateProteinData(days);
      proteinChartInstance.current.data.labels = newData.labels;
      proteinChartInstance.current.data.datasets[0].data = newData.data;
      proteinChartInstance.current.update('none');
    }
  };

  const refreshCharts = () => {
    console.log('Refreshing charts...');
    setChartsInitialized(false);
    
    // Destroy existing charts
    if (weightChartInstance.current) {
      weightChartInstance.current.destroy();
      weightChartInstance.current = null;
    }
    if (proteinChartInstance.current) {
      proteinChartInstance.current.destroy();
      proteinChartInstance.current = null;
    }
    
    // Reinitialize after a short delay
    setTimeout(() => {
      initializeCharts();
    }, 50);
  };

  // ... (fungsi saveTodayProgress, quickAdd tetap sama seperti sebelumnya) ...

  const saveTodayProgress = async () => {
    if (!user) {
      alert('User tidak ditemukan');
      return;
    }

    let hasChanges = false;

    // Save weight
    if (quickData.weight && quickData.weight !== '') {
      try {
        const success = userManager.addWeightMeasurement(
          user.id,
          parseFloat(quickData.weight),
          'Input manual dari dashboard'
        );
        if (success) hasChanges = true;
      } catch (error) {
        console.error('Error saving weight:', error);
      }
    }

    // Save body measurements
    const measurements = {};
    if (quickData.arm && quickData.arm !== '') measurements.lengan = parseFloat(quickData.arm);
    if (quickData.chest && quickData.chest !== '') measurements.dada = parseFloat(quickData.chest);
    if (quickData.thigh && quickData.thigh !== '') measurements.paha = parseFloat(quickData.thigh);

    if (Object.keys(measurements).length > 0) {
      try {
        const success = userManager.addBodyMeasurements(user.id, measurements);
        if (success) hasChanges = true;
      } catch (error) {
        console.error('Error saving measurements:', error);
      }
    }

    if (hasChanges) {
      alert('Progress berhasil disimpan!');
      
      setQuickData({ weight: '', arm: '', chest: '', thigh: '' });
      await refreshUserData?.();
      loadDashboardData();
      refreshCharts();
    } else {
      alert('Tidak ada data yang disimpan.');
    }
  };

  const quickAdd = async (type) => {
    if (!user) {
      alert('User tidak ditemukan');
      return;
    }

    if (type === 'workout') {
      const workoutType = prompt('Jenis latihan (contoh: Push Day, Cardio):');
      if (workoutType) {
        const durationInput = prompt('Durasi (menit):');
        if (durationInput) {
          const duration = parseInt(durationInput);
          if (!isNaN(duration) && duration > 0) {
            try {
              const success = userManager.addWorkoutSession(user.id, {
                jenis: workoutType,
                durasi: duration,
                kalori: Math.round(duration * 8)
              });
              
              if (success) {
                alert('Latihan berhasil dicatat!');
                await refreshUserData?.();
                loadDashboardData();
                refreshCharts();
              }
            } catch (error) {
              console.error('Error saving workout:', error);
            }
          }
        }
      }
    } else if (type === 'nutrition') {
      const proteinInput = prompt('Protein (gram):');
      if (proteinInput) {
        const protein = parseFloat(proteinInput);
        if (!isNaN(protein) && protein >= 0) {
          const caloriesInput = prompt('Total kalori (kosongkan untuk estimasi):');
          let calories = 0;
          
          if (caloriesInput && caloriesInput !== '') {
            calories = parseFloat(caloriesInput);
          } else {
            calories = Math.round(protein * 4 + 500);
          }
          
          try {
            const success = userManager.addNutritionData(user.id, {
              protein: protein,
              kalori: calories || 0
            });
            
            if (success) {
              alert('Nutrisi berhasil dicatat!');
              await refreshUserData?.();
              loadDashboardData();
              refreshCharts();
            }
          } catch (error) {
            console.error('Error saving nutrition:', error);
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hitam">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-merah border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hitam">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i>
          <p className="text-gray-400">Tidak dapat memuat data dashboard</p>
          <button 
            onClick={loadDashboardData}
            className="tombol-merah mt-4"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hitam pt-6 pb-12 px-4" ref={chartsContainerRef}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Progress</h1>
              <p className="text-gray-400">
                Selamat datang, {dashboardData.user.nama || 'User'}!
              </p>
            </div>
            <button 
              onClick={refreshCharts}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              title="Refresh charts"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh Charts
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="kartu p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Berat Badan</p>
                <p className="text-2xl font-bold">{dashboardData.stats.beratTerakhir} kg</p>
              </div>
              <div className="text-merah">
                <i className="fas fa-weight text-2xl"></i>
              </div>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-merah to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(dashboardData.stats.progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Target: {dashboardData.stats.targetBerat} kg
            </p>
          </div>

          <div className="kartu p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Protein Hari Ini</p>
                <p className="text-2xl font-bold">
                  {dashboardData.hariIni.nutrisi?.protein || 0} g
                </p>
              </div>
              <div className="text-blue-400">
                <i className="fas fa-utensils text-2xl"></i>
              </div>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(
                    ((dashboardData.hariIni.nutrisi?.protein || 0) / (dashboardData.macros.protein || 1)) * 100, 
                    100
                  )}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Target: {dashboardData.macros.protein || 0} g/hari
            </p>
          </div>

          <div className="kartu p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Streak Latihan</p>
                <p className="text-2xl font-bold">{dashboardData.stats.streak} hari</p>
              </div>
              <div className="text-yellow-400">
                <i className="fas fa-fire text-2xl"></i>
              </div>
            </div>
            <p className={`text-sm ${dashboardData.stats.streak > 0 ? 'text-green-400' : 'text-gray-400'}`}>
              {dashboardData.stats.streak > 0 ? `Konsisten ${dashboardData.stats.streak} hari!` : 'Mulai streak Anda!'}
            </p>
          </div>

          <div className="kartu p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Progress Total</p>
                <p className="text-2xl font-bold">{dashboardData.stats.progress}%</p>
              </div>
              <div className="text-purple-400">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(dashboardData.stats.progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Menuju target berat</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weight Chart */}
          <div className="kartu p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Perkembangan Berat Badan</h3>
              <div className="flex items-center space-x-2">
                <select 
                  onChange={(e) => updateChartRange('weight', parseInt(e.target.value))}
                  className="bg-white-800 border border-gray-700 text-black rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-merah text-sm"
                  defaultValue="30"
                >
                  <option value="7">7 Hari</option>
                  <option value="30">30 Hari</option>
                  <option value="90">90 Hari</option>
                </select>
              </div>
            </div>
            <div className="h-64 relative">
              <canvas 
                ref={weightChartRef} 
                id="weightChart"
                className="chart-canvas"
              />
              {!chartsInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-merah border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
                    <p className="text-gray-400 text-sm">Memuat chart...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <i className="fas fa-info-circle mr-2"></i>
              Trend berat badan dalam 30 hari terakhir
            </div>
          </div>

          {/* Protein Chart */}
          <div className="kartu p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Konsumsi Protein Harian</h3>
              <div className="flex items-center space-x-2">
                <select 
                  onChange={(e) => updateChartRange('protein', parseInt(e.target.value))}
                  className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-merah text-sm"
                  defaultValue="14"
                >
                  <option value="7">7 Hari</option>
                  <option value="14">14 Hari</option>
                  <option value="30">30 Hari</option>
                </select>
              </div>
            </div>
            <div className="h-64 relative">
              <canvas 
                ref={proteinChartRef}
                id="proteinChart"
                className="chart-canvas"
              />
              {!chartsInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
                    <p className="text-gray-400 text-sm">Memuat chart...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <i className="fas fa-info-circle mr-2"></i>
              Target protein harian: {dashboardData.macros.protein || 0}g
            </div>
          </div>
        </div>

        {/* Quick Input */}
        <div className="kartu mb-8">
          <h3 className="text-xl font-bold mb-6">Catat Progress Hari Ini</h3>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Berat Badan (kg)</label>
              <input
                type="number"
                value={quickData.weight}
                onChange={(e) => setQuickData({...quickData, weight: e.target.value})}
                step="0.1"
                className="input-custom w-full"
                placeholder="72.5"
                min="30"
                max="200"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">Lengan (cm)</label>
              <input
                type="number"
                value={quickData.arm}
                onChange={(e) => setQuickData({...quickData, arm: e.target.value})}
                step="0.1"
                className="input-custom w-full"
                placeholder="38.5"
                min="10"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">Dada (cm)</label>
              <input
                type="number"
                value={quickData.chest}
                onChange={(e) => setQuickData({...quickData, chest: e.target.value})}
                step="0.1"
                className="input-custom w-full"
                placeholder="105"
                min="50"
                max="150"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">Paha (cm)</label>
              <input
                type="number"
                value={quickData.thigh}
                onChange={(e) => setQuickData({...quickData, thigh: e.target.value})}
                step="0.1"
                className="input-custom w-full"
                placeholder="62"
                min="30"
                max="100"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => quickAdd('workout')}
                className="tombol-merah"
              >
                <i className="fas fa-dumbbell mr-2"></i> Tambah Latihan
              </button>
              <button 
                onClick={() => quickAdd('nutrition')}
                className="tombol-merah"
              >
                <i className="fas fa-utensils mr-2"></i> Catat Makanan
              </button>
            </div>
            <button 
              onClick={saveTodayProgress}
              className="tombol-merah px-6 py-3"
              disabled={!quickData.weight && !quickData.arm && !quickData.chest && !quickData.thigh}
            >
              <i className="fas fa-save mr-2"></i> Simpan Semua
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="kartu">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Aktivitas Terbaru</h3>
            <button 
              onClick={loadDashboardData}
              className="text-sm text-gray-400 hover:text-white flex items-center"
            >
              <i className="fas fa-sync mr-1"></i> Refresh
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      activity.type === 'workout' ? 'bg-blue-900/30' :
                      activity.type === 'nutrition' ? 'bg-green-900/30' :
                      'bg-red-900/30'
                    }`}>
                      <i className={`fas ${
                        activity.type === 'workout' ? 'fa-dumbbell text-blue-400' :
                        activity.type === 'nutrition' ? 'fa-utensils text-green-400' :
                        'fa-weight text-red-400'
                      }`}></i>
                    </div>
                    <div>
                      <p className="font-medium">
                        {activity.type === 'workout' ? activity.value :
                         activity.type === 'nutrition' ? `Konsumsi: ${activity.value}` :
                         `Berat: ${activity.value}`}
                      </p>
                      <p className="text-sm text-gray-400">
                        {activity.type === 'workout' && `${activity.duration} menit • ${activity.calories} kalori`}
                        {activity.type === 'nutrition' && `${activity.calories} kalori`}
                        {activity.type === 'weight' && activity.note}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-500">
                <i className="fas fa-calendar-day text-2xl mb-2"></i>
                <p>Belum ada aktivitas tercatat</p>
                <p className="text-sm mt-2">Coba tambahkan latihan atau catat makanan!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;