import React, { createContext, useContext, useState, ReactNode } from 'react';

// Structure of the cart context
interface CartContextType {
  cart: { [productId: string]: number };
  setCart: React.Dispatch<
    React.SetStateAction<{ [productId: string]: number }>
  >;
  resetCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<{ [productId: string]: number }>({});

  const resetCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider value={{ cart, setCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
