import React from 'react';
import { Link } from 'react-router-dom';

const BrandStory = () => {
  return (
    <section className="bg-black text-white py-24 md:py-32 relative overflow-hidden">
      {/* Arkaplan Deseni (Opsiyonel - Hafif doku) */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        
        {/* Dekoratif Çizgi */}
        <div className="w-px h-16 bg-white/30 mx-auto mb-8"></div>

        <h2 className="text-3xl md:text-5xl font-serif italic mb-6">
          "Zarafetin bedeni yoktur."
        </h2>

        <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10">
          1972'den beri Osmanbey'in kalbinde başlayan yolculuğumuz, yarım asırlık tecrübeyle devam ediyor. 
          Big Boss olarak, <span className="text-white font-medium">36'dan 50 bedene</span> kadar uzanan geniş kalıplarımız ve 
          zamansız tasarımlarımızla her kadının kendi hikayesinin patronu olduğuna inanıyoruz.
        </p>

        <Link 
          to="/hakkimizda"
          className="inline-block border border-white/30 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
        >
          Hikayemizi Oku
        </Link>

      </div>
    </section>
  );
};

export default BrandStory;