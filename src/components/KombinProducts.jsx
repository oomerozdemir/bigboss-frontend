import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const KombinProducts = ({ productId }) => {
  const [combinations, setCombinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchCombinations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}/combinations`);
        if (!res.ok) throw new Error('Veri çekilemedi');
        const data = await res.json();
        // Sadece aktif ürünleri göster
        setCombinations(data.filter(c => c.product.isActive));
      } catch (error) {
        console.error('Kombin ürünler hatası:', error);
        setCombinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinations();
  }, [productId]);

  if (loading || combinations.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-12">
      <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
        Kombin Önerisi
      </h2>
      <p className="text-gray-500 text-sm mb-8">Bu ürünle harika gider</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {combinations.map(({ combinationId, product }) => {
          const thumb =
            (product.variants?.[0]?.vImageUrls?.[0]) ||
            product.variants?.[0]?.vImageUrl ||
            product.imageUrl;

          const effectivePrice = product.isOnSale && product.discountPrice
            ? parseFloat(product.discountPrice)
            : parseFloat(product.price);

          const hasDiscount = product.isOnSale && product.discountPrice;

          return (
            <Link
              key={combinationId}
              to={`/product/${product.id}`}
              className="group block"
            >
              <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    Görsel yok
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    İndirimde
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:underline">
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.price)} TL
                  </span>
                )}
                <span className={`text-sm font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatPrice(effectivePrice)} TL
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default KombinProducts;
