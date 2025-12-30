import React, { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 useNavigate eklendi
import toast from 'react-hot-toast';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext'; // 👈 useCart eklendi
import { sortVariantsByOrder } from '../utils/sortHelpers';

const ProductCard = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart(); // 👈 Sepet fonksiyonunu al
  const navigate = useNavigate();  // 👈 Yönlendirme için
  
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const liked = isFavorite(product.id);
  const sortedVariants = sortVariantsByOrder(product.variants || []);

  const uniqueColors = product.variants?.reduce((acc, variant) => {
    if (!variant.color || variant.color === "Standart") return acc;
    if (!acc.find(item => item.color === variant.color)) {
      acc.push({
        color: variant.color,
        image: variant.vImageUrl 
      });
    }
    return acc;
  }, []) || [];

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

  // 👇 YENİ: Sepete Ekle ve Yönlendir Fonksiyonu
  const handleAddToCart = (e) => {
    e.preventDefault(); // Link'e gitmeyi engelle
    e.stopPropagation(); // Tıklamanın yukarı taşınmasını engelle

    // Vitrinde beden seçilmediği için, stokta olan İLK bedeni otomatik seçelim
    const variantToAdd = product.variants?.find(v => v.stock > 0);

    if (variantToAdd) {
        // Sepete Ekle
        addToCart(product, variantToAdd, 1);
        
        // Sepet Sayfasına Yönlendir (Otomatik Gitme)
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
            src={activeImage || "https://via.placeholder.com/400x500?text=No+Image"} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />

          {/* Favori Butonu */}
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
          
          {/* İndirim Etiketi */}
          {product.discount > 0 && (
             <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
               %{product.discount} İndirim
             </span>
          )}

          {/* Hızlı Sepet (Hoverda Çıkar) - BUTONA FONKSİYONU BAĞLADIK */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
             <button 
                onClick={handleAddToCart} // 👈 Tıklama olayı buraya bağlandı
                disabled={product.stock === 0} 
                className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2"
             >
                <ShoppingCart size={16} />
                {product.stock === 0 ? "Tükendi" : "Sepete Ekle"}
             </button>
          </div>
        </div>

        {/* --- DETAYLAR --- */}
        <div className="flex flex-col gap-1">
          {/* Renk Seçenekleri */}
          {uniqueColors.length > 0 && (
              <div className="flex gap-1.5 mb-1 h-4">
                  {uniqueColors.map((item, index) => (
                      <button 
                          key={index}
                          onClick={(e) => handleColorClick(e, item.image)}
                          className={`w-3 h-3 rounded-full border border-gray-200 ${activeImage === item.image ? "ring-1 ring-black ring-offset-1" : ""}`}
                          style={{ backgroundColor: item.image ? 'transparent' : 'gray' }} 
                      >
                         {item.image && <img src={item.image} className="w-full h-full object-cover rounded-full" />}
                      </button>
                  ))}
              </div>
          )}

          <h3 className="text-sm text-gray-900 font-medium leading-tight line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
          
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{product.price} TL</span>
            {product.discount > 0 && (
                <span className="text-xs text-gray-400 line-through">{(product.price * 1.2).toFixed(2)} TL</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;