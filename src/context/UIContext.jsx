
import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const toggleAuthModal = () => setIsAuthModalOpen(prev => !prev);

  return (
    <UIContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal, toggleAuthModal }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);