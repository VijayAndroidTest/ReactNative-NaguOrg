import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const initialize = async () => {
      const guest = await AsyncStorage.getItem('guestMode');
      setIsGuest(guest === 'true');

      const auth = getAuth();

      onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setInitializing(false);
      });
    };

    initialize();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !isGuest && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (user  && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isGuest, initializing, segments]);

  if (initializing) return null;

  return <Slot />;
}