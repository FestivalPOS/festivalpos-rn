import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const resetCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider value={{ cart, setCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
