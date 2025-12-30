import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative w-full h-[85vh] min-h-[600px] bg-gray-900 overflow-hidden">
      
      {/* 1. Arkaplan Görseli (Zoom Efektli) */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Big Boss New Season" 
          className="w-full h-full object-cover opacity-80 animate-slow-zoom" 
        />
        {/* Karartma */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* 2. İçerik */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        
        {/* Üst Başlık */}
        <span className="text-white/90 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 border-b border-white/30 pb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          2025 Sonbahar / Kış
        </span>

        {/* Ana Başlık */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 uppercase leading-none drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Tarzını<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Yansıt</span>
        </h1>
        
        {/* Açıklama */}
        <p className="text-gray-300 text-sm md:text-lg max-w-lg mb-10 font-light tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Zamansız parçalar, modern kesimler ve Big Boss kalitesiyle sezonun en iddialı görünümüne sahip ol.
        </p>
        
        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link 
                to="/products" 
                className="group bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
            >
                Koleksiyonu Keşfet
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <Link 
                to="/about" 
                className="px-10 py-4 text-xs font-bold uppercase tracking-widest text-white border border-white hover:bg-white hover:text-black transition-all"
            >
                Hikayemiz
            </Link>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;