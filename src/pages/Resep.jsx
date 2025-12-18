import React, { useState, useEffect } from 'react';

const Resep = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState(9);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Sample recipe data
  const recipeData = [
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
    {
      id: 2,
      title: "Omelet Telur Putih Sayuran",
      description: "Omelet sehat dari putih telur dengan campuran sayuran segar.",
      protein: 35,
      calories: 180,
      time: 10,
      difficulty: "mudah",
      category: ["sarapan", "telur", "cepat"],
      image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "6 putih telur",
        "1/2 paprika merah, potong dadu",
        "1/2 bawang bombay, iris tipis",
        "Segenggam bayam",
        "1 sdt minyak zaitun",
        "Garam dan lada secukupnya"
      ],
      instructions: [
        "Kocok putih telur dengan garam dan lada",
        "Tumis sayuran dengan minyak zaitun",
        "Tuang putih telur ke wajan",
        "Masak dengan api kecil hingga matang",
        "Lipat omelet dan sajikan"
      ]
    },
    {
      id: 3,
      title: "Protein Shake Berries",
      description: "Smoothie protein dengan campuran berries dan pisang.",
      protein: 40,
      calories: 280,
      time: 5,
      difficulty: "mudah",
      category: ["setelah_latihan", "protein_bubuk", "cepat"],
      image: "https://images.unsplash.com/photo-1573225342396-7f0ea6d87c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "1 scoop protein whey vanilla",
        "1 cangkir susu almond",
        "1/2 cangkir berries campur",
        "1/2 pisang",
        "Es batu secukupnya",
        "1 sdt madu (opsional)"
      ],
      instructions: [
        "Masukkan semua bahan ke blender",
        "Blender hingga halus",
        "Tuang ke gelas dan segera nikmati",
        "Tambahkan topping chia seed jika suka"
      ]
    },
    {
      id: 4,
      title: "Salmon Panggang Lemon",
      description: "Salmon segar dengan perasan lemon dan rempah-rempah.",
      protein: 50,
      calories: 350,
      time: 20,
      difficulty: "sedang",
      category: ["makan_malam", "ikan"],
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "2 potong fillet salmon",
        "1 lemon, iris tipis",
        "2 sdm minyak zaitun",
        "2 siung bawang putih, cincang",
        "1 sdt dill kering",
        "Garam dan lada secukupnya"
      ],
      instructions: [
        "Panaskan oven 200°C",
        "Bumbui salmon dengan garam, lada, dan dill",
        "Letakkan lemon iris di atas salmon",
        "Panggang selama 15-18 menit",
        "Sajikan dengan asparagus panggang"
      ]
    },
    {
      id: 5,
      title: "Greek Yogurt Bowl",
      description: "Yogurt Yunani dengan topping buah dan kacang.",
      protein: 30,
      calories: 250,
      time: 5,
      difficulty: "mudah",
      category: ["sarapan", "camilan", "cepat"],
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "1 cangkir Greek yogurt plain",
        "1/2 cangkir berries campur",
        "1 sdm almond slice",
        "1 sdt madu",
        "1 sdt chia seed",
        "1/4 cangkir granola rendah gula"
      ],
      instructions: [
        "Tuang Greek yogurt ke mangkuk",
        "Tambahkan berries segar",
        "Taburi dengan almond dan chia seed",
        "Siram dengan madu",
        "Tambahkan granola di atasnya"
      ]
    },
    {
      id: 6,
      title: "Daging Sapi Stir-fry",
      description: "Tumis daging sapi dengan brokoli dan saus khusus.",
      protein: 55,
      calories: 380,
      time: 30,
      difficulty: "sedang",
      category: ["makan_siang", "daging_sapi"],
      image: "https://images.unsplash.com/photo-1603133872646-f5c58b2c9a02?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "400g daging sapi slice",
        "2 cangkir brokoli",
        "1 paprika merah, potong",
        "3 siung bawang putih, cincang",
        "2 sdm kecap asin",
        "1 sdm minyak wijen",
        "1 sdt jahe parut"
      ],
      instructions: [
        "Tumis bawang putih dan jahe",
        "Masukkan daging sapi, masak hingga matang",
        "Tambahkan sayuran, tumis hingga layu",
        "Tuang kecap asin dan minyak wijen",
        "Masak 2 menit tambahan, sajikan"
      ]
    },
    {
      id: 7,
      title: "Tahu Kukus Jamur",
      description: "Tahu kukus dengan topping jamur dan saus tiram.",
      protein: 25,
      calories: 200,
      time: 20,
      difficulty: "mudah",
      category: ["vegetarian", "tahu", "makan_malam"],
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "2 potong tahu sutra",
        "100g jamur shitake",
        "2 sdm saus tiram",
        "1 sdt minyak wijen",
        "1 batang daun bawang, iris",
        "1 sdt kecap asin"
      ],
      instructions: [
        "Kukus tahu selama 10 menit",
        "Tumis jamur dengan sedikit minyak",
        "Tambahkan saus tiram dan kecap asin",
        "Tuang saus di atas tahu kukus",
        "Taburi daun bawang, sajikan"
      ]
    },
    {
      id: 8,
      title: "Pre-Workout Oatmeal",
      description: "Oatmeal dengan pisang dan kayu manis untuk energi sebelum latihan.",
      protein: 20,
      calories: 350,
      time: 10,
      difficulty: "mudah",
      category: ["sebelum_latihan", "sarapan", "cepat"],
      image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "1/2 cangkir rolled oats",
        "1 cangkir air atau susu",
        "1 pisang, iris",
        "1 sdt kayu manis",
        "1 sdm selai kacang",
        "1 sdt madu"
      ],
      instructions: [
        "Masak oats dengan air/menurut petunjuk",
        "Aduk hingga creamy",
        "Tambahkan pisang dan kayu manis",
        "Sajikan dengan selai kacang dan madu",
        "Nikmati 1-2 jam sebelum latihan"
      ]
    },
    {
      id: 9,
      title: "Udang Saus Bawang Putih",
      description: "Udang segar dengan saus bawang putih pedas.",
      protein: 48,
      calories: 280,
      time: 15,
      difficulty: "mudah",
      category: ["makan_malam", "udang", "cepat"],
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ingredients: [
        "400g udang kupas",
        "5 siung bawang putih, cincang",
        "1 cabai merah, iris",
        "2 sdm saus tiram",
        "1 sdm minyak zaitun",
        "1 sdt kecap ikan",
        "Daun ketumbar untuk hiasan"
      ],
      instructions: [
        "Tumis bawang putih hingga harum",
        "Masukkan udang, masak hingga berubah warna",
        "Tambahkan cabai dan saus tiram",
        "Masak 2-3 menit hingga matang",
        "Hias dengan daun ketumbar, sajikan"
      ]
    }
  ];

  // All filter categories
  const allFilterCategories = {
    waktuMakan: ['sarapan', 'makan_siang', 'makan_malam', 'camilan', 'sebelum_latihan', 'setelah_latihan'],
    kesulitan: ['mudah', 'sedang', 'sulit'],
    waktuMemasak: ['cepat', 'medium', 'lama'],
    sumberProtein: ['ayam', 'daging_sapi', 'ikan', 'telur', 'tahu', 'tempe', 'udang', 'protein_bubuk']
  };

  useEffect(() => {
    setRecipes(recipeData);
    setFilteredRecipes(recipeData);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterRecipes(value, activeFilters);
  };

  const toggleFilter = (filter) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
    filterRecipes(searchTerm, newFilters);
  };

  const filterRecipes = (search, filters) => {
    let filtered = [...recipeData];

    // Apply search
    if (search) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(search) ||
        recipe.description.toLowerCase().includes(search) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(search))
      );
    }

    // Apply filters
    if (filters.size > 0) {
      filtered = filtered.filter(recipe => {
        return Array.from(filters).some(filter => recipe.category.includes(filter) || recipe.difficulty === filter);
      });
    }

    setFilteredRecipes(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters(new Set());
    setFilteredRecipes(recipeData);
  };

  const applyFilters = () => {
    setShowFilterSection(false);
  };

  const loadMoreRecipes = () => {
    setDisplayedRecipes(prev => prev + 6);
  };

  const sortRecipes = (type) => {
    let sorted = [...filteredRecipes];
    
    if (type === 'protein') {
      sorted.sort((a, b) => b.protein - a.protein);
    } else if (type === 'time') {
      sorted.sort((a, b) => a.time - b.time);
    }
    
    setFilteredRecipes(sorted);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeRecipeModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
    // Restore body scroll
    document.body.style.overflow = 'auto';
  };

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty) {
      case 'mudah':
        return <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">Mudah</span>;
      case 'sedang':
        return <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs">Sedang</span>;
      default:
        return <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded text-xs">Sulit</span>;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'mudah':
        return 'text-green-400';
      case 'sedang':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const saveRecipe = () => {
    alert('Resep berhasil disimpan ke favorit!');
  };

  const shareRecipe = () => {
    if (navigator.share && selectedRecipe) {
      navigator.share({
        title: selectedRecipe.title,
        text: selectedRecipe.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${selectedRecipe?.title} - ${window.location.href}`);
      alert('URL resep telah disalin ke clipboard!');
    }
  };

  // Create recipe card component
  const RecipeCard = ({ recipe, isFeatured = false }) => (
    <div 
      key={recipe.id}
      className="kartu overflow-hidden hover:border-merah transition-all cursor-pointer group"
      onClick={() => handleRecipeClick(recipe)}
    >
      <div className={`relative ${isFeatured ? 'h-56' : 'h-48'} overflow-hidden`}>
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {getDifficultyBadge(recipe.difficulty)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium">Klik untuk lihat resep →</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-merah">{recipe.protein}g</div>
            <div className="text-xs text-gray-400">Protein</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-400">{recipe.calories}</div>
            <div className="text-xs text-gray-400">Kalori</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-400">{recipe.time}m</div>
            <div className="text-xs text-gray-400">Waktu</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {recipe.category.slice(0, 3).map((cat) => (
            <span key={cat} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
              {cat.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Filter chip component
  const FilterChip = ({ label, filter, active }) => (
    <span 
      onClick={() => toggleFilter(filter)}
      className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
        active 
          ? 'bg-merah text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
    </span>
  );

  // Recipe Detail Modal Component
  const RecipeDetailModal = () => {
    if (!selectedRecipe) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="kartu w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 z-10 flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold">{selectedRecipe.title}</h2>
              <button 
                onClick={closeRecipeModal}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Image & Stats */}
                <div>
                  <div className="relative h-64 overflow-hidden rounded-lg mb-6">
                    <img 
                      src={selectedRecipe.image} 
                      alt={selectedRecipe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {getDifficultyBadge(selectedRecipe.difficulty)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-merah">{selectedRecipe.protein}g</div>
                      <div className="text-sm text-gray-400">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{selectedRecipe.calories}</div>
                      <div className="text-sm text-gray-400">Kalori</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{selectedRecipe.time}m</div>
                      <div className="text-sm text-gray-400">Waktu</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <div className={`text-2xl font-bold ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                        {selectedRecipe.difficulty}
                      </div>
                      <div className="text-sm text-gray-400">Kesulitan</div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-300">Kategori</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.category.map((cat) => (
                        <span key={cat} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                          {cat.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Ingredients & Instructions */}
                <div className="space-y-6">
                  {/* Ingredients */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-300 flex items-center">
                      <i className="fas fa-shopping-basket text-merah mr-2"></i>
                      Bahan-bahan
                    </h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start p-2 bg-gray-800/50 rounded">
                          <i className="fas fa-check text-merah mr-3 mt-1"></i>
                          <span className="text-gray-300">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Instructions */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-300 flex items-center">
                      <i className="fas fa-list-ol text-merah mr-2"></i>
                      Cara Membuat
                    </h3>
                    <ol className="space-y-4">
                      {selectedRecipe.instructions.map((step, index) => (
                        <li key={index} className="flex items-start p-4 bg-gray-800/50 rounded">
                          <span className="w-8 h-8 bg-merah rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-300">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={saveRecipe}
                      className="tombol-merah px-6 py-3 flex items-center"
                    >
                      <i className="fas fa-bookmark mr-2"></i> Simpan ke Favorit
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                    >
                      <i className="fas fa-print mr-2"></i> Cetak Resep
                    </button>
                  </div>
                  <div>
                    <button 
                      onClick={shareRecipe}
                      className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                    >
                      <i className="fas fa-share-alt mr-2"></i> Bagikan Resep
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-hitam pt-6 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-utensils text-merah mr-3"></i>
            Database Resep Tinggi Protein
          </h1>
          <p className="text-gray-400 text-lg">
            100+ resep sehat untuk mendukung program bulking dan fitness Anda
          </p>
        </div>

        {/* Search & Filters */}
        <div className="kartu p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-grow">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Cari resep (contoh: ayam, telur, smoothie...)"
                className="input-custom w-full pl-12"
              />
            </div>
            
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilterSection(!showFilterSection)}
              className="tombol-merah px-6 py-3"
            >
              <i className="fas fa-filter mr-2"></i> Filter
            </button>
          </div>

          {/* Filter Section */}
          {showFilterSection && (
            <div className="border-t border-gray-700 pt-6 animate-fadeIn">
              {/* Meal Type */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-300">Waktu Makan</h3>
                <div className="flex flex-wrap gap-2">
                  {allFilterCategories.waktuMakan.map(filter => (
                    <FilterChip
                      key={filter}
                      label={filter.replace('_', ' ')}
                      filter={filter}
                      active={activeFilters.has(filter)}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-300">Tingkat Kesulitan</h3>
                <div className="flex flex-wrap gap-2">
                  {allFilterCategories.kesulitan.map(filter => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      filter={filter}
                      active={activeFilters.has(filter)}
                    />
                  ))}
                </div>
              </div>

              {/* Cooking Time */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-300">Waktu Memasak</h3>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="Cepat (<15 menit)" filter="cepat" active={activeFilters.has('cepat')} />
                  <FilterChip label="Medium (15-30 menit)" filter="medium" active={activeFilters.has('medium')} />
                  <FilterChip label="Lama (>30 menit)" filter="lama" active={activeFilters.has('lama')} />
                </div>
              </div>

              {/* Protein Source */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 text-gray-300">Sumber Protein</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {allFilterCategories.sumberProtein.map(filter => (
                    <FilterChip
                      key={filter}
                      label={filter.replace('_', ' ')}
                      filter={filter}
                      active={activeFilters.has(filter)}
                    />
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-400">
                    Filter aktif: <span className="text-merah">{activeFilters.size}</span>
                  </span>
                </div>
                <div>
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-300 hover:text-white mr-3"
                  >
                    <i className="fas fa-times mr-1"></i> Hapus Semua
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="tombol-merah px-6 py-2"
                  >
                    <i className="fas fa-check mr-1"></i> Terapkan Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="kartu p-6 text-center">
            <div className="text-3xl font-bold text-merah mb-2">{recipes.length}</div>
            <div className="text-gray-400">Total Resep</div>
          </div>
          <div className="kartu p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {recipes.filter(r => r.category.includes('ayam')).length}
            </div>
            <div className="text-gray-400">Resep Ayam</div>
          </div>
          <div className="kartu p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {recipes.filter(r => r.category.includes('vegetarian')).length}
            </div>
            <div className="text-gray-400">Vegetarian</div>
          </div>
          <div className="kartu p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {recipes.filter(r => r.time <= 15).length}
            </div>
            <div className="text-gray-400">Resep Cepat</div>
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Resep Pilihan</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => sortRecipes('protein')}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <i className="fas fa-dumbbell mr-2"></i> Protein Tertinggi
              </button>
              <button 
                onClick={() => sortRecipes('time')}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <i className="fas fa-clock mr-2"></i> Tercepat
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredRecipes.slice(0, 3).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} isFeatured={true} />
            ))}
          </div>
        </div>

        {/* All Recipes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Semua Resep</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.slice(0, displayedRecipes).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-400">Tidak ada resep yang ditemukan</p>
              <button 
                onClick={clearFilters}
                className="tombol-merah mt-4"
              >
                <i className="fas fa-redo mr-2"></i> Reset Filter
              </button>
            </div>
          ) : (
            displayedRecipes < filteredRecipes.length && (
              <div className="text-center mt-10">
                <button 
                  onClick={loadMoreRecipes}
                  className="tombol-merah px-8 py-3"
                >
                  <i className="fas fa-plus mr-2"></i> Muat Lebih Banyak
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {showRecipeModal && <RecipeDetailModal />}
    </div>
  );
};

export default Resep;