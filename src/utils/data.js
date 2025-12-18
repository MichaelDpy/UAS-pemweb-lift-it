// Data dummy untuk aplikasi

export const articles = [
  {
    id: 1,
    title: "Protein Timing: Kapan Waktu Terbaik Konsumsi Protein?",
    excerpt: "Penelitian terbaru menunjukkan bahwa waktu konsumsi protein memiliki pengaruh signifikan terhadap sintesis protein otot. Temukan strategi optimal untuk memaksimalkan hasil latihan Anda.",
    category: "nutrisi",
    readTime: "8 min",
    date: "2 hari lalu",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: `Artikel lengkap tentang protein timing...`
  },
  // ... tambahkan lebih banyak artikel
];

export const recipes = [
  {
    id: 1,
    title: "Ayam Panggang Madu Bawang Putih",
    description: "Ayam panggang dengan saus madu dan bawang putih, tinggi protein dan rendah lemak.",
    protein: 45,
    calories: 320,
    time: 25,
    difficulty: "mudah",
    category: ["makan_malam", "ayam"],
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    ingredients: [
      "500g dada ayam fillet",
      "3 siung bawang putih, cincang",
      "2 sdm madu",
      "2 sdm kecap asin",
      "1 sdm minyak zaitun",
      "1/2 sdt lada hitam",
      "1/2 sdt garam"
    ],
    instructions: [
      "Campur semua bahan marinasi dalam mangkuk",
      "Masukkan ayam dan diamkan minimal 30 menit",
      "Panggang di oven 200°C selama 20-25 menit",
      "Balik sekali di tengah proses pemanggangan",
      "Sajikan dengan sayuran kukus"
    ]
  },
  // ... tambahkan lebih banyak resep
];

export const workoutPrograms = {
  pushpull: {
    title: "Push-Pull-Legs (PPL)",
    description: "Program Push-Pull-Legs membagi latihan menjadi tiga kategori: Push (dorong), Pull (tarik), dan Legs (kaki). Program ini optimal untuk perkembangan otot yang seimbang.",
    days: 6,
    duration: "60-75 menit",
    level: "Intermediate - Advanced",
    workouts: {
      push: {
        title: "Push Day",
        focus: "Dada, Bahu, Triceps",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-12" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
          // ... lebih banyak exercises
        ]
      }
    }
  }
};

export const exercises = [
  {
    name: "Bench Press",
    muscle: "Chest",
    equipment: "Barbell",
    video: "https://www.youtube.com/watch?v=rT7DgCr-3pg"
  },
  // ... lebih banyak exercises
];