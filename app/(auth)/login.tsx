import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '924827024871-ojjn6cajlevvta20d4mv6pkqg1u2b94q.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('ID TOKEN NOT FOUND');

      const credential = auth.GoogleAuthProvider.credential(idToken);
      const result = await auth().signInWithCredential(credential);

      // Fetch user profile from Firestore
      const userDoc = await firestore().collection('users').doc(result.user.uid).get();
      const data = userDoc.data();
      
      // Strict Check: User is 'existing' only if document exists AND has phone/name
     // Strict validation: Ensures phone is a non-empty string and name is a non-empty string
const isProfileComplete = 
  userDoc.exists && 
  typeof data?.phone === 'string' && data.phone.trim().length >= 10 &&
  typeof data?.name === 'string' && data.name.trim().length > 0;

      if (isProfileComplete) {
        console.log('Existing user detected: Auto-logging in');
        await AsyncStorage.removeItem('guestMode');
        router.replace('/');
      } else {
        console.log('New user or incomplete profile: Redirecting to setup');
        setTempUser(result.user);
        setName(result.user.displayName || '');
        setIsNewUser(true);
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', error?.message || 'Unknown Error');
    }
  };

  const saveProfile = async () => {
    if (!tempUser || !name.trim() || !/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Please fill in all details correctly (10-digit phone)');
      return;
    }

    try {
      // Use set with merge: true to avoid overwriting auth metadata
      await firestore().collection('users').doc(tempUser.uid).set({
        uid: tempUser.uid,
        email: tempUser.email,
        name: name.trim(),
        phone,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      await AsyncStorage.removeItem('guestMode');
      router.replace('/');
    } catch (error) {
      console.error('Profile Save Error:', error);
      Alert.alert('Error', 'Could not save profile');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('guestMode', 'true');
    router.replace('/');
  };

  if (isNewUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Complete Profile</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
        <TouchableOpacity style={styles.primaryButton} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, padding: 15, marginBottom: 15, borderRadius: 10 },
  primaryButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 10 },
  googleButton: { backgroundColor: '#DB4437', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  skipButton: { marginTop: 20, alignItems: 'center' },
  skipText: { textDecorationLine: 'underline' },
});