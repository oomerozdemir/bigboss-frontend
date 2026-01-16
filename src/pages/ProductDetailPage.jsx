import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, RefreshCcw, ShieldCheck, Star, Minus, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Reviews from '../components/Reviews';
import SimilarProducts from '../components/SimilarProducts';
import { sortVariantsByOrder } from '../utils/sortHelpers';

const ProductDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL; 
      const res = await fetch(`${apiUrl}/api/products/${id}`)
      if (!res.ok) throw new Error("Ürün bulunamadı");
      
      const data = await res.json();
      setProduct(data);
      
      let initialImage = data.imageUrl;
      if (!initialImage && data.variants && data.variants.length > 0) {
          const variantWithImage = data.variants.find(v => v.vImageUrl);
          if (variantWithImage) {
              initialImage = variantWithImage.vImageUrl;
          }
      }
      setActiveImage(initialImage || "https://via.placeholder.com/500x600?text=No+Image");

      if (data.variants && data.variants.length > 0) {
         const firstColorVariant = data.variants.find(v => v.color !== "Standart" && v.stock > 0);
         if (firstColorVariant) {
            setSelectedColor(firstColorVariant.color);
            // Eğer ana resim yoksa ve bu rengin resmi varsa onu seç
            if (!data.imageUrl && firstColorVariant.vImageUrl) {
                setActiveImage(firstColorVariant.vImageUrl);
            }
         }
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };


  const uniqueColors = product?.variants?.reduce((acc, v) => {
    if (v.color && v.color !== "Standart" && !acc.find(c => c.name === v.color)) {
      acc.push({ name: v.color, image: v.vImageUrl });
    }
    return acc;
  }, []) || [];

  const availableSizes = sortVariantsByOrder(
    product?.variants?.filter(v => 
        selectedColor ? v.color === selectedColor : true
    ) || []
  );

  const currentVariant = product?.variants?.find(v => 
    (selectedColor ? v.color === selectedColor : true) && 
    (selectedSize ? v.size === selectedSize : true)
  );

  const handleColorSelect = (colorName, colorImage) => {
    setSelectedColor(colorName);
    setSelectedSize(""); 
    if (colorImage) setActiveImage(colorImage); 
  };

const handleAddToCart = () => {
    // 1. Ürünün varyantları var mı?
    if (product.variants && product.variants.length > 0) {
        
        // A) Renk Seçimi Kontrolü
        if (uniqueColors.length > 0 && !selectedColor) {
            toast.error("Lütfen bir renk seçiniz.");
            return;
        }
        
        // B) Beden Seçimi Kontrolü
        if (availableSizes.length > 0 && !selectedSize) {
            toast.error("Lütfen bir beden seçiniz.");
            return;
        }

        // C) Varyant Eşleşme Kontrolü
        if (!currentVariant) {
            toast.error("Seçilen kombinasyon stokta bulunamadı.");
            return;
        }
        
        // D) Stok Kontrolü
        if (currentVariant.stock < quantity) {
            toast.error(`Yetersiz stok! En fazla ${currentVariant.stock} adet alabilirsiniz.`);
            return;
        }
    }

    addToCart(product, currentVariant, quantity);

    navigate('/sepet');
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("Giriş yapmalısınız");
        return;
    }
    await toggleFavorite(product.id);
    toast.success(isFavorite(product.id) ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Ürün bulunamadı.</div>;

  return (
    <>
      <div className="bg-white min-h-screen pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* SOL TARAF: GÖRSEL */}
            <div className="space-y-4">
               <div className="aspect-[4/5] w-full bg-gray-100 rounded-2xl overflow-hidden relative group">
                  <img 
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-top"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl border-2 border-white px-6 py-3 -rotate-12">TÜKENDİ</span>
                    </div>
                  )}
               </div>
            </div>

            {/* SAĞ TARAF: DETAYLAR */}
            <div>
               <div className="mb-6">
                 <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
                 <div className="flex items-center gap-4">
                    <span className="text-2xl font-medium text-gray-900">{product.price} TL</span>
                    {product.stock > 0 ? (
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Stokta Var</span>
                    ) : (
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Tükendi</span>
                    )}
                 </div>
               </div>

               {/* SEÇENEKLER */}
               <div className="space-y-6 border-t border-gray-100 pt-6">
                  
                  {/* 1. RENK SEÇİMİ */}
                  {uniqueColors.length > 0 && (
                    <div>
                        <span className="text-sm font-bold text-gray-900 block mb-3">Renk: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                        <div className="flex gap-3">
                            {uniqueColors.map((c, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleColorSelect(c.name, c.image)}
                                    className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all ${selectedColor === c.name ? "border-black scale-110" : "border-transparent hover:border-gray-300"}`}
                                >
                                    {c.image ? (
                                        <img src={c.image} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{c.name[0]}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                  )}

                  {/* 2. BEDEN SEÇİMİ */}
                  {availableSizes.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-gray-900">Beden</span>
                            <button className="text-xs text-gray-500 underline hover:text-black">Beden Tablosu</button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {availableSizes.map((v, i) => {
                                const isAvailable = v.stock > 0;
                                return (
                                    <button
                                        key={i}
                                        disabled={!isAvailable}
                                        onClick={() => setSelectedSize(v.size)}
                                        className={`py-3 rounded-lg text-sm font-medium border transition-all ${
                                            selectedSize === v.size 
                                            ? "bg-black text-white border-black" 
                                            : isAvailable 
                                                ? "bg-white text-gray-900 border-gray-200 hover:border-black" 
                                                : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice line-through"
                                        }`}
                                    >
                                        {v.size}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                  )}

                  {/* 3. ADET VE SEPET */}
                  <div className="flex gap-4 pt-4">
                     <div className="flex items-center border border-gray-300 rounded-full px-4 h-14">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-gray-500"><Minus size={18}/></button>
                        <span className="w-8 text-center font-bold">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-gray-500"><Plus size={18}/></button>
                     </div>

                     <button 
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 bg-black text-white h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                     >
                        <ShoppingCart size={20} />
                        {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
                     </button>

                     <button 
                        onClick={handleToggleFavorite}
                        className={`h-14 w-14 rounded-full border flex items-center justify-center transition ${isFavorite(product.id) ? "border-red-200 bg-red-50 text-red-500" : "border-gray-300 hover:border-black"}`}
                     >
                        <Heart size={24} className={isFavorite(product.id) ? "fill-current" : ""} />
                     </button>
                  </div>
               </div>

               {/* BİLGİ KUTULARI */}
               <div className="mt-8 space-y-4">
                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                     <Truck className="text-gray-600" />
                     <div className="text-sm">
                        <p className="font-bold text-gray-900">Ücretsiz Kargo</p>
                        <p className="text-gray-500">1000 TL ve üzeri siparişlerde kargo bedava.</p>
                     </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                     <RefreshCcw className="text-gray-600" />
                     <div className="text-sm">
                        <p className="font-bold text-gray-900">Kolay İade</p>
                        <p className="text-gray-500">14 gün içinde koşulsuz iade hakkı.</p>
                     </div>
                  </div>
               </div>

               <div className="mt-8 border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Ürün Açıklaması</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "Bu ürün için açıklama girilmemiş."}
                  </p>
               </div>

            </div>
          </div>

          <Reviews />

          <SimilarProducts currentProduct={product} />

        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;