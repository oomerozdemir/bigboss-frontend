import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]); // Dinamik kategoriler
  const [loading, setLoading] = useState(true); 
  
  const [activeMainCat, setActiveMainCat] = useState(""); // Başlangıçta boş, veriden gelecek
  const [activeSubCat, setActiveSubCat] = useState("Tümü");

  const navigate = useNavigate();

  // --- TEK SEFERDE VERİLERİ ÇEK ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ürünleri Çek
        const productRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const productData = await productRes.json();
        setProducts(productData);

        // 2. Kategorileri Çek
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const catData = await catRes.json();

        // 3. Sadece Admin'in "Navbar'da Göster" dediklerini filtrele
        const featuredCats = catData.filter(c => c.isShowOnNavbar === true);
        setCategories(featuredCats);

        // 4. İlk kategoriyi varsayılan olarak seç (Eğer kategori varsa)
        if (featuredCats.length > 0) {
          setActiveMainCat(featuredCats[0].name);
        }

        setLoading(false);
      } catch (error) {
        console.error("Veri hatası:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  // --- FİLTRELEME MANTIĞI ---
  
  // 1. Seçili Ana Kategoriye Ait Ürünleri Bul
  const productsInMainCategory = products.filter(product => {
    if (product.categories && Array.isArray(product.categories)) {
      // Ürünün herhangi bir alt kategorisinin bağlı olduğu Ana Kategori, şu an seçili olana eşit mi?
      return product.categories.some(cat => cat.mainCategory?.name === activeMainCat);
    }
    return false;
  });

  // 2. Bu ürünlerden Alt Kategorileri Çıkar (Gömlek, Pantolon vs.)
  const allSubCats = productsInMainCategory.flatMap(p => 
    p.categories
      ? p.categories.filter(c => c.mainCategory?.name === activeMainCat).map(c => c.name)
      : []
  );
  // Benzersiz alt kategorileri listele ve başına "Tümü" ekle
  const availableSubCategories = ["Tümü", ...new Set(allSubCats)];

  // 3. Ekrana Basılacak Ürünleri Filtrele (Alt kategori seçimine göre)
  const displayProducts = productsInMainCategory
    .filter(p => {
      if (activeSubCat === "Tümü") return true;
      return p.categories?.some(cat => cat.name === activeSubCat);
    })
    .slice(0, 8); // Sadece ilk 8 ürünü göster (Vitrin olduğu için)

  // Kategori Değiştirme
  const handleMainCatChange = (catName) => {
    setActiveMainCat(catName);
    setActiveSubCat("Tümü"); // Kategori değişince alt filtreyi sıfırla
  };

  // Tümünü Gör Butonu
  const handleSeeAllClick = () => {
    navigate('/products', { state: { category: activeMainCat } });
  };

  if (loading) return <div className="text-center py-32 text-xs tracking-widest uppercase animate-pulse">Yükleniyor...</div>;

  return (
    <div className="bg-white py-24 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* BAŞLIK VE SEKME ALANI */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-2">Seçkiler</h2>
                <p className="text-gray-500 text-sm font-light tracking-wide">Sezonun öne çıkan en güçlü parçaları.</p>
            </div>

            {/* DİNAMİK KATEGORİ TABLARI */}
            <div className="flex gap-6 border-b border-gray-100 pb-1 overflow-x-auto scrollbar-hide">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => handleMainCatChange(cat.name)}
                            className={`text-xs font-bold uppercase tracking-widest pb-3 transition-all whitespace-nowrap ${
                                activeMainCat === cat.name 
                                ? "text-black border-b-2 border-black" 
                                : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))
                ) : (
                    <span className="text-gray-400 text-xs pb-3">Kategori Bulunamadı</span>
                )}
            </div>
        </div>

        {/* ALT KATEGORİ BUTONLARI */}
        {availableSubCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 animate-in fade-in slide-in-from-left-2 duration-500">
            {availableSubCategories.map((sub) => (
                <button 
                key={sub}
                onClick={() => setActiveSubCat(sub)}
                className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeSubCat === sub 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-black"
                }`}
                >
                {sub}
                </button>
            ))}
            </div>
        )}

        {/* ÜRÜN VİTRİNİ */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-sm">
            <p className="text-gray-400 text-xs tracking-widest uppercase">
                {activeMainCat} kategorisinde henüz ürün yok.
            </p>
          </div>
        )}

        {/* TÜMÜNÜ GÖR BUTONU */}
        <div className="mt-16 text-center border-t border-gray-100 pt-10">
          <button 
            onClick={handleSeeAllClick} 
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-600 transition"
          >
            <span>{activeMainCat} Koleksiyonunu İncele</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Products;