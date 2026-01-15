import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import ProductCard from '../components/ProductCard';
import { Search, ArrowUpDown, Filter } from 'lucide-react'; 
import { useLocation } from 'react-router-dom';

const ProductListPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FİLTRE STATE'LERİ ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  
  // Kategori State'leri
  const [mainCategories, setMainCategories] = useState(["Tümü"]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(
    location.state?.category || "Tümü"
  );

  const [availableSubCategories, setAvailableSubCategories] = useState(["Tümü"]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("Tümü");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL; 
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      
      // ✅ DÜZELTME 1: Ürün verisi formatı kontrolü
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data?.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else {
        console.error("Beklenmeyen ürün verisi formatı:", data);
      }
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);

      // ✅ DÜZELTME 2: Ana kategorileri çıkart - Güvenli
      const uniqueMainCats = new Set(["Tümü"]);
      
      if (Array.isArray(productsArray)) {
        productsArray.forEach(p => {
          if (p?.categories && Array.isArray(p.categories)) {
            p.categories.forEach(subCat => {
              if (subCat?.mainCategory?.name) {
                uniqueMainCats.add(subCat.mainCategory.name);
              }
            });
          }
        });
      }
      
      setMainCategories(Array.from(uniqueMainCats));
      setLoading(false);
    } catch (error) {
      console.error("Fetch Products Error:", error);
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
    }
  };

  // ✅ DÜZELTME 3: DİNAMİK ALT KATEGORİ HESAPLAMA - Güvenli
  useEffect(() => {
    setSelectedSubCategory("Tümü");

    const subCats = new Set(["Tümü"]);

    if (Array.isArray(products)) {
      products.forEach(p => {
        if (p?.categories && Array.isArray(p.categories)) {
          p.categories.forEach(c => {
            const mainCatName = c?.mainCategory?.name;
            if (selectedMainCategory === "Tümü" || mainCatName === selectedMainCategory) {
              if (c?.name) {
                subCats.add(c.name);
              }
            }
          });
        }
      });
    }

    setAvailableSubCategories(Array.from(subCats));
  }, [selectedMainCategory, products]);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedMainCategory(location.state.category);
    }
  }, [location.state]);

  // ✅ DÜZELTME 4: GENEL FİLTRELEME MANTIĞI - Tamamen güvenli
  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let result = [...products];

    // 1. Arama Filtresi
    if (searchTerm) {
      result = result.filter(p => {
        const name = p?.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // 2. Ana Kategori Filtresi
    if (selectedMainCategory !== "Tümü") {
      result = result.filter(p => {
        if (!p?.categories || !Array.isArray(p.categories)) return false;
        return p.categories.some(c => c?.mainCategory?.name === selectedMainCategory);
      });
    }

    // 3. Alt Kategori Filtresi
    if (selectedSubCategory !== "Tümü") {
      result = result.filter(p => {
        if (!p?.categories || !Array.isArray(p.categories)) return false;
        return p.categories.some(c => c?.name === selectedSubCategory);
      });
    }

    // 4. Sıralama
    if (sortOption === "price-asc") {
      result.sort((a, b) => {
        const priceA = parseFloat(a?.price) || 0;
        const priceB = parseFloat(b?.price) || 0;
        return priceA - priceB;
      });
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => {
        const priceA = parseFloat(a?.price) || 0;
        const priceB = parseFloat(b?.price) || 0;
        return priceB - priceA;
      });
    } else if (sortOption === "newest") {
      result.sort((a, b) => {
        const dateA = new Date(a?.createdAt || 0);
        const dateB = new Date(b?.createdAt || 0);
        return dateB - dateA;
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedMainCategory, selectedSubCategory, sortOption, products]);

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- BAŞLIK ALANI --- */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">
                {selectedMainCategory === "Tümü" ? "TÜM ÜRÜNLER" : selectedMainCategory}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <span>Tarzını yansıtan en iyi parçalar.</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="font-bold text-black bg-gray-200 px-2 py-0.5 rounded-md">
                    {loading ? "..." : (Array.isArray(filteredProducts) ? filteredProducts.length : 0)} Ürün
                </span>
            </div>
          </div>

          {/* --- FİLTRE ALANI --- */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8 sticky top-20 z-30">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                
                {/* ✅ DÜZELTME 5: Ana Kategori Butonları - Güvenli */}
                <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto scrollbar-hide">
                    {Array.isArray(mainCategories) && mainCategories.length > 0 ? (
                      mainCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedMainCategory(cat)}
                          className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                              selectedMainCategory === cat 
                              ? "bg-black text-white shadow-lg transform scale-105" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))
                    ) : (
                      <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                        ))}
                      </div>
                    )}
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-56">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Ara..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none cursor-pointer text-sm font-medium h-full hover:bg-gray-100"
                        >
                            <option value="newest">En Yeniler</option>
                            <option value="price-asc">Artan Fiyat</option>
                            <option value="price-desc">Azalan Fiyat</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ✅ DÜZELTME 6: Alt Kategori Butonları - Güvenli */}
            {Array.isArray(availableSubCategories) && availableSubCategories.length > 1 && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden md:block">Filtrele:</span>
                    <div className="flex gap-2 overflow-x-auto pb-1 w-full scrollbar-hide">
                        {availableSubCategories.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubCategory(sub)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                    selectedSubCategory === sub 
                                    ? "bg-black text-white border-black" 
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* --- SONUÇLAR --- */}
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>)}
             </div>
          ) : Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                // ✅ Her ürünü kontrol et
                if (!product?.id) return null;
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Filter size={32} className="text-gray-400"/>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Sonuç Bulunamadı</h3>
                <p className="text-gray-500 mt-2">
                    {selectedMainCategory !== "Tümü" ? `${selectedMainCategory} > ${selectedSubCategory}` : "Yapılan arama"} için ürün yok.
                </p>
                <button 
                    onClick={() => {
                        setSearchTerm(""); 
                        setSelectedMainCategory("Tümü");
                        setSelectedSubCategory("Tümü");
                    }}
                    className="mt-6 text-black font-bold underline hover:text-gray-600"
                >
                    Filtreleri Temizle
                </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ProductListPage;