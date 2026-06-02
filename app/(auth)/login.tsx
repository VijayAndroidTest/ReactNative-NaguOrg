import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native';

import {
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../../firebaseConfig';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '924827024871-ojjn6cajlevvta20d4mv6pkqg1u2b94q.apps.googleusercontent.com',
    });
  }, []);

const handleSkip = async () => {
  console.log('SKIP BUTTON CLICKED');

  await AsyncStorage.setItem('guestMode', 'true');

  const value = await AsyncStorage.getItem('guestMode');
  console.log('guestMode =', value);
console.log(value);
  router.replace('/');
};

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('No ID Token');
      }

      const credential =
        GoogleAuthProvider.credential(idToken);

      await signInWithCredential(auth, credential);

      await AsyncStorage.removeItem('guestMode');

      router.replace('/');
    } catch (error: any) {
      Alert.alert('Google Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.buttonText}>
          Sign In with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>
          Skip for now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    textDecorationLine: 'underline',
  },
});