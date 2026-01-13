import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="w-full bg-white">
      {/* Header with title and search */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-15">
        <div className="flex items-start justify-between">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-none tracking-tight">
            Big Boss ile →<br />
            <span className="block">tarzını Yansıt.</span>
          </h1>
          
          {/* Search bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search item"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black w-64"
            />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left side - Model image with Shop Now button */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-[600px]">
            <img 
              src="/hero-product3.png" 
              alt="Fashion model"
              className="w-full h-full object-cover object-top"
            />
            {/* Shop Now button */}
            <button className="absolute bottom-1/2 right-12 translate-y-1/2 bg-black text-white rounded-full w-32 h-32 flex items-center justify-center font-semibold text-sm hover:scale-105 transition-transform">
              Şimdi Satın Al!
            </button>
          </div>

         {/* Right side - Two sections stacked */}
          <div className="flex flex-col gap-6">
            
            {/* Promo section - 20% OFF */}
            <div className="bg-gray-200 rounded-2xl p-10 relative overflow-hidden h-[350px] flex flex-col justify-between">
              {/* Background illustration image */}
              <div className="absolute top-0 right-0 w-80 h-full">
                <img 
                  src="/hero-product4.jpg" 
                  alt="Women Ordering on the laptop"
                  className="w-full h-full object-contain object-right opacity-60"
                />
              </div>
              
              {/* Text content */}
              <div className="relative z-10">
                <h2 className="text-5xl font-bold leading-tight mb-4">
                  %50'ye Varan<br />
                  indirimlerden <br />
                  faydalan.
                </h2>
                <p className="text-sm text-gray-600">
                  30 Ocak'a Kadar Geçerli<span className="font-semibold"></span>
                </p>
              </div>
              
              {/* CTA button */}
              <button className="relative z-10 self-start border-2 border-black rounded-full px-8 py-3 text-sm font-semibold hover:bg-black hover:text-white transition-colors">
                %50 İndirimi Al
              </button>
            </div>
            {/* Bottom categories */}
            <div className="grid grid-cols-2 gap-6 h-[234px]">
              
              {/* Headwear category */}
              <div className="relative bg-gray-300 rounded-2xl overflow-hidden group cursor-pointer">
                <img 
                  src="/hero-product4.jpg" 
                  alt="Ceket"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <h3 className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                  #Ceketler
                </h3>
              </div>

              {/* Sunglasses category */}
              <div className="relative bg-gray-300 rounded-2xl overflow-hidden group cursor-pointer">
                <img 
                  src="/hero-product3.png" 
                  alt="Elbise"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <h3 className="absolute bottom-6 left-6 text-white text-2xl font-bold">
                  #Elbiseler
                </h3>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;