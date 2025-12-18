export const programs = {
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
          { name: "Bench Press", sets: 4, reps: "8-12", rest: "90s", video: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
          { name: "Shoulder Press", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=QAQ64hK4Xxs" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=3VcKaXpzqRo" },
          { name: "Triceps Pushdown", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=vB5OHsJ3EME" },
          { name: "Overhead Triceps Extension", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=-Vyt2QdsR7E" }
        ]
      },
      pull: {
        title: "Pull Day",
        focus: "Punggung, Biceps",
        duration: 70,
        calories: 420,
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "AMRAP", rest: "90s", video: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
          { name: "Barbell Rows", sets: 4, reps: "8-12", rest: "90s", video: "https://www.youtube.com/watch?v=9efgcAjQe7E" },
          { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=CAwf7n6Luuc" },
          { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=GZbfZ033f74" },
          { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60s", video: "https://www.youtube.com/watch?v=kwG2ipFRgfo" },
          { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=TwD-YGVP4Bk" }
        ]
      },
      legs: {
        title: "Legs Day",
        focus: "Kaki, Glutes",
        duration: 80,
        calories: 500,
        exercises: [
          { name: "Squats", sets: 4, reps: "8-12", rest: "120s", video: "https://www.youtube.com/watch?v=gcNh17Ckjgg" },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-12", rest: "90s", video: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" },
          { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=YyvSfVjQeL0" },
          { name: "Lying Leg Curls", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=1Tq3QdYUuHs" },
          { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60s", video: "https://www.youtube.com/watch?v=-M4-G8p8fmc" }
        ]
      },
      rest: {
        title: "Rest Day",
        focus: "Recovery",
        duration: 30,
        calories: 150,
        exercises: [
          { name: "Light Cardio", sets: 1, reps: "20-30 min", rest: "-", video: "" },
          { name: "Stretching", sets: 1, reps: "10-15 min", rest: "-", video: "" },
          { name: "Foam Rolling", sets: 1, reps: "10 min", rest: "-", video: "" }
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
    schedule: [
      { day: "Senin", type: "upper" },
      { day: "Selasa", type: "lower" },
      { day: "Rabu", type: "rest" },
      { day: "Kamis", type: "upper" },
      { day: "Jumat", type: "lower" },
      { day: "Sabtu", type: "rest" },
      { day: "Minggu", type: "rest" }
    ],
    workouts: {
      upper: {
        title: "Upper Body Day",
        focus: "Dada, Punggung, Bahu, Lengan",
        duration: 70,
        calories: 400,
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-12", rest: "90s", video: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
          { name: "Pull-ups", sets: 4, reps: "AMRAP", rest: "90s", video: "https://www.youtube.com/watch?v=eGo4IYlbE5g" },
          { name: "Shoulder Press", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=QAQ64hK4Xxs" },
          { name: "Barbell Rows", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=9efgcAjQe7E" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=kwG2ipFRgfo" },
          { name: "Triceps Pushdown", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=vB5OHsJ3EME" }
        ]
      },
      lower: {
        title: "Lower Body Day",
        focus: "Kaki, Glutes",
        duration: 75,
        calories: 450,
        exercises: [
          { name: "Squats", sets: 4, reps: "8-12", rest: "120s", video: "https://www.youtube.com/watch?v=gcNh17Ckjgg" },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-12", rest: "90s", video: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=IZxyjW7MPJQ" },
          { name: "Leg Curls", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=1Tq3QdYUuHs" },
          { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=YyvSfVjQeL0" },
          { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60s", video: "https://www.youtube.com/watch?v=-M4-G8p8fmc" }
        ]
      }
    }
  },
  fullbody: {
    title: "Full Body Workout",
    description: "Program full body yang melatih semua kelompok otot dalam satu sesi. Cocok untuk pemula atau mereka yang memiliki waktu terbatas.",
    days: 3,
    duration: "45-60 menit",
    level: "Beginner - Intermediate",
    schedule: [
      { day: "Senin", type: "fullbody" },
      { day: "Selasa", type: "rest" },
      { day: "Rabu", type: "fullbody" },
      { day: "Kamis", type: "rest" },
      { day: "Jumat", type: "fullbody" },
      { day: "Sabtu", type: "rest" },
      { day: "Minggu", type: "rest" }
    ],
    workouts: {
      fullbody: {
        title: "Full Body Workout",
        focus: "Seluruh Tubuh - Dada, Punggung, Kaki, Bahu",
        duration: 60,
        calories: 350,
        exercises: [
          { name: "Squats", sets: 3, reps: "10-12", rest: "90s", video: "https://www.youtube.com/watch?v=gcNh17Ckjgg" },
          { name: "Bench Press", sets: 3, reps: "10-12", rest: "90s", video: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
          { name: "Bent Over Rows", sets: 3, reps: "10-12", rest: "90s", video: "https://www.youtube.com/watch?v=9efgcAjQe7E" },
          { name: "Overhead Press", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=QAQ64hK4Xxs" },
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12", rest: "75s", video: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
          { name: "Plank", sets: 3, reps: "30-60s", rest: "60s", video: "https://www.youtube.com/watch?v=pSHjTRCQxIw" }
        ]
      }
    }
  },
  beginner: {
    title: "Program Pemula",
    description: "Program khusus untuk pemula dengan fokus pada form yang benar dan membangun dasar yang kuat.",
    days: 3,
    duration: "30-45 menit",
    level: "Beginner",
    schedule: [
      { day: "Senin", type: "beginner" },
      { day: "Selasa", type: "rest" },
      { day: "Rabu", type: "beginner" },
      { day: "Kamis", type: "rest" },
      { day: "Jumat", type: "beginner" },
      { day: "Sabtu", type: "rest" },
      { day: "Minggu", type: "rest" }
    ],
    workouts: {
      beginner: {
        title: "Workout Pemula",
        focus: "Form Dasar dan Stabilitas",
        duration: 45,
        calories: 250,
        exercises: [
          { name: "Bodyweight Squats", sets: 3, reps: "15-20", rest: "60s", video: "https://www.youtube.com/watch?v=aclHkVaku9U" },
          { name: "Push-ups (modified)", sets: 3, reps: "8-12", rest: "60s", video: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
          { name: "Assisted Pull-ups", sets: 3, reps: "6-10", rest: "60s", video: "https://www.youtube.com/watch?v=2B7VzX8l9eI" },
          { name: "Dumbbell Rows", sets: 3, reps: "10-12", rest: "60s", video: "https://www.youtube.com/watch?v=roCP6wCXPqo" },
          { name: "Plank", sets: 3, reps: "20-30s", rest: "45s", video: "https://www.youtube.com/watch?v=pSHjTRCQxIw" },
          { name: "Glute Bridges", sets: 3, reps: "15-20", rest: "45s", video: "https://www.youtube.com/watch?v=OUgsJ8-Vi0E" }
        ]
      }
    }
  },
  strength: {
    title: "Strength Focus Program",
    description: "Program untuk meningkatkan kekuatan maksimal dengan fokus pada compound lifts berat.",
    days: 4,
    duration: "75-90 menit",
    level: "Advanced",
    schedule: [
      { day: "Senin", type: "strength" },
      { day: "Selasa", type: "accessory" },
      { day: "Rabu", type: "rest" },
      { day: "Kamis", type: "strength" },
      { day: "Jumat", type: "accessory" },
      { day: "Sabtu", type: "rest" },
      { day: "Minggu", type: "rest" }
    ],
    workouts: {
      strength: {
        title: "Strength Day",
        focus: "Kekuatan Maksimal - Compound Lifts",
        duration: 90,
        calories: 500,
        exercises: [
          { name: "Squats (Heavy)", sets: 5, reps: "3-5", rest: "180s", video: "https://www.youtube.com/watch?v=gcNh17Ckjgg" },
          { name: "Bench Press (Heavy)", sets: 5, reps: "3-5", rest: "180s", video: "https://www.youtube.com/watch?v=rT7DgCr-3pg" },
          { name: "Deadlifts (Heavy)", sets: 3, reps: "3-5", rest: "180s", video: "https://www.youtube.com/watch?v=op9kVnSso6Q" },
          { name: "Overhead Press", sets: 3, reps: "5-8", rest: "120s", video: "https://www.youtube.com/watch?v=QAQ64hK4Xxs" },
          { name: "Weighted Pull-ups", sets: 4, reps: "5-8", rest: "120s", video: "https://www.youtube.com/watch?v=eGo4IYlbE5g" }
        ]
      },
      accessory: {
        title: "Accessory Day",
        focus: "Otot Pendukung dan Volume",
        duration: 75,
        calories: 400,
        exercises: [
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", rest: "90s", video: "https://www.youtube.com/watch?v=JCXUYuzwNrM" },
          { name: "Incline Bench Press", sets: 4, reps: "8-10", rest: "90s", video: "https://www.youtube.com/watch?v=8iPEnn-ltC8" },
          { name: "Pendlay Rows", sets: 4, reps: "8-10", rest: "90s", video: "https://www.youtube.com/watch?v=FWJR5Ve8bnQ" },
          { name: "Face Pulls", sets: 3, reps: "12-15", rest: "60s", video: "https://www.youtube.com/watch?v=rep-qVOkqgk" },
          { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60s", video: "https://www.youtube.com/watch?v=TwD-YGVP4Bk" }
        ]
      }
    }
  }
};