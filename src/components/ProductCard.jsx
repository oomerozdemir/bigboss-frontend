import React, { useState } from 'react';
import { ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext'; // ✅ YENİ: Context Import Edildi
import { useTranslation } from 'react-i18next';
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import { formatPrice } from '../utils/formatPrice';

const ProductCard = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { openAuthModal } = useUI(); // ✅ YENİ: Modal açma fonksiyonu alındı
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translatedName = useAutoTranslate(product?.name || '');

  if (!product || !product.id) {
    return null;
  }

  const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  const getInitialImage = () => {
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const variantWithImage = product.variants.find(v => v?.vImageUrl && v.vImageUrl.trim() !== '');
      if (variantWithImage) {
        return variantWithImage.vImageUrl;
      }
    }
    return FALLBACK_IMAGE;
  };

  const [activeImage, setActiveImage] = useState(getInitialImage());
  const [imageError, setImageError] = useState(false);

  const liked = isFavorite(product.id);

  // İndirim Hesaplama
  const hasDiscount = product.isOnSale && product.discountPrice && product.discountPrice < product.price;
  
  const discountPercent = hasDiscount 
    ? Math.round((1 - parseFloat(product.discountPrice) / parseFloat(product.price)) * 100)
    : 0;

  const uniqueSizes = React.useMemo(() => {
    if (!Array.isArray(product.variants)) return [];
    const sizes = product.variants
      .filter(v => v && v.stock > 0 && v.size && v.size !== 'Standart' && v.size !== 'STD')
      .map(v => v.size);
    const unique = [...new Set(sizes)];
    const sizeOrder = { 'XXS': 1, 'XS': 2, 'S': 3, 'M': 4, 'L': 5, 'XL': 6, 'XXL': 7, '2XL': 8, '3XL': 9 };
    return unique.sort((a, b) => (sizeOrder[a] || 99) - (sizeOrder[b] || 99));
  }, [product.variants]);

  const uniqueColors = React.useMemo(() => {
    if (!Array.isArray(product.variants)) return [];
    const colorMap = new Map();
    product.variants.forEach(variant => {
      if (!variant || !variant.color || variant.color === "Standart") return;
      if (variant.vImageUrl && variant.vImageUrl.trim() !== '') {
        if (!colorMap.has(variant.color)) {
          colorMap.set(variant.color, { color: variant.color, image: variant.vImageUrl });
        }
      }
    });
    return Array.from(colorMap.values());
  }, [product.variants]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      // ✅ YENİ: Giriş yapılmamışsa Favori için de Modalı Aç
      openAuthModal();
      return;
    }
    await toggleFavorite(product.id);
    toast.success(liked ? t('product.removed_from_favorites') : t('product.added_to_favorites'));
  };

  const handleColorClick = (e, variantImage) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantImage && variantImage.trim() !== '') {
      setActiveImage(variantImage);
      setImageError(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    // ✅ YENİ: Token Kontrolü (Giriş Yapılmış mı?)
    const token = localStorage.getItem("token");
    if (!token) {
        openAuthModal(); // Giriş yapılmamışsa Modalı Aç
        return;
    }

    const variantToAdd = Array.isArray(product.variants) 
      ? product.variants.find(v => v && v.stock > 0)
      : null;

    if (variantToAdd) {
        addToCart(product, variantToAdd, 1);
        navigate('/sepet'); 
    } else {
        toast.error(t('product.no_stock_error'));
    }
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      e.target.src = FALLBACK_IMAGE;
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="flex flex-col h-full">
        
        {/* --- GÖRSEL ALANI --- */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4 rounded-lg">
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <ImageOff size={48} className="text-gray-300 mb-2" />
              <span className="text-xs text-gray-400 font-medium">Görsel Yok</span>
            </div>
          ) : (
            <img 
              src={activeImage} 
              alt={product.name || 'Ürün'} 
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
          )}

          <button 
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white shadow-sm"
          >
            <Heart 
              size={18} 
              className={liked ? "fill-black text-black" : "text-black"} 
              strokeWidth={1.5}
            />
          </button>
          
          {hasDiscount && (
             <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm rounded">
               %{discountPercent} İNDİRİM
             </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
             <button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0} 
                className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded"
             >
                <ShoppingCart size={16} />
                {product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
             </button>
          </div>
        </div>

        {/* --- DETAYLAR --- */}
        <div className="flex flex-col gap-1">
          {/* Renk Seçenekleri */}
          {Array.isArray(uniqueColors) && uniqueColors.length > 0 && (
              <div className="flex gap-1.5 mb-1 h-4">
                  {uniqueColors.slice(0, 5).map((item, index) => (
                      <button 
                          key={`${item.color}-${index}`}
                          onClick={(e) => handleColorClick(e, item.image)}
                          className={`w-3 h-3 rounded-full border border-gray-200 overflow-hidden ${activeImage === item.image ? "ring-1 ring-black ring-offset-1" : ""}`}
                          title={item.color}
                      >
                         <img 
                           src={item.image} 
                           className="w-full h-full object-cover" 
                           alt={item.color}
                           onError={(e) => { e.target.style.display = 'none'; }}
                           loading="lazy"
                         />
                      </button>
                  ))}
                  {uniqueColors.length > 5 && (
                    <span className="text-[9px] text-gray-400 self-center">+{uniqueColors.length - 5}</span>
                  )}
              </div>
          )}

          <h3 className="text-sm text-gray-900 font-medium leading-tight line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
            {translatedName || product.name || t('product.product_name_fallback')}
          </h3>

          {/* Bedenler */}
          {Array.isArray(uniqueSizes) && uniqueSizes.length > 0 && (
            <div className="flex flex-wrap gap-1 my-1">
                {uniqueSizes.slice(0, 6).map((size, i) => (
                    <span key={`${size}-${i}`} className="text-[9px] border border-gray-200 bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded-sm">
                        {size}
                    </span>
                ))}
                {uniqueSizes.length > 6 && (
                  <span className="text-[9px] text-gray-400 self-center">+{uniqueSizes.length - 6}</span>
                )}
            </div>
          )}
          
          <div className="mt-1 flex items-center gap-2">
            {hasDiscount ? (
                <>
                    <span className="text-xs text-gray-400 line-through font-medium">
                        {formatPrice(product.price)} TL
                    </span>
                    <span className="text-sm font-bold text-red-600">
                        {formatPrice(product.discountPrice)} TL
                    </span>
                </>
            ) : (
                <span className="text-sm font-bold text-gray-900">
                    {product.price ? `${formatPrice(product.price)} TL` : 'Fiyat Belirtilmemiş'}
                </span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;