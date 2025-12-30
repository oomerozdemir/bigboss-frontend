import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]); // Sadece ID'leri tutacağız (Örn: [1, 5, 8])

  // Uygulama açılınca favorileri çek
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Gelen ürün objelerinden sadece ID'leri alıp listeye atıyoruz
        setFavoriteIds(data.map(product => product.id));
      }
    } catch (error) {
      console.error("Favoriler yüklenemedi", error);
    }
  };

  const isFavorite = (productId) => {
    return favoriteIds.includes(productId);
  };

  const toggleFavorite = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        // Toast mesajı component içinde gösterilebilir
        return false; 
    }

    // Optimistic Update (Hemen arayüzü güncelle)
    let newFavorites;
    const exists = favoriteIds.includes(productId);

    if (exists) {
        newFavorites = favoriteIds.filter(id => id !== productId);
    } else {
        newFavorites = [...favoriteIds, productId];
    }
    setFavoriteIds(newFavorites);

    // Backend isteği
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      
      if (!res.ok) {
        // Hata olursa eski haline döndür
        fetchFavorites(); 
        return false;
      }
      return true; // Başarılı
    } catch (error) {
      fetchFavorites();
      return false;
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);