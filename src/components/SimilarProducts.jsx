import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimilarProducts = ({ currentCategory, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        // Hata olsa bile boş dizi ile devam etmesi için try-catch
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        
        if (!res.ok) throw new Error("Veri çekilemedi");
        
        const data = await res.json();
        
        // Veri dizi mi kontrol et, değilse boş dizi ata
        const allProducts = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);

        // Şu anki ürün haricindeki aynı kategorideki ürünleri filtrele
        const filtered = allProducts.filter(p => 
          p.id !== currentProductId && 
          p.categories?.some(c => c.name === currentCategory)
        ).slice(0, 4); // Sadece 4 tane göster

        setProducts(filtered);
      } catch (error) {
        console.error("Benzer ürünler hatası:", error);
        setProducts([]); // Hata durumunda boş dizi ata (Sayfa patlamasın)
      } finally {
        setLoading(false);
      }
    };

    if (currentCategory) {
      fetchSimilarProducts();
    }
  }, [currentCategory, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6">Benzer Ürünler</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            onClick={() => {
              navigate(`/product/${product.id}`);
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer group"
          >
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.style.display = 'none'; // Resim yüklenmezse gizle
                    e.target.parentElement.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
                    e.target.parentElement.innerHTML = '<span class="text-gray-400 text-xs">Görsel Yok</span>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Görsel Yok
                </div>
              )}
            </div>
            <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
            <p className="text-sm font-bold text-gray-900 mt-1">{product.price} TL</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;