import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- SEPETE EKLE (DÜZELTİLDİ) ---
  const addToCart = (product, variant, quantity = 1) => {
    // 1. Önce sepetin güncel halini kontrol et (state'den oku)
    const existingItem = cartItems.find(item => 
      item.id === product.id && 
      item.selectedVariant?.size === variant?.size && 
      item.selectedVariant?.color === variant?.color
    );

    if (existingItem) {
      // Ürün zaten varsa:
      toast.success("Ürün adedi güncellendi");
      
      setCartItems(prev => prev.map(item => 
        (item.id === product.id && item.selectedVariant?.size === variant?.size && item.selectedVariant?.color === variant?.color)
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Yeni ürünse:
      toast.success("Sepete eklendi");
      
      setCartItems(prev => [...prev, { ...product, selectedVariant: variant, quantity }]);
    }
  };

  const removeFromCart = (id, variantSize) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedVariant?.size === variantSize)));
    toast.success("Ürün sepetten çıkarıldı");
  };

  const updateQuantity = (id, variantSize, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedVariant?.size === variantSize) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);