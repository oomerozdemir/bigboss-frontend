import React from 'react';
import { Navigate } from 'react-router-dom';

// JWT'nin exp (expiration) alanını decode ederek süresi dolmuş mu kontrol eder
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Decode edilemiyorsa geçersiz say
  }
};

const ProtectedRoute = ({ children, isAdmin }) => {
  let user = null;
  const token = localStorage.getItem("token");

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Kullanıcı verisi okunamadı, çıkış yapılıyor...", error);
    localStorage.removeItem("user");
  }

  // Token yoksa veya süresi dolmuşsa oturumu temizle ve login'e yönlendir
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/admin" replace />;
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
