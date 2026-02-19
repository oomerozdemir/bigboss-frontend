import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, LogOut, ShieldCheck, ChevronDown, Heart, Globe } from 'lucide-react';
import AuthModal from './AuthModel';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';

import logoImg from '../assets/bigbossLOGO.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { isAuthModalOpen, toggleAuthModal, closeAuthModal, openAuthModal } = useUI();
  const { t, i18n } = useTranslation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems } = useCart();
  const [categories, setCategories] = useState([]);

  const totalItems = React.useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((acc, item) => {
      const quantity = parseInt(item?.quantity) || 0;
      return acc + quantity;
    }, 0);
  }, [cartItems]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User parse error:", error);
        localStorage.removeItem("user");
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const navbarCats = data.filter(cat => cat?.isShowOnNavbar === true);
        setCategories(navbarCats);
      } else {
        console.error("Kategori verisi dizi değil:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Kategoriler yüklenemedi:", error);
      setCategories([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {/* Üst Bar (Duyuru/Kampanya Çubuğu) */}
      <div className="bg-black text-white text-center py-2 text-xs md:text-sm font-medium tracking-wide">
        <span className="inline-flex items-center gap-2">
          <span className="hidden md:inline">🎉</span>
          <span>{t('nav.free_shipping_announcement')}</span>
          <span className="font-bold text-yellow-400">{t('nav.free_shipping')}</span>
        </span>
      </div>

      <nav className={`sticky top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl shadow-lg py-3 border-b border-gray-100"
          : "bg-white py-5 shadow-sm"
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">

          <div className="flex justify-between items-center">

            {/* SOL: LOGO + ARAMA (Desktop) */}
            <div className="flex items-center gap-6 lg:gap-8 flex-1">
              <Link to="/" className="shrink-0 group">
                <img
                  src={logoImg}
                  alt="Big Boss"
                  className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Arama Çubuğu (Desktop) */}
              <div className="hidden lg:block flex-1 max-w-md">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t('nav.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-black focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </form>
              </div>
            </div>

            {/* SAĞ: AKSİYON BUTONLARI */}
            <div className="flex items-center gap-3 md:gap-5">

              {/* Mobil Arama Butonu */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden hover:text-gray-500 transition-colors p-2 hover:bg-gray-50 rounded-full"
              >
                <Search size={22} strokeWidth={1.5} />
              </button>

              {/* Favoriler */}
              <Link
                to="/favoriler"
                className="hidden md:flex hover:text-gray-500 transition-all hover:scale-110 p-2 hover:bg-gray-50 rounded-full relative group"
                title={t('nav.favorites')}
              >
                <Heart size={22} strokeWidth={1.5} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {t('nav.favorites')}
                </span>
              </Link>

              {/* Dil Değiştirici */}
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-1.5 p-2 hover:bg-gray-50 rounded-full text-gray-700 hover:text-black transition-colors">
                  <Globe size={20} strokeWidth={1.5} />
                  <span className="text-xs font-bold uppercase">{i18n.language === 'ar' ? 'AR' : 'TR'}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[80px]">
                  <button
                    onClick={() => handleLanguageChange('tr')}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${i18n.language === 'tr' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    🇹🇷 TR
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${i18n.language === 'ar' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    🇸🇦 AR
                  </button>
                </div>
              </div>

              {/* Kullanıcı Menüsü */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:text-gray-500 transition-colors p-2 hover:bg-gray-50 rounded-full">
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={14} className="hidden md:block group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">

                    {/* Header */}
                    <div className="px-3 py-3 border-b border-gray-100 mb-2 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{t('nav.welcome')}</p>
                      <p className="text-base font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link
                        to="/hesabim"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all group/item"
                      >
                        <User size={16} className="text-gray-400 group-hover/item:text-gray-700" />
                        <span>{t('nav.my_account')}</span>
                      </Link>

                      {user.isAdmin && (
                        <Link
                          to="/admin-panel"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <ShieldCheck size={16} />
                          <span>{t('nav.admin_panel')}</span>
                        </Link>
                      )}

                      <Link
                        to="/hesabim"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                      >
                        <ShoppingBag size={16} className="text-gray-400" />
                        {t('nav.my_orders')}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all mt-2 border-t border-gray-100 pt-3"
                      >
                        <LogOut size={16} />
                        <span className="font-medium">{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105"
                >
                  <User size={16} />
                  {t('nav.login')}
                </button>
              )}

              {/* Sepet */}
              <Link
                to="/sepet"
                className="relative hover:text-gray-500 transition-all hover:scale-110 p-2 hover:bg-gray-50 rounded-full group"
                title={t('nav.cart')}
              >
                <ShoppingBag size={23} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-in zoom-in duration-300 border-2 border-white">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"></span>
                  </>
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {t('nav.cart')}
                </span>
              </Link>

              {/* Mobil Menü Butonu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>

          {/* Kategoriler (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">

            <Link
              to="/"
              className="text-xs font-bold text-gray-700 hover:text-black tracking-widest uppercase transition-all relative group py-1"
            >
              {t('nav.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </Link>

            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((mainCat) => {
                if (!mainCat?.id || !mainCat?.name) return null;

                return (
                  <div key={mainCat.id} className="group/cat relative">
                    <Link
                      to={`/products?category=${encodeURIComponent(mainCat.name)}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black tracking-widest uppercase transition-all py-1 relative"
                    >
                      {mainCat.name}
                      {mainCat.subCategories?.length > 0 && (
                        <ChevronDown size={12} className="group-hover/cat:rotate-180 transition-transform duration-300"/>
                      )}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover/cat:w-full transition-all duration-300"></span>
                    </Link>

                    {/* Mega Dropdown */}
                    {Array.isArray(mainCat.subCategories) && mainCat.subCategories.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 transform translate-y-2 group-hover/cat:translate-y-0">
                        <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden min-w-[220px]">
                          <div className="p-2">
                            {mainCat.subCategories.map((sub) => {
                              if (!sub?.id || !sub?.name) return null;

                              return (
                                <Link
                                  key={sub.id}
                                  to={`/products?category=${encodeURIComponent(mainCat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                  className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all group/sub"
                                >
                                  <span className="flex items-center justify-between">
                                    {sub.name}
                                    <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Mobil Arama Çubuğu (Açılır Panel) */}
        {searchOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg p-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('nav.search_placeholder_mobile')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>
          </div>
        )}

        {/* MOBİL MENÜ (Sidebar) */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="lg:hidden fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">

              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <h2 className="text-xl font-black tracking-tight">{t('nav.menu')}</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">

                {/* Dil Değiştirici (Mobil) */}
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => handleLanguageChange('tr')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${i18n.language === 'tr' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200'}`}
                  >
                    🇹🇷 Türkçe
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${i18n.language === 'ar' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200'}`}
                  >
                    🇸🇦 العربية
                  </button>
                </div>

                {/* User Section */}
                {user ? (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-600 text-white p-4 rounded-2xl mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs opacity-80">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/hesabim"
                      onClick={() => setIsOpen(false)}
                      className="block w-full bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {t('nav.view_account')}
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                        setIsOpen(false);
                        openAuthModal();
                    }}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors mb-6"
                  >
                    {t('nav.login_register')}
                  </button>
                )}

                {/* Navigation */}
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-bold text-gray-900 hover:text-black py-3 border-b border-gray-100 transition-colors"
                >
                  🏠 {t('nav.home')}
                </Link>

                {Array.isArray(categories) && categories.length > 0 && categories.map((cat) => {
                  if (!cat?.id || !cat?.name) return null;

                  return (
                    <div key={cat.id} className="border-b border-gray-100 pb-3">
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-bold text-gray-900 hover:text-black flex justify-between items-center py-2 transition-colors"
                      >
                        {cat.name}
                        {cat.subCategories?.length > 0 && <ChevronDown size={18} />}
                      </Link>

                      {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                          {cat.subCategories.map(sub => {
                            if (!sub?.id || !sub?.name) return null;

                            return (
                              <Link
                                key={sub.id}
                                to={`/products?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                onClick={() => setIsOpen(false)}
                                className="block text-sm font-medium text-gray-600 hover:text-black py-1.5 transition-colors"
                              >
                                → {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bottom Actions */}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium transition-colors mt-6"
                  >
                    <LogOut size={18} />
                    {t('nav.logout')}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </nav>

      {/* GLOBAL AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
};

export default Navbar;
