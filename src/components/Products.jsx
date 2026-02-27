import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMainCat, setActiveMainCat] = useState("Tümü");
  const [activeSubCat, setActiveSubCat] = useState("Tümü");
  const [loading, setLoading] = useState(true);
  
  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8; // Her sayfada 8 ürün göster

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        
        // Kategorileri getir
        const catRes = await fetch(`${apiUrl}/api/categories`);
        const catData = await catRes.json();
        
        if (Array.isArray(catData)) {
          const featuredCats = catData.filter(c => c?.isShowOnNavbar === true);
          setCategories(featuredCats);
        } else {
          console.error("Kategori verisi dizi değil:", catData);
          setCategories([]);
        }

        // Ürünleri getir
        const prodRes = await fetch(`${apiUrl}/api/products?isFeatured=true&limit=100`);
        const prodData = await prodRes.json();
        
        let productsArray = [];
        if (Array.isArray(prodData)) {
          productsArray = prodData;
        } else if (prodData?.products && Array.isArray(prodData.products)) {
          productsArray = prodData.products;
        }
        
        setProducts(productsArray);
        setLoading(false);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setProducts([]);
        setCategories([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Ana kategoriye göre ürünleri filtrele
  const productsInMainCategory = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    if (activeMainCat === "Tümü") {
      return products;
    }

    return products.filter(product => {
      if (!product?.categories || !Array.isArray(product.categories)) return false;
      return product.categories.some(cat => cat?.mainCategory?.name === activeMainCat);
    });
  }, [products, activeMainCat]);

  // ✅ Alt kategorileri dinamik hesapla
  const availableSubCategories = useMemo(() => {
    if (!Array.isArray(productsInMainCategory)) return ["Tümü"];
    
    const subCats = new Set(["Tümü"]);
    
    productsInMainCategory.forEach(p => {
      if (p?.categories && Array.isArray(p.categories)) {
        p.categories.forEach(c => {
          if (c?.name && c.name !== "Standart") {
            subCats.add(c.name);
          }
        });
      }
    });
    
    return Array.from(subCats);
  }, [productsInMainCategory]);

  // ✅ Alt kategoriye göre filtrele
  const displayProducts = useMemo(() => {
    if (!Array.isArray(productsInMainCategory)) return [];
    
    if (activeSubCat === "Tümü") {
      return productsInMainCategory;
    }

    return productsInMainCategory.filter(product => {
      if (!product?.categories || !Array.isArray(product.categories)) return false;
      return product.categories.some(cat => cat?.name === activeSubCat);
    });
  }, [productsInMainCategory, activeSubCat]);

  // ✅ PAGINATION HESAPLAMALARI
  const totalPages = Math.ceil(displayProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = displayProducts.slice(startIndex, endIndex);

  // Kategori değiştiğinde sayfayı resetle
  useEffect(() => {
    setCurrentPage(1);
  }, [activeMainCat, activeSubCat]);

  // ✅ Pagination fonksiyonları
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Sayfa değişince scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMainCategoryChange = (catName) => {
    setActiveMainCat(catName);
    setActiveSubCat("Tümü");
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subCatName) => {
    setActiveSubCat(subCatName);
    setCurrentPage(1);
  };

  // ✅ Sayfa numaralarını hesapla (max 5 sayfa göster)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* BAŞLIK */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">
          En Çok Satanlar
        </h2>
        <p className="text-gray-500 text-sm">
          {loading ? "Yükleniyor..." : `${displayProducts.length} ürün bulundu`}
        </p>
      </div>

      {/* KATEGORİ FİLTRELEME */}
      <div className="mb-8">
        {/* Ana Kategoriler */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <button
            onClick={() => handleMainCategoryChange("Tümü")}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeMainCat === "Tümü"
                ? "bg-black text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tümü
          </button>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((cat) => {
              if (!cat?.id || !cat?.name) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleMainCategoryChange(cat.name)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeMainCat === cat.name
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })
          ) : (
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
              ))}
            </div>
          )}
        </div>

        {/* Alt Kategoriler */}
        {Array.isArray(availableSubCategories) && availableSubCategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategoryChange(sub)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeSubCat === sub
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ÜRÜN GRID */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-52 sm:h-72 lg:h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : Array.isArray(currentProducts) && currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 mb-8">
            {currentProducts.map((product) => {
              if (!product?.id) return null;
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>

          {/* ✅ PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Önceki sayfa"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-black text-white shadow-lg"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Sonraki sayfa"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Sayfa Bilgisi */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Sayfa {currentPage} / {totalPages} - Toplam {displayProducts.length} ürün
          </div>
        </>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-xl font-bold text-gray-800 mb-2">Ürün Bulunamadı</p>
          <p className="text-gray-500">Seçili kategoride ürün yok.</p>
        </div>
      )}
    </div>
  );
};

export default Products;