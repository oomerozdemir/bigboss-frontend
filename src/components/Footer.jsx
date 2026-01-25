import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. KOLON: MARKA */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tighter">BIG BOSS</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              1972'den beri kadın giyiminde zarafet ve kaliteyi buluşturuyoruz. 
              36-50 beden aralığındaki geniş koleksiyonumuzla her kadının yanındayız.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/bigbosstextil" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18}/>
              </a>
              <a 
                href="https://www.facebook.com/bigbosstextil" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18}/>
              </a>
            </div>
          </div>

          {/* 2. KOLON: HIZLI LİNKLER */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-200">Kurumsal</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/hakkimizda" className="hover:text-white transition-colors duration-200">Hakkımızda</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors duration-200">Koleksiyonlar</Link></li>
              <li><Link to="/iletisim" className="hover:text-white transition-colors duration-200">İletişim</Link></li>
              <li><Link to="/sss" className="hover:text-white transition-colors duration-200">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          {/* 3. KOLON: POLİTİKALAR */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-200">Müşteri Hizmetleri</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/mesafeli-satis-sozlesmesi" className="hover:text-white transition-colors duration-200">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link to="/iade-politikasi" className="hover:text-white transition-colors duration-200">İade Politikası</Link></li>
              <li><Link to="/gizlilik-politikasi" className="hover:text-white transition-colors duration-200">Gizlilik Politikası</Link></li>
              <li><Link to="/cerez-politikasi" className="hover:text-white transition-colors duration-200">Çerez Politikası</Link></li>
              <li><Link to="/kargo-teslimat-politikasi" className="hover:text-white transition-colors duration-200">Kargo ve Teslimat</Link></li>
            </ul>
          </div>

          {/* 4. KOLON: MAĞAZALAR & İLETİŞİM */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-200">Bize Ulaşın</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-gray-500" />
                <span>Halaskargazi Cad. No:92-D Osmanbey Mağazası<br/>T: 530 642 53 43</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-gray-500" />
                <span>Halaskargazi Cad. No:150-B Şişli Mağazası<br/>T: 530 774 99 86</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-gray-500" />
                <span>Rumeli Cad. No:72-74 Nişantaşı-Ömür Inn Mağazası<br/>T: 530 072 16 99</span>
              </li>
              
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-gray-500" />
                <a href="mailto:bigbosstekstil1972@gmail.com" className="hover:text-white transition-colors duration-200">
                  bigbosstekstil1972@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ALT TELİF ALANI */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Big Boss Textil. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
             {/* Kredi Kartı İkonları Temsili */}
             <div className="h-6 w-10 bg-gray-900 rounded border border-gray-800"></div>
             <div className="h-6 w-10 bg-gray-900 rounded border border-gray-800"></div>
             <div className="h-6 w-10 bg-gray-900 rounded border border-gray-800"></div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;