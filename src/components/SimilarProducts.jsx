import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard'; // Import edildiğinden emin olun

const SimilarProducts = ({ currentProduct }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        
        if (!res.ok) throw new Error("Veri çekilemedi");
        
        const data = await res.json();
        
        // Veri güvenliği kontrolü
        const allProducts = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);

        const currentCatNames = currentProduct?.categories?.map(c => c.name) || [];

        const filtered = allProducts.filter(p => 
          p.id !== currentProduct?.id && 
          p.categories?.some(c => currentCatNames.includes(c.name))
        ).slice(0, 4);

        setSimilarProducts(filtered);
      } catch (error) {
        console.error("Benzer ürünler hatası:", error);
        setSimilarProducts([]);
      } finally {
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