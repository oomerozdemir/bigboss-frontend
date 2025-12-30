import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // 2. Sayfa adminlik gerektiriyor ama kullanıcı admin değilse -> Anasayfaya at
  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. Her şey yolundaysa sayfayı göster
  return children;
};

export default ProtectedRoute;