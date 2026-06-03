import React, { createContext, useState } from 'react';

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    console.log('ADD TO CART CALLED');
      console.log('CONTEXT addToCart');
  console.log('PRODUCT RECEIVED:', JSON.stringify(product, null, 2));


    setCart((prev) => {
        console.log('PREVIOUS CART', prev);
console.log('productID', product.id);
      const existing = prev.find((item) => item.name === product.name);
      
      if (existing) {
         console.log('ITEM EXISTS');
        return prev.map((item) => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item);
      }
      
      return [...prev, { ...product, quantity: 1 }];
    });
  };
   console.log('NEW ITEM');

   const increaseQty = (id: string) => {
  setCart(prev =>
    prev.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
};

const decreaseQty = (id: string) => {
  setCart(prev =>
    prev
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0)
  );
};
  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;