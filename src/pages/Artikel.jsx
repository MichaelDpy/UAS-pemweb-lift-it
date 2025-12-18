import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Artikel = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { user } = useAuth();

  // Sample data
  const articlesData = [
    {
      id: 1,
      title: "Protein Timing: Kapan Waktu Terbaik Konsumsi Protein?",
      excerpt: "Pelajari strategi optimal untuk memaksimalkan sintesis protein otot berdasarkan waktu konsumsi.",
      category: "nutrisi",
      readTime: "8 min",
      date: "2 hari lalu",
      content: `Artikel lengkap tentang protein timing...`
    },
{
      id: 2,
      title: "Suplement apa yang benar-benar bekerja?",
      excerpt: "Suplement dengan bukti ilmiah kuat: Whey Protein, Creatine, Kafein, Beta-Alanine, dan Citrulline Fokus pada nutrisi makanan utuh sebelum mempertimbangkan suplement.",
      category: "suplement",
      readTime: "8 min",
      date: "2 hari lalu",
      content: `Artikel lengkap tentang protein timing...`
    },  ];

  useEffect(() => {
    setArticles(articlesData);
    setFilteredArticles(articlesData);
  }, []);

  const filterByCategory = (category) => {
    setCurrentCategory(category);
    if (category === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === category));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    let filtered = articles;
    if (currentCategory !== 'all') {
      filtered = filtered.filter(article => article.category === currentCategory);
    }
    
    if (value) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(value) ||
        article.excerpt.toLowerCase().includes(value)
      );
    }
    
    setFilteredArticles(filtered);
  };

  const getCategoryClass = (category) => {
    switch(category) {
      case 'nutrisi': return 'badge-nutrisi';
      case 'latihan': return 'badge-latihan';
      case 'suplement': return 'badge-suplement';
      case 'umum': return 'badge-umum';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const getCategoryName = (category) => {
    switch(category) {
      case 'nutrisi': return 'Nutrisi';
      case 'latihan': return 'Latihan';
      case 'suplement': return 'Suplementasi';
      case 'umum': return 'Mindset';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-hitam pt-6 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            <i className="fas fa-book-open text-merah mr-3"></i>
            Artikel & Edukasi Fitness
          </h1>
          <p className="text-gray-400 text-lg">
            Pelajari ilmu terbaru tentang nutrisi, latihan, dan suplementasi untuk hasil optimal
          </p>
        </div>

        {/* Featured Article */}
        <div className="kartu p-8 mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className={`badge ${getCategoryClass('nutrisi')}`}>
                {getCategoryName('nutrisi')}
              </span>
              <h2 className="text-3xl font-bold mt-4 mb-4">Protein Timing: Kapan Waktu Terbaik Konsumsi Protein?</h2>
              <p className="text-gray-300 mb-6">
                Penelitian terbaru menunjukkan bahwa waktu konsumsi protein memiliki pengaruh signifikan 
                terhadap sintesis protein otot. Temukan strategi optimal untuk memaksimalkan hasil latihan Anda.
              </p>
              <div className="flex items-center text-gray-400 mb-6">
                <i className="fas fa-clock mr-2"></i>
                <span>Baca 8 min • Dipublikasi 2 hari lalu</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(articlesData[0])}
                className="tombol-merah px-6 py-3"
              >
                <i className="fas fa-book-reader mr-2"></i> Baca Artikel Lengkap
              </button>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Protein Timing" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Kategori Artikel</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['nutrisi', 'latihan', 'suplement', 'umum'].map((category) => (
              <div 
                key={category}
                className="kartu p-6 text-center cursor-pointer hover:border-merah transition-all"
                onClick={() => filterByCategory(category)}
              >
                <div className={`w-16 h-16 ${
                  category === 'nutrisi' ? 'bg-green-900/30' :
                  category === 'latihan' ? 'bg-blue-900/30' :
                  category === 'suplement' ? 'bg-purple-900/30' :
                  'bg-yellow-900/30'
                } rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`fas ${
                    category === 'nutrisi' ? 'fa-utensils text-green-400' :
                    category === 'latihan' ? 'fa-dumbbell text-blue-400' :
                    category === 'suplement' ? 'fa-pills text-purple-400' :
                    'fa-brain text-yellow-400'
                  } text-2xl`}></i>
                </div>
                <h3 className="font-bold mb-2">{getCategoryName(category)}</h3>
                <p className="text-sm text-gray-400">
                  {articles.filter(a => a.category === category).length} artikel
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="kartu p-6 mb-8">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Cari artikel..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-merah"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">
            {currentCategory === 'all' ? 'Semua Artikel' : `Artikel ${getCategoryName(currentCategory)}`}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="kartu overflow-hidden hover:border-merah transition-all cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="p-6">
                  <span className={`badge ${getCategoryClass(article.category)}`}>
                    {getCategoryName(article.category)}
                  </span>
                  <h3 className="font-bold text-lg mt-4 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center">
                      <i className="fas fa-clock mr-2"></i>
                      <span>{article.readTime} • {article.date}</span>
                    </div>
                    <i className="fas fa-arrow-right text-merah"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="kartu">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                  <div>
                    <span className={`badge ${getCategoryClass(selectedArticle.category)}`}>
                      {getCategoryName(selectedArticle.category)}
                    </span>
                    <h2 className="text-2xl font-bold mt-2">{selectedArticle.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="prose prose-invert max-w-none">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt={selectedArticle.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    <p>{selectedArticle.content}</p>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">
                      <i className="fas fa-clock mr-2"></i>
                      <span>Baca {selectedArticle.readTime}</span>
                    </div>
                    <div className="flex space-x-4">
                      <button className="text-gray-400 hover:text-white">
                        <i className="fas fa-share-alt"></i>
                      </button>
                      {user && (
                        <button className="text-gray-400 hover:text-yellow-400">
                          <i className="fas fa-bookmark"></i>
                        </button>
                      )}
                    </div>
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

export default Artikel;