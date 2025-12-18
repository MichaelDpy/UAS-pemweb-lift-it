// File: src/pages/Latihan.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Latihan = () => {
  const { user } = useAuth();
  const [currentProgram, setCurrentProgram] = useState('pushpull');
  const [currentDay, setCurrentDay] = useState('push');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // --- DATA PROGRAM LATIHAN (Statis) ---
  const workoutPrograms = {
    pushpull: {
      title: "Push-Pull-Legs (PPL)",
      description: "Program Push-Pull-Legs membagi latihan menjadi tiga kategori: Push (dorong), Pull (tarik), dan Legs (kaki). Optimal untuk perkembangan otot seimbang.",
      days: 6,
      duration: "60-75 menit",
      level: "Intermediate - Advanced",
      schedule: [
        { day: "Senin", type: "push" },
        { day: "Selasa", type: "pull" },
        { day: "Rabu", type: "legs" },
        { day: "Kamis", type: "push" },
        { day: "Jumat", type: "pull" },
        { day: "Sabtu", type: "legs" },
        { day: "Minggu", type: "rest" }
      ],
      workouts: {
        push: {
          title: "Push Day",
          focus: "Dada, Bahu, Triceps",
          duration: 75,
          calories: 450,
          exercises: [
            { id: 1, name: "Bench Press", sets: 4, reps: "8-12", rest: "90s", video: "rT7DgCr-3pg" },
            { id: 2, name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "75s", video: "8iPEnn-ltC8" },
            { id: 3, name: "Shoulder Press", sets: 3, reps: "10-12", rest: "75s", video: "QAQ64hK4Xxs" },
            { id: 4, name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60s", video: "3VcKaXpzqRo" },
            { id: 5, name: "Triceps Pushdown", sets: 3, reps: "12-15", rest: "60s", video: "vB5OHsJ3EME" }
          ]
        },
        pull: {
          title: "Pull Day",
          focus: "Punggung, Biceps",
          duration: 70,
          calories: 420,
          exercises: [
            { id: 6, name: "Pull-ups", sets: 4, reps: "AMRAP", rest: "90s", video: "eGo4IYlbE5g" },
            { id: 7, name: "Barbell Rows", sets: 4, reps: "8-12", rest: "90s", video: "9efgcAjQe7E" },
            { id: 8, name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "75s", video: "CAwf7n6Luuc" },
            { id: 9, name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "75s", video: "GZbfZ033f74" },
            { id: 10, name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60s", video: "kwG2ipFRgfo" }
          ]
        },
        legs: {
          title: "Legs Day",
          focus: "Kaki, Glutes",
          duration: 80,
          calories: 500,
          exercises: [
            { id: 11, name: "Squats", sets: 4, reps: "8-12", rest: "120s", video: "gcNh17Ckjgg" },
            { id: 12, name: "Romanian Deadlifts", sets: 4, reps: "8-12", rest: "90s", video: "JCXUYuzwNrM" },
            { id: 13, name: "Leg Press", sets: 3, reps: "10-12", rest: "75s", video: "IZxyjW7MPJQ" },
            { id: 14, name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60s", video: "YyvSfVjQeL0" },
            { id: 15, name: "Lying Leg Curls", sets: 3, reps: "12-15", rest: "60s", video: "1Tq3QdYUuHs" }
          ]
        }
      }
    },
    upperlower: {
      title: "Upper-Lower Split",
      description: "Program yang membagi latihan menjadi upper body dan lower body, cocok untuk intermediate lifters.",
      days: 4,
      duration: "60-70 menit",
      level: "Intermediate",
      workouts: {
        upper: {
          title: "Upper Body Day",
          focus: "Dada, Punggung, Bahu, Lengan",
          duration: 70,
          calories: 400,
          exercises: [
            { id: 16, name: "Bench Press", sets: 4, reps: "8-12", rest: "90s", video: "rT7DgCr-3pg" },
            { id: 17, name: "Pull-ups", sets: 4, reps: "AMRAP", rest: "90s", video: "eGo4IYlbE5g" },
            { id: 18, name: "Shoulder Press", sets: 3, reps: "10-12", rest: "75s", video: "QAQ64hK4Xxs" },
            { id: 19, name: "Barbell Rows", sets: 3, reps: "10-12", rest: "75s", video: "9efgcAjQe7E" },
            { id: 20, name: "Bicep Curls", sets: 3, reps: "12-15", rest: "60s", video: "kwG2ipFRgfo" }
          ]
        },
        lower: {
          title: "Lower Body Day",
          focus: "Kaki, Glutes",
          duration: 75,
          calories: 450,
          exercises: [
            { id: 11, name: "Squats", sets: 4, reps: "8-12", rest: "120s", video: "gcNh17Ckjgg" },
            { id: 12, name: "Romanian Deadlifts", sets: 4, reps: "8-12", rest: "90s", video: "JCXUYuzwNrM" },
            { id: 13, name: "Leg Press", sets: 3, reps: "10-12", rest: "75s", video: "IZxyjW7MPJQ" },
            { id: 14, name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60s", video: "YyvSfVjQeL0" },
            { id: 15, name: "Lying Leg Curls", sets: 3, reps: "12-15", rest: "60s", video: "1Tq3QdYUuHs" }
          ]
        }
      }
    }
  };

  // --- 1. LOAD HISTORY DARI DATABASE ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          // ✅ UPDATE: Ganti localhost ke URL backend Vercel
          const response = await fetch('https://backend-lift-it.vercel.app/api/workouts', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if(response.ok) {
            const data = await response.json();
            // Mapping format Database -> Frontend
            const formattedData = data.map(item => ({
              id: item.id,
              jenis: item.program_name,
              durasi: item.duration,
              kalori: item.calories,
              tanggal: item.date
            }));
            setWorkoutHistory(formattedData);
          }
        } catch (error) {
          console.error("Gagal load history:", error);
        }
      }
    };
    fetchHistory();
  }, [user]);

  // --- 2. SIMPAN LATIHAN KE DATABASE ---
  const handleCompleteWorkout = async () => {
    if (!user) {
      alert('Silakan login untuk mencatat latihan!');
      return;
    }

    const workout = workoutPrograms[currentProgram].workouts[currentDay];
    const workoutData = {
      program_name: workout.title,
      duration: parseInt(workout.duration),
      calories: parseInt(workout.calories)
    };

    try {
      const token = localStorage.getItem('token');
      // ✅ UPDATE: Ganti localhost ke URL backend Vercel
      const response = await fetch('https://backend-lift-it.vercel.app/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update tampilan history secara langsung
        const newHistoryItem = {
          id: data.id,
          jenis: data.program_name,
          durasi: data.duration,
          kalori: data.calories,
          tanggal: data.date
        };
        setWorkoutHistory([newHistoryItem, ...workoutHistory]);
        alert(`✅ Latihan "${workout.title}" berhasil disimpan!`);
      } else {
        alert('Gagal menyimpan: ' + (data.msg || 'Error server'));
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleStartProgram = () => {
    alert(`Program "${workoutPrograms[currentProgram].title}" telah dimulai! Semangat! 🔥`);
  };

  const handleShowVideo = (exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const calculateStreak = () => {
    if (workoutHistory.length === 0) return 0;
    const dates = [...new Set(workoutHistory.map(w => new Date(w.tanggal).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const workoutDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      if (diffDays === i) streak++;
      else break;
    }
    return streak;
  };

  const currentProgramData = workoutPrograms[currentProgram];
  const currentWorkout = currentProgramData?.workouts[currentDay];

  return (
    <div className="min-h-screen bg-hitam pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <i className="fas fa-dumbbell text-merah mr-3"></i>
            Program Latihan Terstruktur
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Pilih program yang sesuai dengan tujuan dan level Anda.
          </p>
          
          {/* Progress Summary */}
          <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold text-merah">{workoutHistory.length}</div>
                <div className="text-sm text-gray-400">Total Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{calculateStreak()}</div>
                <div className="text-sm text-gray-400">Streak Hari</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {workoutHistory.reduce((sum, w) => sum + (w.durasi || 0), 0)}
                </div>
                <div className="text-sm text-gray-400">Menit Latihan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-0 border-b border-gray-700 mb-8 overflow-x-auto">
          {Object.keys(workoutPrograms).map((programKey) => (
            <button
              key={programKey}
              onClick={() => {
                setCurrentProgram(programKey);
                const workouts = workoutPrograms[programKey].workouts;
                setCurrentDay(Object.keys(workouts)[0]);
              }}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                currentProgram === programKey
                  ? 'border-merah text-merah'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {workoutPrograms[programKey].title}
            </button>
          ))}
        </div>

        {/* Program Description */}
        <div className="kartu p-6 md:p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">{currentProgramData.title}</h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt text-merah mr-2"></i>
                  <span>{currentProgramData.days} hari/minggu</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock text-merah mr-2"></i>
                  <span>{currentProgramData.duration}/sesi</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-fire text-merah mr-2"></i>
                  <span>{currentProgramData.level}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">{currentProgramData.description}</p>
              <button onClick={handleStartProgram} className="tombol-merah px-6 py-3 w-full md:w-auto">
                <i className="fas fa-play mr-2"></i> Mulai Program Ini
              </button>
            </div>
            
            {/* Schedule Sidebar */}
            <div className="md:w-1/3 bg-gray-900 p-4 rounded-xl border border-gray-800">
              <h3 className="font-bold mb-4 text-gray-300">Jadwal Mingguan</h3>
              <div className="space-y-2 text-sm">
                {currentProgramData.schedule?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-gray-800 transition">
                    <span className="text-gray-400">{item.day}</span>
                    <span className={`font-bold uppercase text-xs px-2 py-1 rounded ${
                      item.type === 'push' ? 'bg-red-900/30 text-red-400' :
                      item.type === 'pull' ? 'bg-blue-900/30 text-blue-400' :
                      item.type === 'legs' ? 'bg-green-900/30 text-green-400' :
                      'bg-gray-800 text-gray-500'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workout Details & Actions */}
        {currentWorkout && (
          <div className="mb-10">
            {/* Day Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(currentProgramData.workouts).map((dayKey) => (
                <button
                  key={dayKey}
                  onClick={() => setCurrentDay(dayKey)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    currentDay === dayKey
                      ? 'bg-merah text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {currentProgramData.workouts[dayKey].title}
                </button>
              ))}
            </div>

            <div className="kartu p-6 md:p-8 mb-8 text-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{currentWorkout.title}</h3>
                  <p className="text-gray-400">Fokus: <span className="text-merah">{currentWorkout.focus}</span></p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xl font-bold">{currentWorkout.duration}m</div>
                  <div className="text-sm text-gray-500">Estimasi</div>
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-4">
                {currentWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-500">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold">{exercise.name}</h4>
                        <p className="text-sm text-gray-400">{exercise.sets} Sets × {exercise.reps}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 hidden sm:block">Rest: {exercise.rest}</span>
                      <button 
                        onClick={() => handleShowVideo(exercise)}
                        className="text-merah hover:text-red-400 text-2xl"
                        title="Lihat Video"
                      >
                        <i className="fas fa-play-circle"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Action */}
              <div className="mt-8 text-center pt-6 border-t border-gray-800">
                <button 
                  onClick={handleCompleteWorkout}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-green-900/20 hover:-translate-y-1 transition transform"
                >
                  <i className="fas fa-check-circle mr-2"></i> Tandai Latihan Selesai
                </button>
                <p className="text-gray-500 text-sm mt-3">Klik ini untuk menyimpan progress ke database</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent History */}
        <div className="kartu p-6 text-white">
          <h3 className="font-bold mb-4 text-lg">Riwayat Latihan Terakhir</h3>
          <div className="space-y-3">
            {workoutHistory.length > 0 ? (
              workoutHistory.slice(0, 5).map((workout, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-merah/20 rounded-full flex items-center justify-center text-merah">
                      <i className="fas fa-dumbbell"></i>
                    </div>
                    <div>
                      <div className="font-bold">{workout.jenis}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(workout.tanggal).toLocaleDateString('id-ID', { 
                          weekday: 'long', day: 'numeric', month: 'short' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{workout.durasi} m</div>
                    <div className="text-xs text-gray-500">{workout.kalori} kcal</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                <i className="fas fa-history text-4xl mb-2 opacity-50"></i>
                <p>Belum ada riwayat latihan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Modal */}
        {showVideoModal && selectedExercise && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowVideoModal(false)}>
            <div className="bg-gray-900 w-full max-w-3xl rounded-2xl overflow-hidden border border-gray-700" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{selectedExercise.name}</h3>
                <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe 
                  src={`https://www.youtube.com/embed/${selectedExercise.video}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 text-white">
                <h4 className="font-bold text-merah mb-2">Tips Eksekusi:</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Jaga form tetap sempurna, jangan terburu-buru.</li>
                  <li>Tarik napas saat menurunkan beban, buang napas saat mengangkat.</li>
                  <li>Istirahat {selectedExercise.rest} antar set.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Latihan;
