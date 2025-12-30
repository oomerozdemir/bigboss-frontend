import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen">
        <Outlet />
      </div>

      {/* Altta Footer Sabit */}
      <Footer />
    </>
  );
};

export default MainLayout;