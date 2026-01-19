import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Cart Items'ı LocalStorage'dan al
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 2. Kuponu LocalStorage'dan al (Kalıcılık için)
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const storedCoupon = localStorage.getItem("appliedCoupon");
    return storedCoupon ? JSON.parse(storedCoupon) : null;
  });

  const [discountAmount, setDiscountAmount] = useState(0);

  // 3. Alt Toplam Hesapla
  const subTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  // 4. Değişiklikleri LocalStorage'a Kaydet
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon]);

  // 5. İndirim Hesaplama
  useEffect(() => {
    if (appliedCoupon) {
        let discount = 0;
        if (appliedCoupon.discountType === 'PERCENTAGE') {
            discount = (subTotal * parseFloat(appliedCoupon.discountValue)) / 100;
        } else {
            discount = parseFloat(appliedCoupon.discountValue);
        }
        
        // İndirim tutarı sepet tutarından büyük olamaz
        if (discount > subTotal) discount = subTotal;
        
        setDiscountAmount(discount);
    } else {
        setDiscountAmount(0);
    }
  }, [cartItems, appliedCoupon, subTotal]);

  // 6. Genel Toplamlar ve Kargo Kuralı (Merkezi Yönetim)
  const shippingCost = (subTotal > 2000 || subTotal === 0) ? 0 : 59.90;
  const grandTotal = subTotal - discountAmount;
  const finalTotal = grandTotal + shippingCost; // Ödenecek Son Tutar

  // --- FONKSİYONLAR ---
  const addToCart = (product, variant, quantity = 1) => {
    const existingItem = cartItems.find(item => 
      item.id === product.id && 
      item.selectedVariant?.size === variant?.size && 
      item.selectedVariant?.color === variant?.color
    );

    if (existingItem) {
      toast.success("Ürün adedi güncellendi");
      setCartItems(prev => prev.map(item => 
        (item.id === product.id && item.selectedVariant?.size === variant?.size && item.selectedVariant?.color === variant?.color)
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      toast.success("Sepete eklendi");
      setCartItems(prev => [...prev, { ...product, selectedVariant: variant, quantity }]);
    }
  };

  const removeFromCart = (id, variantSize, variantColor) => {
    setCartItems(prev => prev.filter(item => 
        !(item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor)
    ));
    toast.success("Ürün sepetten çıkarıldı");
  };

  const updateQuantity = (id, variantSize, variantColor, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null); // Sepet temizlenince kuponu da sil
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.success("Kupon kaldırıldı");
  };

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        setCartItems,
        subTotal,
        discountAmount,
        grandTotal, // Sadece ürünler - indirim
        shippingCost, // Kargo ücreti
        finalTotal, // Her şey dahil ödenecek tutar
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