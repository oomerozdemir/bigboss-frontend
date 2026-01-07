import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;
    
    try {
      if (token) {
        const favRes = await fetch(`${apiUrl}/api/favorites`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const favData = await favRes.json();
        setFavorites(favData);
      } else {
        setLoading(false); 
      }

      const prodRes = await fetch(`${apiUrl}/api/products`);
      const prodData = await prodRes.json();
      
      setSuggestedProducts(prodData.slice(0, 4));

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 border-b border-gray-100 pb-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                    Favorilerim
                </h1>
                <p className="text-gray-500 font-light tracking-wide text-sm">
                    Takip ettiğiniz özel parçalar.
                </p>
            </div>
            <div className="text-right hidden md:block">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Toplam {favorites.length} Parça
                </span>
            </div>
        </div>

        {/* --- İÇERİK ALANI --- */}
        {loading ? (
          <div className="text-center py-32 text-xs tracking-widest uppercase animate-pulse">Yükleniyor...</div>
        ) : favorites.length > 0 ? (
          
          /* DOLU LİSTE */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        ) : (
          
          /* BOŞ LİSTE (EMPTY STATE) */
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-100 relative overflow-hidden group">
            
            <Heart className="absolute text-gray-100 w-96 h-96 -bottom-20 -right-20 opacity-50 transform rotate-12 group-hover:scale-110 transition-transform duration-700" strokeWidth={0.5} />

            <div className="relative z-10 text-center max-w-md px-6">
                <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full mx-auto mb-6 shadow-sm">
                    <Heart size={24} className="text-gray-400" />
                </div>
                
                <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-3">
                    Listeniz Henüz Boş
                </h2>
                
                <p className="text-gray-500 font-light mb-8 leading-relaxed">
                    Henüz favorilerinize bir ürün eklemediniz. Tarzınızı yansıtacak parçaları keşfetmek için koleksiyona göz atın.
                </p>

                <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    <ShoppingBag size={16} />
                    Alışverişe Başla
                </Link>
            </div>
          </div>
        )}

        {/* --- ÖNERİLER --- */}
        <div className="mt-32">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
                    Sizin İçin Seçtiklerimiz
                </h3>
                <Link to="/products" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-400 transition-all hidden md:block">
                    Tümünü Gör
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
                {suggestedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            
            <div className="mt-10 text-center md:hidden">
                <Link to="/products" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
                    Tümünü Gör
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FavoritesPage;