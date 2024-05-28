import React from 'react';
import { CartProvider } from './Cart.context';
import { POSProvider } from './POS.context'


const ContextProvider = ({ children }) => {
  return (
    <POSProvider>
      <CartProvider>
              {children}
      </CartProvider>
    </POSProvider>
  );
};

export default ContextProvider;