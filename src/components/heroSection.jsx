import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Arama Fonksiyonu
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // ✅ Buton Fonksiyonları
  const handleShopNow = () => {
    navigate('/products');
  };

  const handleDiscountClick = () => {
    navigate('/products?discount=true');
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="w-full bg-white">
      {/* Header with title and search */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-15">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-none tracking-tight">
            Big Boss ile →<br />
            <span className="block">tarzını Yansıt.</span>
          </h1>
          
         
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left side - Model image with Shop Now button */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-[500px] md:h-[600px] group">
            <img 
              src="/hero-product3.png" 
              alt="Big Boss Sonbahar Koleksiyonu - Şık Kadın Giyim"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop';
              }}
              loading="eager"
            />
            {/* Shop Now button */}
            <button 
              onClick={handleShopNow}
              className="absolute bottom-1/2 right-12 translate-y-1/2 bg-black text-white rounded-full w-32 h-32 flex items-center justify-center font-semibold text-sm hover:scale-110 hover:shadow-2xl transition-all duration-300 active:scale-95"
              aria-label="Şimdi alışverişe başla"
            >
              Şimdi<br />Satın Al!
            </button>
          </div>

         {/* Right side - Two sections stacked */}
          <div className="flex flex-col gap-6">
            
            {/* Promo section - 20% OFF */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-8 md:p-10 relative overflow-hidden h-[280px] md:h-[350px] flex flex-col justify-between group">
              {/* Background illustration image */}
              <div className="absolute top-0 right-0 w-60 md:w-80 h-full opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <img 
                  src="/hero-product4.jpg" 
                  alt="Kış İndirimleri"
                  className="w-full h-full object-contain object-right"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop';
                  }}
                  loading="lazy"
                />
              </div>
              
              {/* Text content */}
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-sm">
                  %50'ye Varan<br />
                  indirimlerden<br />
                  faydalan.
                </h2>
                <p className="text-sm text-gray-700 font-medium drop-shadow-sm">
                  30 Ocak'a Kadar Geçerli
                </p>
              </div>
              
              {/* CTA button */}
              <button 
                onClick={handleDiscountClick}
                className="relative z-10 self-start border-2 border-black bg-white rounded-full px-6 md:px-8 py-3 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-2 group/btn shadow-md hover:shadow-xl"
                aria-label="İndirimli ürünleri gör"
              >
                <span>%50 İndirimi Al</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Bottom categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-auto sm:h-[234px]">
              
              {/* Ceketler category */}
              <button
                onClick={() => handleCategoryClick('Ceketler')}
                className="relative bg-gray-300 rounded-2xl overflow-hidden group cursor-pointer h-[200px] sm:h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                aria-label="Ceket koleksiyonunu görüntüle"
              >
                <img 
                  src="/hero-product4.jpg" 
                  alt="Ceket Koleksiyonu - Big Boss"
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop';
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <h3 className="absolute bottom-6 left-6 text-white text-xl md:text-2xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  #Ceketler
                </h3>
              </button>

              {/* Elbiseler category */}
              <button
                onClick={() => handleCategoryClick('Elbiseler')}
                className="relative bg-gray-300 rounded-2xl overflow-hidden group cursor-pointer h-[200px] sm:h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                aria-label="Elbise koleksiyonunu görüntüle"
              >
                <img 
                  src="/hero-product3.png" 
                  alt="Elbise Koleksiyonu - Big Boss"
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop';
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <h3 className="absolute bottom-6 left-6 text-white text-xl md:text-2xl font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  #Elbiseler
                </h3>
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;