import React from 'react';
import { CartProvider } from './Cart.context';
import { POSProvider } from './POS.context';
import { SalesProvider } from './Sales.context';

const ContextProvider = ({ children }) => {
  return (
    <POSProvider>
      <CartProvider>
        <SalesProvider>{children}</SalesProvider>
      </CartProvider>
    </POSProvider>
  );
};

export default ContextProvider;
