import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [discountAmount, setDiscountAmount] = useState(0);

  // 1. DÜZELTME: Subtotal tek bir yerde ve güvenli (parseFloat ile) hesaplanmalı
  const subTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Kupon Hesaplama Mantığı
  useEffect(() => {
    if (appliedCoupon) {
        let discount = 0;
        if (appliedCoupon.discountType === 'PERCENTAGE') {
            discount = (subTotal * parseFloat(appliedCoupon.discountValue)) / 100;
        } else {
            discount = parseFloat(appliedCoupon.discountValue);
        }
        
        if (discount > subTotal) discount = subTotal;
        
        setDiscountAmount(discount);
    } else {
        setDiscountAmount(0);
    }
  }, [cartItems, appliedCoupon, subTotal]);

  // --- SEPETE EKLE ---
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

  // 2. DÜZELTME: Silme işleminde Renk (Color) kontrolü de eklendi
  const removeFromCart = (id, variantSize, variantColor) => {
    setCartItems(prev => prev.filter(item => 
        !(item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor)
    ));
    toast.success("Ürün sepetten çıkarıldı");
  };

  // 3. DÜZELTME: Adet güncellemede Renk (Color) kontrolü de eklendi
  const updateQuantity = (id, variantSize, variantColor, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const grandTotal = subTotal - discountAmount;

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        setCartItems,
        subTotal,
        discountAmount,
        grandTotal,
        appliedCoupon,
        setAppliedCoupon,
        
        // 4. DÜZELTME: Fonksiyonlar dışarıya açıldı (value içine eklendi)
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