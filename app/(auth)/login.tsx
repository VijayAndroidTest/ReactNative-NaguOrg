import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { db, auth } from '../../firebaseConfig';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
const [isNewUser, setIsNewUser] =
  useState(false);

const [tempUser, setTempUser] =
  useState<any>(null);
useEffect(() => {
  console.log('LOGIN SCREEN RENDERED');

  GoogleSignin.configure({
    webClientId:
      '924827024871-ojjn6cajlevvta20d4mv6pkqg1u2b94q.apps.googleusercontent.com',
    offlineAccess: true,
  });

  console.log('GOOGLE CONFIGURED');
}, []);

const createUserDocument = async (
  user: any,
  additionalData = {}
) => {
  try {
    console.log(
      'CHECKING USER DOC:',
      user.uid
    );

    const userRef =
      doc(db, 'users', user.uid);

    const snapshot =
      await getDoc(userRef);

    console.log(
      'DOC EXISTS:',
      snapshot.exists()
    );

    if (!snapshot.exists()) {
      console.log(
        'CREATING USER DOCUMENT'
      );

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        photoURL:
          user.photoURL || '',
        createdAt:
          serverTimestamp(),
        ...additionalData,
      });

      console.log(
        'USER DOCUMENT CREATED SUCCESSFULLY'
      );
    }
  } catch (error) {
    console.log(
      'FIRESTORE ERROR:',
      JSON.stringify(error, null, 2)
    );

    throw error;
  }
};

  const handleManualProfileSave = async () => {
    if (!name.trim() || phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid name and 10-digit phone number');
      return;
    }
    console.log('MANUAL PROFILE SAVE TRIGGERED');
    // Logic for non-Google users would go here
    Alert.alert('Success', 'Profile updated');
  };

const handleGoogleSignIn = async () => {
  try {
     console.log('GOOGLE LOGIN START');
    console.log('======================');
    console.log('GOOGLE LOGIN START');
    console.log('======================');
 console.log('ENTERED HANDLE GOOGLE SIGNIN');
    await GoogleSignin.hasPlayServices();

    console.log('PLAY SERVICES OK');

    const userInfo = await GoogleSignin.signIn();

    console.log(
      'GOOGLE RESPONSE',
      JSON.stringify(userInfo, null, 2)
    );

    const idToken = userInfo.data?.idToken;

    console.log('ID TOKEN FOUND:', !!idToken);

    if (!idToken) {
      throw new Error('ID TOKEN NOT FOUND');
    }

    const credential =
      GoogleAuthProvider.credential(idToken);

    console.log('FIREBASE CREDENTIAL CREATED');

    const result =
      await signInWithCredential(
        auth,
        credential
      );

    console.log(
      'FIREBASE LOGIN SUCCESS'
    );

    console.log(
      'USER UID:',
      result.user.uid
    );

    const userRef = doc(
      db,
      'users',
      result.user.uid
    );

    console.log(
      'CHECKING FIRESTORE USER'
    );

  const snapshot = await getDoc(
  doc(db, 'users', result.user.uid)
);

    console.log(
      'USER EXISTS:',
      snapshot.exists()
    );

 if (snapshot.exists()) {
  console.log('EXISTING USER');

  await AsyncStorage.removeItem(
    'guestMode'
  );

  router.replace('/');
  return;
}

   console.log('NEW USER');

    setTempUser(result.user);

setTempUser(result.user);

setName(
  result.user.displayName || ''
);

setIsNewUser(true);

  } catch (error: any) {
    console.log(
      'GOOGLE ERROR FULL:',
      error
    );

    console.log(
      'ERROR CODE:',
      error?.code
    );

    console.log(
      'ERROR MESSAGE:',
      error?.message
    );

    Alert.alert(
      'Google Login Failed',
      error?.message ||
        'Unknown Error'
    );
  }
};
const saveProfile = async () => {
  if (!tempUser) {
    Alert.alert(
      'Error',
      'Please sign in with Google first'
    );
    return;
  }

  if (!name.trim()) {
    Alert.alert(
      'Error',
      'Please enter your name'
    );
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    Alert.alert(
      'Error',
      'Please enter valid 10 digit phone number'
    );
    return;
  }

  try {
    console.log('SAVE PROFILE');

    await setDoc(
      doc(db, 'users', tempUser.uid),
      {
        uid: tempUser.uid,
        email: tempUser.email,
        name: name.trim(),
        phone,
        createdAt: serverTimestamp(),
      }
    );

    console.log('PROFILE SAVED');

    await AsyncStorage.removeItem('guestMode');

    router.replace('/');
  } catch (error) {
    console.log(error);
  }
};
  const handleSkip = async () => {
    console.log('SKIP BUTTON CLICKED');
    await AsyncStorage.setItem('guestMode', 'true');
    router.replace('/');
  };

if (isNewUser) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Complete Profile
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={saveProfile}
      >
        <Text style={styles.buttonText}>
          Save & Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

return (
  <View style={styles.container}>
    <Text style={styles.title}>
      Welcome Back
    </Text>

    <TouchableOpacity
      style={styles.googleButton}
      onPress={() => {
        console.log(
          'GOOGLE BUTTON PRESSED'
        );
        handleGoogleSignIn();
      }}
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, padding: 15, marginBottom: 15, borderRadius: 10 },
  primaryButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 10 },
  googleButton: { backgroundColor: '#DB4437', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  skipButton: { marginTop: 20, alignItems: 'center' },
  skipText: { textDecorationLine: 'underline' },
});