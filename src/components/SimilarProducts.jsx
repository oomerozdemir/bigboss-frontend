import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const SimilarProducts = ({ currentProduct }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        // Tüm ürünleri çek (Gerçek senaryoda backend'e kategori ID gönderilir, şimdilik böyle filtreliyoruz)
        const res = await fetch("http://localhost:5000/api/products");
        const allProducts = await res.json();

        // Şu anki ürünün kategorilerini al
        const currentCatNames = currentProduct.categories?.map(c => c.name) || [];

        const filtered = allProducts.filter(p => 
          p.id !== currentProduct.id && 
          p.categories?.some(c => currentCatNames.includes(c.name))
        );

        // İlk 4 ürünü al
        setSimilarProducts(filtered.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Benzer ürünler hatası:", error);
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchSimilar();
    }
  }, [currentProduct]);

  if (loading || similarProducts.length === 0) return null;

  return (
    <div className="mt-24 border-t border-gray-100 pt-16">
      <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
        Bunu Beğenenler Şunlara da Baktı
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {similarProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;