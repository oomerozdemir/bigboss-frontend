import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Sepeti Başlat
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const storedCoupon = localStorage.getItem("appliedCoupon");
    return storedCoupon ? JSON.parse(storedCoupon) : null;
  });

  const [discountAmount, setDiscountAmount] = useState(0);

  // 2. Tutar Hesaplama (Güvenli)
  const subTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

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

  // 3. Genel Toplamlar
  const shippingCost = (subTotal > 2000 || subTotal === 0) ? 0 : 59.90;
  const grandTotal = subTotal - discountAmount;
  const finalTotal = grandTotal + shippingCost;

  // --- FONKSİYONLAR ---
  const addToCart = (product, variant, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedVariant?.size === variant?.size && 
        item.selectedVariant?.color === variant?.color
      );
      if (existing) {
        toast.success("Sepet güncellendi");
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      toast.success("Sepete eklendi");
      return [...prev, { ...product, selectedVariant: variant, quantity }];
    });
  };

  const removeFromCart = (id, variantSize, variantColor) => {
    setCartItems(prev => prev.filter(item => 
        !(item.id === id && item.selectedVariant?.size === variantSize && item.selectedVariant?.color === variantColor)
    ));
    toast.success("Ürün çıkarıldı");
  };

  const updateQuantity = (id, variantSize, variantColor, amount) => {
    setCartItems(prev => prev.map(item => {
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
        cartItems, // 👈 BURASI ÇOK ÖNEMLİ (Undefined hatasını çözen yer)
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