import { useState, useEffect , useContext } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import ProductCard from '../components/ProductCard';
import { useProducts } from 'hooks/useProducts';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
 import * as Location from 'expo-location';
 import { getDistance } from 'geolib';
import * as Linking from 'expo-linking';

import { CartContext } from '../context/CartContext'; // Add this import

export default function HomeScreen() {
const { addToCart } = useContext(CartContext);

  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All category");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [distanceKm, setDistanceKm] =
  useState<string>('');

const shopLat = 11.1875987;
const shopLng = 77.2782647;

  const categories = [
    "All category", "Personal Care Products", "Health Care Products", 
    "Cosmetics", "Kitchen Spices", "Home Care Products", "Gym Products", "Common Products"
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All category" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


useEffect(() => {
  getUserLocation();
}, []);
 

const getUserLocation = async () => {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Location Permission',
        'Location permission denied'
      );
      return;
    }

    const location =
      await Location.getCurrentPositionAsync({});

    const userLat =
      location.coords.latitude;

    const userLng =
      location.coords.longitude;

    const distance = getDistance(
      {
        latitude: userLat,
        longitude: userLng,
      },
      {
        latitude: shopLat,
        longitude: shopLng,
      }
    );

    setDistanceKm(
      (distance / 1000).toFixed(1)
    );
  } catch (error) {
    console.log(error);
  }
};

const openDirections = async () => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${shopLat},${shopLng}`;

  console.log('MAP URL:', url);

  try {
    await Linking.openURL(url);
    console.log('MAP OPENED');
  } catch (e) {
    console.log('MAP ERROR:', e);
  }
};
const auth = getAuth();

const handleAddToCart = async (item: any) => {
  const guestMode =
    await AsyncStorage.getItem('guestMode');

  if (!auth.currentUser || guestMode === 'true') {
    Alert.alert(
      'Login Required',
      'Please login to add items to cart'
    );

    router.push('/(auth)/login');
    return;
  }
addToCart(item);
  Alert.alert("Added", `${item.name} added to cart.`);
  console.log('Added:', item.name);
};



const handleLogout = async () => {
  await AsyncStorage.removeItem('guestMode');

  const auth = getAuth();

  await signOut(auth);

  await GoogleSignin.signOut(); // important

  router.replace('/(auth)/login');
};

  if (loading) return <ActivityIndicator size="large" />;


  return ( 
    <View style={styles.container}>

              <View style={styles.headerContainer}>
  <Text style={styles.headerTitle}>NAGU ORGANICS</Text>
  
  
</View>


     
      <View style={styles.locationCard}>
  <Text style={styles.locationTitle}>
    Nagu Organics Store
  </Text>

  <Text style={styles.locationText}>
    Distance:
    {distanceKm
      ? ` ${distanceKm} km`
      : ' Calculating...'}
  </Text>

  <TouchableOpacity
    style={styles.directionButton}
    onPress={openDirections}
  >
    <Text style={styles.directionText}>
      Get Directions
    </Text>
  </TouchableOpacity>
  
</View>


      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TextInput 
        style={styles.searchBar} 
        placeholder="Search..." 
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedCategory}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={styles.item} onPress={() => {
                setSelectedCategory(cat);
                setModalVisible(false);
              }}>
                <Text style={styles.itemText}>{cat}</Text>
              </TouchableOpacity>
            ))}

            
          </View>
        </TouchableOpacity>

      </Modal>

<FlatList
  data={filteredProducts}
  keyExtractor={(item) => item.id}
  numColumns={2}
renderItem={({ item }) => (
  <ProductCard
    item={item}
    onAddToCart={() => handleAddToCart(item)}
  />
)}
      />

      {/* ADDED: Floating Green Cart Button */}
      <TouchableOpacity 
        style={styles.floatingCart} 
        onPress={() => router.push('/cart')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>🛒 Cart</Text>
      </TouchableOpacity>
    </View>
  );


}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#1a1a1a' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  logoutButton: { position: 'absolute', top: 10, right: 10, padding: 10 },
  logoutText: { color: '#ff4444' },
  searchBar: { backgroundColor: '#2a2a2a', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  dropdown: { padding: 15, borderWidth: 1, borderColor: '#4a4a4a', borderRadius: 8, marginBottom: 10, backgroundColor: '#2a2a2a' },
  dropdownText: { color: '#fff', fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 10 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, color: '#000' },
  locationCard: {
  backgroundColor: '#2a2a2a',
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
},

locationTitle: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},

locationText: {
  color: '#fff',
  marginTop: 5,
},

directionButton: {
  marginTop: 10,
  backgroundColor: '#007AFF',
  padding: 10,
  borderRadius: 8,
},

directionText: {
  color: '#fff',
  textAlign: 'center',
},
headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#1a1a1a' // Match background
  },
  cartIcon: { 
    padding: 10, 
    backgroundColor: '#2e7d32', // Green color
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  floatingCart: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2e7d32', // Green color
    padding: 20,
    borderRadius: 30,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100, // Keeps it on top of other elements
  },
});