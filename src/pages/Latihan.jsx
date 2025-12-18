import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userManager from '../utils/userManager';

const Latihan = () => {
  const { user } = useAuth();
  const [currentProgram, setCurrentProgram] = useState('pushpull');
  const [currentDay, setCurrentDay] = useState('push');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Sample workout programs data
  const workoutPrograms = {
    pushpull: {
      title: "Push-Pull-Legs (PPL)",
      description: "Program Push-Pull-Legs membagi latihan menjadi tiga kategori: Push (dorong), Pull (tarik), dan Legs (kaki). Program ini optimal untuk perkembangan otot yang seimbang dan cocok untuk natural lifters.",
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

  // Load workout history
  useEffect(() => {
    if (user) {
      const userData = JSON.parse(localStorage.getItem('liftit_users') || '[]')
        .find(u => u.id === user.id);
      if (userData) {
        setWorkoutHistory(userData.data.progress.latihan || []);
      }
    }
  }, [user]);

  const handleStartProgram = () => {
    alert(`Program "${workoutPrograms[currentProgram].title}" telah dimulai!`);
  };

  const handleCompleteWorkout = () => {
    if (!user) {
      alert('Silakan login untuk mencatat latihan!');
      return;
    }

    const workout = workoutPrograms[currentProgram].workouts[currentDay];
    const workoutData = {
      jenis: workout.title,
      durasi: workout.duration,
      kalori: workout.calories
    };

    userManager.addWorkoutSession(user.id, workoutData);
    
    // Update local state
    const newWorkout = {
      tanggal: new Date().toISOString(),
      ...workoutData
    };
    setWorkoutHistory([...workoutHistory, newWorkout]);
    
    alert(`Latihan "${workout.title}" selesai!`);
  };

  const handleShowVideo = (exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const calculateStreak = () => {
    if (workoutHistory.length === 0) return 0;
    
    const dates = [...new Set(workoutHistory.map(w => 
      new Date(w.tanggal).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const workoutDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentProgramData = workoutPrograms[currentProgram];
  const currentWorkout = currentProgramData?.workouts[currentDay];

  return (
    <div className="min-h-screen bg-hitam pt-6 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <i className="fas fa-dumbbell text-merah mr-3"></i>
            Program Latihan Terstruktur
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Pilih program yang sesuai dengan tujuan dan level Anda. Dilengkapi dengan video panduan.
          </p>
          
          {/* Progress Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-6">
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
        <div className="flex flex-wrap gap-2 md:gap-0 border-b border-abu-border mb-8 overflow-x-auto">
          {Object.keys(workoutPrograms).map((programKey) => (
            <button
              key={programKey}
              onClick={() => {
                setCurrentProgram(programKey);
                const workouts = workoutPrograms[programKey].workouts;
                setCurrentDay(Object.keys(workouts)[0]);
              }}
              className={`px-4 py-3 font-medium border-b-2 ${
                currentProgram === programKey
                  ? 'border-merah text-merah'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {programKey === 'pushpull' && <><i className="fas fa-sync-alt mr-2"></i> Push-Pull-Legs</>}
              {programKey === 'upperlower' && <><i className="fas fa-exchange-alt mr-2"></i> Upper-Lower</>}
            </button>
          ))}
        </div>

        {/* Program Description */}
        <div className="kartu p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Program Info */}
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
              
              <button 
                onClick={handleStartProgram}
                className="tombol-merah px-6 md:px-8 py-3 w-full md:w-auto"
              >
                <i className="fas fa-play mr-2"></i> Mulai Program Ini
              </button>
            </div>
            
            {/* Schedule */}
            <div className="md:w-1/3">
              <h3 className="font-bold mb-4 text-gray-300">Jadwal Mingguan</h3>
              <div className="space-y-2">
                {currentProgramData.schedule?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="font-medium">{item.day}</span>
                    <span className={`font-bold ${
                      item.type === 'push' ? 'text-merah' :
                      item.type === 'pull' ? 'text-blue-400' :
                      item.type === 'legs' ? 'text-green-400' :
                      'text-gray-400'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                )) || (
                  <div className="text-center p-4 text-gray-500">
                    <p>Tidak ada jadwal tersedia</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workout Days */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Detail Latihan per Hari</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Status</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          {/* Day Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
            {currentProgramData.workouts && Object.keys(currentProgramData.workouts).map((dayKey) => (
              <button
                key={dayKey}
                onClick={() => setCurrentDay(dayKey)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentDay === dayKey
                    ? 'bg-merah text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {currentProgramData.workouts[dayKey].title}
              </button>
            ))}
          </div>
          
          {/* Workout Content */}
          {currentWorkout && (
            <div className="kartu p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{currentWorkout.title}</h3>
                  <p className="text-gray-400">
                    Fokus: <span className="text-merah font-medium">{currentWorkout.focus}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold">{currentWorkout.exercises.length}</div>
                    <div className="text-sm text-gray-400">Gerakan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold">
                      {currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Set</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold">{currentWorkout.duration}m</div>
                    <div className="text-sm text-gray-400">Estimasi Waktu</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {currentWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-merah/20 rounded-lg flex items-center justify-center mr-4">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base md:text-lg">{exercise.name}</h4>
                        <p className="text-sm text-gray-400">{exercise.sets} set × {exercise.reps} reps</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <span className="text-gray-400 text-sm md:text-base">Rest: {exercise.rest}</span>
                      <button 
                        onClick={() => handleShowVideo(exercise)}
                        className="text-merah hover:text-red-400 text-lg"
                        title="Lihat video"
                      >
                        <i className="fas fa-play-circle"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-bold mb-4 text-gray-300">Tips Latihan</h4>
                <ul className="space-y-2 text-sm md:text-base text-gray-300">
                  <li><i className="fas fa-check text-merah mr-2"></i> Fokus pada form yang benar daripada beban berat</li>
                  <li><i className="fas fa-check text-merah mr-2"></i> Istirahat sesuai waktu yang direkomendasikan</li>
                  <li><i className="fas fa-check text-merah mr-2"></i> Catat beban yang digunakan untuk progressive overload</li>
                  <li><i className="fas fa-check text-merah mr-2"></i> Lakukan pemanasan 5-10 menit sebelum latihan</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Complete Button */}
          <div className="text-center">
            <button 
              onClick={handleCompleteWorkout}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              <i className="fas fa-check-circle mr-2"></i> Tandai Latihan Ini Selesai
            </button>
            <p className="text-gray-400 text-sm mt-2">Klik untuk mencatat latihan hari ini selesai</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="kartu p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Progress Latihan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="text-3xl font-bold text-merah mb-2">{workoutHistory.length}</div>
              <div className="text-gray-400">Total Selesai</div>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="text-3xl font-bold text-blue-400 mb-2">{calculateStreak()}</div>
              <div className="text-gray-400">Streak Hari</div>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {workoutHistory.reduce((sum, w) => sum + (w.durasi || 0), 0)}
              </div>
              <div className="text-gray-400">Menit Latihan</div>
            </div>
          </div>
          
          {/* Recent Workouts */}
          <div>
            <h3 className="font-bold mb-4 text-gray-300">Latihan Terakhir</h3>
            <div className="space-y-3">
              {workoutHistory.slice(-3).reverse().map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-merah/20 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-dumbbell text-merah"></i>
                    </div>
                    <div>
                      <div className="font-medium">{workout.jenis}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(workout.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{workout.durasi} menit</div>
                    <div className="text-xs text-gray-400">{workout.kalori} kcal</div>
                  </div>
                </div>
              ))}
              {workoutHistory.length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  <i className="fas fa-dumbbell text-2xl mb-2"></i>
                  <p>Belum ada catatan latihan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideoModal && selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="kartu max-w-2xl w-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold">{selectedExercise.name}</h2>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe 
                    src={`https://www.youtube.com/embed/${selectedExercise.video}`}
                    className="w-full h-64 md:h-80 rounded-lg"
                    title={selectedExercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-2 text-gray-300">Tips Eksekusi</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li><i className="fas fa-check text-merah mr-2"></i> Kontraksi otot target dengan maksimal</li>
                      <li><i className="fas fa-check text-merah mr-2"></i> Kontrol gerakan naik dan turun</li>
                      <li><i className="fas fa-check text-merah mr-2"></i> Jaga postur tubuh yang benar</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-300">Kesalahan Umum</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li><i className="fas fa-times text-red-400 mr-2"></i> Menggunakan momentum berlebihan</li>
                      <li><i className="fas fa-times text-red-400 mr-2"></i> Range of motion tidak lengkap</li>
                      <li><i className="fas fa-times text-red-400 mr-2"></i> Beban terlalu berat untuk form yang baik</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Latihan;