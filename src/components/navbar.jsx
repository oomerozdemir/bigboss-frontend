import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, LogOut, ShieldCheck, ChevronDown, Heart } from 'lucide-react'; 
import AuthModal from './AuthModel';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import logoImg from '../assets/bigbossLOGO.jpg'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [user, setUser] = useState(null); 
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const [categories, setCategories] = useState([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const data = await res.json();
      const navbarCats = data.filter(cat => cat.isShowOnNavbar === true);
      setCategories(navbarCats);
    } catch (error) {
      console.error("Kategoriler yüklenemedi", error);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3" 
          : "bg-white py-6"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center">
            
            {/* --- 1. SOL: LOGO --- */}
            <Link to="/" className="shrink-0">
                <img 
                    src={logoImg} 
                    alt="Big Boss" 
                    className="h-10 md:h-12 w-auto object-contain" 
                />
            </Link>

            {/* --- 2. ORTA: DİNAMİK MENÜ (Masaüstü) --- */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
                
                {/* Statik Link */}
                <Link to="/" className="text-xs font-bold text-gray-800 hover:text-gray-500 tracking-widest uppercase transition-colors relative group">
                    ANASAYFA
                </Link>

                {/* --- DİNAMİK KATEGORİLER BURADA DİZİLİYOR --- */}
                {categories.map((mainCat) => (
                    <div key={mainCat.id} className="group relative h-full flex items-center py-2 cursor-pointer">
                        {/* Ana Kategori İsmi */}
                        <Link 
                            to={`/products?category=${mainCat.name}`}
                            className="text-xs font-bold text-gray-800 group-hover:text-gray-500 tracking-widest uppercase transition-colors flex items-center gap-1"
                        >
                            {mainCat.name}
                            {mainCat.subCategories?.length > 0 && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300"/>}
                        </Link>

                        {/* --- DROPDOWN (ALT KATEGORİLER) --- */}
                        {mainCat.subCategories && mainCat.subCategories.length > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 rounded-lg overflow-hidden py-2">
                                {mainCat.subCategories.map((sub) => (
                                    <Link 
                                        key={sub.id} 
                                        to={`/products?category=${mainCat.name}&subcategory=${sub.name}`} 
                                        className="block px-6 py-2.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors text-center"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                

            </div>

            {/* --- 3. SAĞ: İKONLAR --- */}
            <div className="flex items-center gap-5 md:gap-6 text-gray-800">
              
             

              <Link to="/favoriler" className="hover:text-gray-500 transition-transform hover:scale-105">
                <Heart size={22} strokeWidth={1.2} />
              </Link>
              
              {/* Kullanıcı / Giriş */}
              {user ? (
                <div className="relative group py-2">
                    <button className="flex items-center gap-1 hover:text-gray-500 transition-colors">
                        <User size={22} strokeWidth={1.2} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="px-3 py-2 border-b border-gray-50 mb-1">
                            <p className="text-xs text-gray-400 font-bold">Merhaba,</p>
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                        </div>
                        <Link to="/hesabim" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors">
    <User size={14} /> Hesabım
</Link>
                        {user.isAdmin && (
                            <Link to="/admin-panel" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded">
                                <ShieldCheck size={14}/> Admin Paneli
                            </Link>
                        )}
                        <Link to="/orders" className="block px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded">Siparişlerim</Link>
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded mt-1">
                            <LogOut size={14}/> Çıkış
                        </button>
                    </div>
                </div>
              ) : (
                <button onClick={() => setIsAuthOpen(true)} className="hover:text-gray-500 transition-transform hover:scale-105">
                    <User size={22} strokeWidth={1.2} />
                </button>
              )}

              {/* Sepet */}
            <Link to="/sepet" className="relative hover:text-gray-500 transition-transform hover:scale-105">
              <ShoppingBag size={22} strokeWidth={1.2} />
              
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>
              {/* Mobil Menü Butonu */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800">
                 {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* --- MOBİL MENÜ --- */}
        {isOpen && (
          <div className="md:hidden bg-white fixed inset-0 z-40 pt-28 px-8 animate-in fade-in duration-200 overflow-y-auto pb-20">
             <div className="flex flex-col space-y-6">
                <Link to="/" onClick={() => setIsOpen(false)} className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">ANASAYFA</Link>
                
                {/* Mobilde Dinamik Kategoriler */}
                {categories.map((cat) => (
                    <div key={cat.id} className="flex flex-col">
                         <Link 
                            to={`/products?category=${cat.name}`} 
                            onClick={() => setIsOpen(false)} 
                            className="text-xl font-bold text-gray-900 mb-2 flex justify-between items-center"
                         >
                            {cat.name}
                         </Link>
                         <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-100 ml-1">
                             {cat.subCategories?.map(sub => (
                                 <Link key={sub.id} to={`/products?category=${cat.name}&subcategory=${sub.name}`} onClick={() => setIsOpen(false)} className="text-sm font-medium text-gray-500">
                                     {sub.name}
                                 </Link>
                             ))}
                         </div>
                    </div>
                ))}


                {!user && (
                    <button onClick={() => {setIsOpen(false); setIsAuthOpen(true);}} className="w-full bg-black text-white py-4 rounded text-sm font-bold tracking-widest uppercase mt-4">
                        GİRİŞ YAP
                    </button>
                )}
             </div>
          </div>
        )}
      </nav>

      {/* MODAL */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </>
  );
};

export default Navbar;