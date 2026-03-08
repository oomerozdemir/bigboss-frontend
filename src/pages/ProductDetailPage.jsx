import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, RefreshCcw, ShieldCheck, Star, Minus, Plus, Check, ChevronDown, Zap, Shirt } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Reviews from '../components/Reviews';
import SimilarProducts from '../components/SimilarProducts';
import KombinProducts from '../components/KombinProducts';
import { sortVariantsByOrder } from '../utils/sortHelpers';
import { useTranslation } from 'react-i18next';
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import TranslatedText from '../components/TranslatedText';
import { formatPrice } from '../utils/formatPrice';
import SEO from '../components/SEO';

const CountdownTimer = ({ endDate }) => {
  const calc = () => {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, total: diff };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const timer = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!time) return null;

  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2">
      {[
        { val: Math.floor(time.h / 24), label: 'Gün' },
        { val: time.h % 24, label: 'Saat' },
        { val: time.m, label: 'Dk' },
        { val: time.s, label: 'Sn' },
      ].filter(u => u.val > 0 || u.label === 'Saat' || u.label === 'Dk' || u.label === 'Sn').map(({ val, label }) => (
        <div key={label} className="flex flex-col items-center bg-yellow-900/80 text-yellow-100 rounded-lg px-3 py-1.5 min-w-11">
          <span className="text-lg font-black leading-none">{pad(val)}</span>
          <span className="text-[9px] uppercase tracking-widest mt-0.5 opacity-80">{label}</span>
        </div>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dinamik içerik otomatik çevirisi (Arapça seçilince)
  const translatedProductName = useAutoTranslate(product?.name || '');
  const translatedDescription = useAutoTranslate(product?.description || '');

  const [activeImage, setActiveImage] = useState("");
  const [currentImages, setCurrentImages] = useState([]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [combinations, setCombinations] = useState([]);

  // Kombin modal
  const [kombineModalProduct, setKombineModalProduct] = useState(null);
  const [modalColor, setModalColor] = useState('');
  const [modalSize, setModalSize] = useState('');

  useEffect(() => {
    fetchProductDetail();
    // Görüntülenme sayacını artır (fire-and-forget)
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/products/${id}/view`, { method: 'POST' }).catch(() => {});
    // Kombinleri getir
    fetch(`${apiUrl}/api/products/${id}/combinations`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setCombinations(Array.isArray(data) ? data.filter(c => c.product.isActive) : []))
      .catch(() => {});
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/products/${id}`)
      if (!res.ok) throw new Error("Ürün bulunamadı");

      const data = await res.json();
      setProduct(data);

      let initialImages = [];
      if (data.imageUrl) initialImages.push(data.imageUrl);

      if (data.variants && data.variants.length > 0) {
         const firstColorVariant = data.variants.find(v => v.color !== "Standart" && v.stock > 0);

         if (firstColorVariant) {
            setSelectedColor(firstColorVariant.color);

            if (firstColorVariant.vImageUrls && firstColorVariant.vImageUrls.length > 0) {
                initialImages = firstColorVariant.vImageUrls;
            } else if (firstColorVariant.vImageUrl) {
                initialImages = [firstColorVariant.vImageUrl];
            }
         } else {
             const variantWithImage = data.variants.find(v => v.vImageUrl || (v.vImageUrls && v.vImageUrls.length > 0));
             if (variantWithImage) {
                 if (variantWithImage.vImageUrls && variantWithImage.vImageUrls.length > 0) {
                     initialImages = variantWithImage.vImageUrls;
                 } else if (variantWithImage.vImageUrl) {
                     initialImages = [variantWithImage.vImageUrl];
                 }
             }
         }
      }

      setCurrentImages(initialImages);
      if (initialImages.length > 0) {
          setActiveImage(initialImages[0]);
      } else {
          setActiveImage("https://via.placeholder.com/500x600?text=No+Image");
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const uniqueColors = product?.variants?.reduce((acc, v) => {
    if (v.color && v.color !== "Standart" && !acc.find(c => c.name === v.color)) {
      const images = (v.vImageUrls && v.vImageUrls.length > 0)
        ? v.vImageUrls
        : (v.vImageUrl ? [v.vImageUrl] : []);

      acc.push({ name: v.color, images: images });
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

  const handleColorSelect = (colorName, images) => {
    setSelectedColor(colorName);
    setSelectedSize("");

    let newImages = [];
    if (Array.isArray(images) && images.length > 0) {
        newImages = images;
    } else if (typeof images === 'string' && images) {
        newImages = [images];
    }

    setCurrentImages(newImages);
    if (newImages.length > 0) setActiveImage(newImages[0]);
  };

  // --- KOMBİN MODAL ---
  const openKombinModal = (cp) => {
    const firstColorVariant = cp.variants?.find(v => v.color !== 'Standart' && v.stock > 0);
    setModalColor(firstColorVariant?.color || '');
    setModalSize('');
    setKombineModalProduct(cp);
  };

  const modalUniqueColors = kombineModalProduct?.variants?.reduce((acc, v) => {
    if (v.color && v.color !== 'Standart' && !acc.includes(v.color)) acc.push(v.color);
    return acc;
  }, []) || [];

  const modalAvailableSizes = sortVariantsByOrder(
    kombineModalProduct?.variants?.filter(v =>
      modalColor ? v.color === modalColor : true
    ) || []
  );

  const modalCurrentVariant = kombineModalProduct?.variants?.find(v =>
    (modalColor ? v.color === modalColor : true) &&
    (modalSize ? v.size === modalSize : true)
  );

  const handleKombinAdd = (addBoth) => {
    if (modalUniqueColors.length > 0 && !modalColor) {
      toast.error('Kombin ürün için renk seçin'); return;
    }
    if (modalAvailableSizes.length > 0 && !modalSize) {
      toast.error('Kombin ürün için beden seçin'); return;
    }

    if (addBoth) {
      if (uniqueColors.length > 0 && !selectedColor) {
        toast.error(t('product.select_color')); return;
      }
      if (availableSizes.length > 0 && !selectedSize) {
        toast.error(t('product.select_size')); return;
      }
      addToCart(product, currentVariant || null, 1);
    }

    addToCart(kombineModalProduct, modalCurrentVariant || null, 1);
    toast.success(addBoth ? 'Her iki ürün sepete eklendi!' : `${kombineModalProduct.name} sepete eklendi!`);
    setKombineModalProduct(null);
  };

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
        if (uniqueColors.length > 0 && !selectedColor) {
            toast.error(t('product.select_color'));
            return;
        }

        if (availableSizes.length > 0 && !selectedSize) {
            toast.error(t('product.select_size'));
            return;
        }

        if (!currentVariant) {
            toast.error(t('product.combo_not_found'));
            return;
        }

        if (currentVariant.stock < quantity) {
            toast.error(t('product.insufficient_stock', { count: currentVariant.stock }));
            return;
        }
    }

    addToCart(product, currentVariant, quantity);
    navigate('/sepet');
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error(t('product.login_required'));
        return;
    }
    await toggleFavorite(product.id);
    toast.success(isFavorite(product.id) ? t('product.removed_from_favorites') : t('product.added_to_favorites'));
  };

  const groupedDetails = product?.productDetails?.reduce((acc, detail) => {
    if (!acc[detail.sectionType]) {
      acc[detail.sectionType] = [];
    }
    acc[detail.sectionType].push(detail);
    return acc;
  }, {}) || {};

  const getSectionLabel = (type) => {
    const key = `product.section_${type}`;
    const translated = t(key);
    return translated !== key ? translated : type;
  };

  const displayPrice = product?.isOnSale && product?.discountPrice
    ? parseFloat(product.discountPrice)
    : parseFloat(product?.price || 0);

  const hasDiscount = product?.isOnSale && product?.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.discountPrice) / parseFloat(product.price)) * 100)
    : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">{t('product.product_not_found')}</div>;

  const productImage = activeImage && !activeImage.includes('placeholder') ? activeImage : undefined;
  const priceText = hasDiscount
    ? `${parseFloat(product.discountPrice).toLocaleString('tr-TR')} TL (İndirimli)`
    : `${parseFloat(product.price).toLocaleString('tr-TR')} TL`;
  const seoDescription = product.description
    ? `${product.description.slice(0, 110).trim()}... ${priceText}, ücretsiz kargo. Big Boss Textil.`
    : `${product.name} – ${priceText}. Big Boss Textil'de ücretsiz kargo, güvenli ödeme ve hızlı teslimat ile sipariş verin.`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || seoDescription,
    image: productImage || `https://bigbosstextil.com/hero-product.png`,
    url: `https://bigbosstextil.com/product/${id}`,
    brand: { '@type': 'Brand', name: 'Big Boss Textil' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: displayPrice.toFixed(2),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Big Boss Textil' },
      url: `https://bigbosstextil.com/product/${id}`,
    },
  };

  return (
    <>
      <SEO
        title={product.name}
        description={seoDescription}
        canonical={`/product/${id}`}
        image={productImage}
        type="og:product"
        schema={productSchema}
      />
      <div className="bg-white min-h-screen pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* SOL TARAF: GÖRSEL VE GALERİ */}
            <div className="space-y-4">
               {/* ANA RESİM */}
               <div className="aspect-[4/5] w-full bg-gray-100 rounded-2xl overflow-hidden relative group">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-all duration-300"
                  />
                  {/* İndirim / Flash Sale rozeti */}
                  {hasDiscount && (
                    product.isFlashSale ? (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 font-black text-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Zap size={14} className="fill-yellow-900" />
                        FLASH %{discountPercent}
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
                        {t('product.discount_badge', { percent: discountPercent })}
                      </div>
                    )
                  )}

                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl border-2 border-white px-6 py-3 -rotate-12">{t('product.sold_out')}</span>
                    </div>
                  )}
               </div>

               {/* KÜÇÜK RESİM GALERİSİ */}
               {currentImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                      {currentImages.map((img, idx) => (
                          <button
                              key={idx}
                              onClick={() => setActiveImage(img)}
                              className={`w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                          >
                              <img src={img} className="w-full h-full object-cover" alt={`${product.name} - görsel ${idx + 1}`} />
                          </button>
                      ))}
                  </div>
               )}
            </div>

            {/* SAĞ TARAF: DETAYLAR */}
            <div>
               <div className="mb-6">
                 <h1 className="text-3xl font-black text-gray-900 mb-2">{translatedProductName || product.name}</h1>

                 {/* Flash Sale Banner */}
                 {product.isFlashSale && hasDiscount && (
                   <div className="mb-4 bg-linear-to-r from-yellow-400 to-amber-400 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-md">
                     <div className="flex items-center gap-2">
                       <Zap size={20} className="text-yellow-900 fill-yellow-900" />
                       <span className="font-black text-yellow-900 text-sm uppercase tracking-wide">Flash Sale</span>
                     </div>
                     {product.saleEndDate && <CountdownTimer endDate={product.saleEndDate} />}
                   </div>
                 )}

                 {/* Fiyat gösterimi */}
                 <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                      {hasDiscount && (
                        <span className="text-lg font-medium text-gray-400 line-through">{formatPrice(product.price)} TL</span>
                      )}
                      <span className={`text-2xl font-bold ${
                        product.isFlashSale && hasDiscount ? 'text-yellow-600' :
                        hasDiscount ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {formatPrice(displayPrice)} TL
                      </span>
                    </div>

                    {product.stock > 0 ? (
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">{t('product.in_stock')}</span>
                    ) : (
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">{t('product.out_of_stock')}</span>
                    )}
                 </div>
               </div>

               {/* SEÇENEKLER */}
               <div className="space-y-6 border-t border-gray-100 pt-6">

                  {/* 1. RENK SEÇİMİ */}
                  {uniqueColors.length > 0 && (
                    <div>
                        <span className="text-sm font-bold text-gray-900 block mb-3">{t('product.color_label')} <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                        <div className="flex gap-3">
                            {uniqueColors.map((c, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleColorSelect(c.name, c.images)}
                                    className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all ${selectedColor === c.name ? "border-black scale-110" : "border-transparent hover:border-gray-300"}`}
                                >
                                    {c.images && c.images.length > 0 ? (
                                        <img src={c.images[0]} className="w-full h-full rounded-full object-cover" />
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
                            <span className="text-sm font-bold text-gray-900">{t('product.size_label')}</span>
                            <button className="text-xs text-gray-500 underline hover:text-black">{t('product.size_chart')}</button>
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
                        {product.stock === 0 ? t('product.not_in_stock') : t('product.add_to_cart')}
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
                        <p className="font-bold text-gray-900">{t('product.free_shipping_info')}</p>
                        <p className="text-gray-500">{t('product.free_shipping_detail')}</p>
                     </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                     <RefreshCcw className="text-gray-600" />
                     <div className="text-sm">
                        <p className="font-bold text-gray-900">{t('product.easy_return')}</p>
                        <p className="text-gray-500">{t('product.easy_return_detail')}</p>
                     </div>
                  </div>
               </div>

               {/* KOMBİN ÖNERİSİ — inline sağ kolon */}
               {combinations.length > 0 && (
                 <div className="mt-8 border border-gray-100 rounded-2xl overflow-hidden">
                   <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                     <Shirt size={16} className="text-gray-600" />
                     <span className="text-sm font-black text-gray-900 uppercase tracking-wide">Kombin Önerisi</span>
                     <span className="text-xs text-gray-400 font-normal ml-1">— Bunu da sepete eklemek ister misiniz?</span>
                   </div>
                   <div className="divide-y divide-gray-50">
                     {combinations.map(({ combinationId, product: cp }) => {
                       const thumb =
                         cp.variants?.[0]?.vImageUrls?.[0] ||
                         cp.variants?.[0]?.vImageUrl ||
                         cp.imageUrl;
                       const hasVariants = cp.variants && cp.variants.length > 0;
                       const effectivePrice = cp.isOnSale && cp.discountPrice
                         ? parseFloat(cp.discountPrice)
                         : parseFloat(cp.price);
                       const hasDiscount = cp.isOnSale && cp.discountPrice;
                       const outOfStock = cp.stock === 0;

                       return (
                         <div key={combinationId} className="flex items-center gap-3 px-4 py-3">
                           {/* Thumbnail */}
                           <button onClick={() => navigate(`/product/${cp.id}`)} className="shrink-0">
                             {thumb ? (
                               <img src={thumb} alt={cp.name} className="w-14 h-16 rounded-lg object-cover object-top" />
                             ) : (
                               <div className="w-14 h-16 rounded-lg bg-gray-100" />
                             )}
                           </button>
                           {/* İsim + Fiyat */}
                           <div className="flex-1 min-w-0">
                             <button
                               onClick={() => navigate(`/product/${cp.id}`)}
                               className="text-sm font-bold text-gray-900 line-clamp-2 text-left hover:underline"
                             >
                               {cp.name}
                             </button>
                             <div className="flex items-center gap-2 mt-0.5">
                               {hasDiscount && (
                                 <span className="text-xs text-gray-400 line-through">{formatPrice(cp.price)} TL</span>
                               )}
                               <span className={`text-sm font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                                 {formatPrice(effectivePrice)} TL
                               </span>
                             </div>
                           </div>
                           {/* Sepet Butonu */}
                           {outOfStock ? (
                             <span className="text-xs text-gray-400 shrink-0">Stok yok</span>
                           ) : (
                             <button
                               onClick={() => {
                                 if (hasVariants) {
                                   openKombinModal(cp);
                                 } else {
                                   addToCart(cp, null, 1);
                                   toast.success(`${cp.name} sepete eklendi!`);
                                 }
                               }}
                               className="shrink-0 flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-gray-800 transition whitespace-nowrap"
                             >
                               <ShoppingCart size={13} />
                               {hasVariants ? 'Seç & Ekle' : 'Sepete Ekle'}
                             </button>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}

            </div>
          </div>

          {/* DETAYLI BİLGİLER BÖLÜMÜ */}
          <div className="mt-16 border-t pt-12">
            {product.description && (
              <div className="mb-8">
                <h3 className="font-bold text-2xl mb-4">{t('product.about_product')}</h3>
                <p className="text-gray-600 leading-relaxed">{translatedDescription || product.description}</p>
              </div>
            )}

            {Object.keys(groupedDetails).length > 0 && (
              <div className="space-y-6">
                <div className="flex gap-2 border-b overflow-x-auto">
                  {Object.keys(groupedDetails).map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition ${
                        activeTab === type
                          ? 'border-black text-black'
                          : 'border-transparent text-gray-500 hover:text-black'
                      }`}
                    >
                      {getSectionLabel(type)}
                    </button>
                  ))}
                </div>

                <div className="py-6">
                  {groupedDetails[activeTab]?.sort((a, b) => a.order - b.order).map((detail, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      {detail.title && (
                        <h4 className="font-bold text-lg mb-2 text-gray-900">
                          <TranslatedText text={detail.title} />
                        </h4>
                      )}
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        <TranslatedText text={detail.content} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Reviews productId={product?.id} />
          <SimilarProducts currentProduct={product} />

        </div>
      </div>

      {/* KOMBİN MODAL */}
      {kombineModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setKombineModalProduct(null); }}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Shirt size={18} className="text-gray-600" />
                <span className="font-black text-gray-900">Kombin Önerisi</span>
              </div>
              <button
                onClick={() => setKombineModalProduct(null)}
                className="text-gray-400 hover:text-gray-700 transition text-xl leading-none"
              >✕</button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Ürün Özeti */}
              <div className="flex gap-4">
                {(() => {
                  const thumb =
                    kombineModalProduct.variants?.find(v => modalColor ? v.color === modalColor : true)?.vImageUrls?.[0] ||
                    kombineModalProduct.variants?.[0]?.vImageUrls?.[0] ||
                    kombineModalProduct.variants?.[0]?.vImageUrl ||
                    kombineModalProduct.imageUrl;
                  return thumb ? (
                    <img src={thumb} alt={kombineModalProduct.name} className="w-20 h-24 rounded-xl object-cover object-top shrink-0" />
                  ) : (
                    <div className="w-20 h-24 rounded-xl bg-gray-100 shrink-0" />
                  );
                })()}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-bold text-gray-900 leading-tight">{kombineModalProduct.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {kombineModalProduct.isOnSale && kombineModalProduct.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">{formatPrice(kombineModalProduct.price)} TL</span>
                    )}
                    <span className={`text-lg font-black ${kombineModalProduct.isOnSale && kombineModalProduct.discountPrice ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatPrice(kombineModalProduct.isOnSale && kombineModalProduct.discountPrice
                        ? kombineModalProduct.discountPrice
                        : kombineModalProduct.price
                      )} TL
                    </span>
                  </div>
                </div>
              </div>

              {/* Renk Seçimi */}
              {modalUniqueColors.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    Renk <span className="text-gray-400 font-normal">{modalColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {modalUniqueColors.map(color => {
                      const v = kombineModalProduct.variants?.find(vv => vv.color === color);
                      const img = v?.vImageUrls?.[0] || v?.vImageUrl;
                      return (
                        <button
                          key={color}
                          onClick={() => { setModalColor(color); setModalSize(''); }}
                          className={`w-11 h-11 rounded-full border-2 p-0.5 transition-all ${modalColor === color ? 'border-black scale-110' : 'border-transparent hover:border-gray-300'}`}
                        >
                          {img ? (
                            <img src={img} className="w-full h-full rounded-full object-cover" alt={color} />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{color[0]}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Beden Seçimi */}
              {modalAvailableSizes.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2">Beden</p>
                  <div className="grid grid-cols-5 gap-2">
                    {modalAvailableSizes.map((v) => {
                      const available = v.stock > 0;
                      return (
                        <button
                          key={v.id}
                          disabled={!available}
                          onClick={() => setModalSize(v.size)}
                          className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            modalSize === v.size
                              ? 'bg-black text-white border-black'
                              : available
                                ? 'bg-white text-gray-900 border-gray-200 hover:border-black'
                                : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sayfadaki Ana Ürün Hatırlatması */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-bold text-gray-800 mb-1">Sayfadaki ürün:</p>
                <p className="truncate">{product?.name}</p>
                {(selectedColor || selectedSize) && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[selectedColor, selectedSize].filter(Boolean).join(' / ')}
                  </p>
                )}
                {(!selectedColor && uniqueColors.length > 0) || (!selectedSize && availableSizes.length > 0) ? (
                  <p className="text-xs text-amber-600 mt-1">⚠ Renk/beden seçilmemişse "İkisini birden ekle" çalışmaz.</p>
                ) : null}
              </div>

              {/* Butonlar */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleKombinAdd(true)}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-full hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  İkisini Birden Sepete Ekle
                </button>
                <button
                  onClick={() => handleKombinAdd(false)}
                  className="w-full border border-gray-300 text-gray-700 font-bold py-3.5 rounded-full hover:border-black hover:text-black transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Sadece Kombin Ürünü Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
