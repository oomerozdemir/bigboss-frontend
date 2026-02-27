import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, RefreshCcw, ShieldCheck, Star, Minus, Plus, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Reviews from '../components/Reviews';
import SimilarProducts from '../components/SimilarProducts';
import { sortVariantsByOrder } from '../utils/sortHelpers';
import { useTranslation } from 'react-i18next';
import { useAutoTranslate } from '../hooks/useAutoTranslate';
import TranslatedText from '../components/TranslatedText';
import { formatPrice } from '../utils/formatPrice';
import SEO from '../components/SEO';

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

  useEffect(() => {
    fetchProductDetail();
    // Görüntülenme sayacını artır (fire-and-forget)
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/products/${id}/view`, { method: 'POST' }).catch(() => {});
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
  const seoDescription = product.description
    ? product.description.slice(0, 155) + (product.description.length > 155 ? '...' : '')
    : `${product.name} - Big Boss Textil'de en iyi fiyatla. Ücretsiz kargo, güvenli alışveriş.`;

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
                  {/* İndirim rozeti */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
                      {t('product.discount_badge', { percent: discountPercent })}
                    </div>
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

                 {/* Fiyat gösterimi */}
                 <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                      {hasDiscount && (
                        <span className="text-lg font-medium text-gray-400 line-through">{formatPrice(product.price)} TL</span>
                      )}
                      <span className={`text-2xl font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
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
    </>
  );
};

export default ProductDetailPage;
