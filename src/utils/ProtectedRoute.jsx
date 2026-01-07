import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  let user = null;
  
  try {
    const storedUser = localStorage.getItem("user");
    // Eğer veri "undefined" stringi olarak kaydedilmişse veya boşsa null döner
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Kullanıcı verisi okunamadı, çıkış yapılıyor...", error);
    localStorage.removeItem("user"); // Bozuk veriyi temizle
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // Adminlik gerektiriyor ama kullanıcı admin değilse -> Anasayfaya at
  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;