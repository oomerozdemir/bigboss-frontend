import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Sepeti Güvenli Başlat (Hata varsa boş dizi döner)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Sepet verisi okunamadı:", error);
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const storedCoupon = localStorage.getItem("appliedCoupon");
      return storedCoupon ? JSON.parse(storedCoupon) : null;
    } catch {
      return null;
    }
  });

  const [discountAmount, setDiscountAmount] = useState(0);

  // 2. Alt Toplam (Dizi kontrolü ekledik)
  const subTotal = Array.isArray(cartItems) 
    ? cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0)
    : 0;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
        let discount = 0;
        if (appliedCoupon.discountType === 'PERCENTAGE') {
            discount = (subTotal * parseFloat(appliedCoupon.discountValue)) / 100;
        } else {
            discount = parseFloat(appliedCoupon.discountValue);
        }
        if (discount > subTotal) discount = subTotal;
        setDiscountAmount(discount);
    } else {
        localStorage.removeItem("appliedCoupon");
        setDiscountAmount(0);
    }
  }, [cartItems, appliedCoupon, subTotal]);

  const shippingCost = (subTotal > 2000 || subTotal === 0) ? 0 : 59.90;
  const grandTotal = subTotal - discountAmount;
  const finalTotal = grandTotal + shippingCost;

  // --- FONKSİYONLAR ---
  const addToCart = (product, variant, quantity = 1) => {
    // Sepete ekleme sayacını artır (fire-and-forget)
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/products/${product.id}/cart-add`, { method: 'POST' }).catch(() => {});

    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,     // Ürün Adı
        content_ids: [product.id],      // Ürün ID
        content_type: 'product',
        value: product.price,           // Fiyat
        currency: 'TRY',                // Para Birimi
        contents: [{                    // İçerik Detayı
            id: product.id,
            quantity: quantity,
            item_price: product.price
        }]
      });
    }


    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : []; // Ekstra güvenlik
      const existing = safePrev.find(item => 
        item.id === product.id && 
        item.selectedVariant?.size === variant?.size && 
        item.selectedVariant?.color === variant?.color
      );
      if (existing) {
        toast.success("Sepet güncellendi");
        return safePrev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      toast.success("Sepete eklendi");
      return [...safePrev, { ...product, selectedVariant: variant, quantity }];
    });
  };

  const removeFromCart = (id, variantSize, variantColor) => {
    setCartItems(prev => (Array.isArray(prev) ? prev : []).filter(item => 
        !(item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor)
    ));
    toast.success("Ürün çıkarıldı");
  };

  const updateQuantity = (id, variantSize, variantColor, amount) => {
    setCartItems(prev => (Array.isArray(prev) ? prev : []).map(item => {
      if (item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor) {
        return { ...item, quantity: Math.max(1, item.quantity + amount) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.success("Kupon kaldırıldı");
  };

  return (
    <CartContext.Provider value={{ 
        cartItems: Array.isArray(cartItems) ? cartItems : [], // Dışarıya ASLA undefined gitmez
        setCartItems,
        subTotal,
        discountAmount,
        grandTotal,
        shippingCost,
        finalTotal,
        appliedCoupon,
        setAppliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);