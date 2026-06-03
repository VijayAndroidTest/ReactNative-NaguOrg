import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartProvider from '../context/CartContext';
import auth from '@react-native-firebase/auth'; // Native auth import
import { FirebaseAuthTypes } from '@react-native-firebase/auth'; // Import types

export default function RootLayout() { 
  const [initializing, setInitializing] = useState(true);
  // Use the native type for the user state
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Correct Native Syntax: Call the auth() instance directly
    const unsubscribe = auth().onAuthStateChanged(
      async (firebaseUser: FirebaseAuthTypes.User | null) => {
        setUser(firebaseUser);

        const guestMode = await AsyncStorage.getItem('guestMode');
        const inAuthGroup = segments[0] === '(auth)';

        if (!firebaseUser && guestMode !== 'true' && !inAuthGroup) {
          router.replace('/(auth)/login');
        }

        if ((firebaseUser || guestMode === 'true') && inAuthGroup) {
          router.replace('/');
        }

        setInitializing(false);
      }
    );

    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <CartProvider>
      <Slot />
    </CartProvider>
  );
}