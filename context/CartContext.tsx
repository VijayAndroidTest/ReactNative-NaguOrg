import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';

export const CartContext = createContext<any>(null);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const unsubscribe =
      auth().onAuthStateChanged(
        (user) => {
          setUserId(user?.uid ?? null);
        }
      );

    return unsubscribe;
  }, []);

  const loadCart = async (
    uid: string | null
  ) => {
    if (!uid) {
      setCart([]);
      return;
    }

    try {
      const data =
        await AsyncStorage.getItem(
          `cart_${uid}`
        );

      if (data) {
        setCart(JSON.parse(data));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.log(
        'Load cart error:',
        error
      );
    }
  };

  const saveCart = async (
    cartData: any[]
  ) => {
    if (!userId) return;

    try {
      await AsyncStorage.setItem(
        `cart_${userId}`,
        JSON.stringify(cartData)
      );
    } catch (error) {
      console.log(
        'Save cart error:',
        error
      );
    }
  };

  useEffect(() => {
    loadCart(userId);
  }, [userId]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = (
    product: any
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQty = (
    id: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (
    id: string
  ) => {
    const item = cart.find(
      (x) => x.id === id
    );

    if (!item) return;

    if (item.quantity === 1) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from cart?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              setCart((prev) =>
                prev.filter(
                  (x) => x.id !== id
                )
              );
            },
          },
        ]
      );

      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
    );
  };

  const clearCart = async () => {
    setCart([]);

    if (userId) {
      await AsyncStorage.removeItem(
        `cart_${userId}`
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;