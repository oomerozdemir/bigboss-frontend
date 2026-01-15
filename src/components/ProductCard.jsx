import React, { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext'; 

const ProductCard = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart(); 
  const navigate = useNavigate();  
  
  // ✅ DÜZELTME 1: Ürün kontrolü
  if (!product || !product.id) {
    return null;
  }

  // ✅ DÜZELTME 2: Ana resim kontrolü - Güvenli
  const initialImage = product.imageUrl 
    ? product.imageUrl 
    : (Array.isArray(product.variants) && product.variants.find(v => v?.vImageUrl)?.vImageUrl) 
    || "https://via.placeholder.com/400x500?text=No+Image";

  const [activeImage, setActiveImage] = useState(initialImage);

  const liked = isFavorite(product.id);

  // ✅ DÜZELTME 3: Bedenleri Ayıkla ve Sırala - Tamamen güvenli
  const uniqueSizes = React.useMemo(() => {
    if (!Array.isArray(product.variants)) return [];
    
    const sizes = product.variants
      .filter(v => v && v.stock > 0 && v.size && v.size !== 'Standart' && v.size !== 'STD')
      .map(v => v.size);
    
    const unique = [...new Set(sizes)];
    
    // Beden Sıralama Mantığı
    const sizeOrder = { 
      'XXS': 1, 'XS': 2, 'S': 3, 'M': 4, 'L': 5, 
      'XL': 6, 'XXL': 7, '2XL': 8, '3XL': 9 
    };
    
    return unique.sort((a, b) => {
      const orderA = sizeOrder[a] || 99;
      const orderB = sizeOrder[b] || 99;
      return orderA - orderB;
    });
  }, [product.variants]);

  // ✅ DÜZELTME 4: Renkleri Ayıkla - Güvenli
  const uniqueColors = React.useMemo(() => {
    if (!Array.isArray(product.variants)) return [];
    
    const colorMap = new Map();
    
    product.variants.forEach(variant => {
      if (!variant || !variant.color || variant.color === "Standart") return;
      
      if (!colorMap.has(variant.color)) {
        colorMap.set(variant.color, {
          color: variant.color,
          image: variant.vImageUrl
        });
      }
    });
    
    return Array.from(colorMap.values());
  }, [product.variants]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }
    await toggleFavorite(product.id);
    toast.success(liked ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  const handleColorClick = (e, variantImage) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantImage) setActiveImage(variantImage);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    // ✅ DÜZELTME 5: Varyant bulma - Güvenli
    const variantToAdd = Array.isArray(product.variants) 
      ? product.variants.find(v => v && v.stock > 0)
      : null;

    if (variantToAdd) {
        addToCart(product, variantToAdd, 1);
        navigate('/sepet'); 
    } else {
        toast.error("Ürün stokta yok veya beden seçilemedi.");
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="flex flex-col h-full">
        
        {/* --- GÖRSEL ALANI --- */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
          <img 
            src={activeImage} 
            alt={product.name || 'Ürün'} 
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-110"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x500?text=No+Image";
            }}
          />

          <button 
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 z-20 p-2 rounded-full transition-all hover:bg-white/90"
          >
            <Heart 
              size={18} 
              className={liked ? "fill-black text-black" : "text-black"} 
              strokeWidth={1.5}
            />
          </button>
          
          {product.discount > 0 && (
             <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
               %{product.discount} İndirim
             </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
             <button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0} 
                className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ShoppingCart size={16} />
                {product.stock === 0 ? "Tükendi" : "Sepete Ekle"}
             </button>
          </div>
        </div>

        {/* --- DETAYLAR --- */}
        <div className="flex flex-col gap-1">
          {/* ✅ DÜZELTME 6: Renk Seçenekleri - Güvenli render */}
          {Array.isArray(uniqueColors) && uniqueColors.length > 0 && (
              <div className="flex gap-1.5 mb-1 h-4">
                  {uniqueColors.map((item, index) => (
                      <button 
                          key={`${item.color}-${index}`}
                          onClick={(e) => handleColorClick(e, item.image)}
                          className={`w-3 h-3 rounded-full border border-gray-200 ${activeImage === item.image ? "ring-1 ring-black ring-offset-1" : ""}`}
                          style={{ backgroundColor: item.image ? 'transparent' : 'gray' }} 
                      >
                         {item.image && (
                           <img 
                             src={item.image} 
                             className="w-full h-full rounded-full object-cover" 
                             alt={item.color}
                             onError={(e) => {
                               e.target.style.display = 'none';
                             }}
                           />
                         )}
                      </button>
                  ))}
              </div>
          )}

          <h3 className="text-sm text-gray-900 font-medium leading-tight line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
            {product.name || 'Ürün Adı'}
          </h3>

          {/* ✅ DÜZELTME 7: Bedenler - Güvenli render */}
          {Array.isArray(uniqueSizes) && uniqueSizes.length > 0 && (
            <div className="flex flex-wrap gap-1 my-1">
                {uniqueSizes.map((size, i) => (
                    <span key={`${size}-${i}`} className="text-[9px] border border-gray-200 bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded-sm">
                        {size}
                    </span>
                ))}
            </div>
          )}
          
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {product.price ? `${product.price} TL` : 'Fiyat Belirtilmemiş'}
            </span>
            {product.discount > 0 && product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {(parseFloat(product.price) * 1.2).toFixed(2)} TL
                </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;