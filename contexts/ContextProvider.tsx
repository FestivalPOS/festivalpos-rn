import React from 'react';
import { CartProvider } from './Cart.context';


const ContextProvider = ({ children }) => {
  return (
    <CartProvider>
            {children}
    </CartProvider>
  );
};

export default ContextProvider;