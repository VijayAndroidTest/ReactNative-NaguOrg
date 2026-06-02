import { useState } from 'react';
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
import ProductCard from 'components/ProductCard';
import { useProducts } from 'hooks/useProducts';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All category");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All category", "Personal Care Products", "Health Care Products", 
    "Cosmetics", "Kitchen Spices", "Home Care Products", "Gym Products", "Common Products"
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All category" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

const auth = getAuth();

const handleAddToCart = (item: any) => {
  console.log('ADD TO CART CLICKED');

  if (!auth.currentUser) {
    console.log('USER NOT LOGGED IN');

    Alert.alert(
      'Login Required',
      'Please login to add items to cart',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK PRESSED');
            router.push('/(auth)/login');
          },
        },
      ]
    );

    return;
  }

  console.log('Added:', item.name);
};



const handleLogout = async () => {
  await AsyncStorage.removeItem('guestMode');

  const auth = getAuth();
  await signOut(auth);

  router.replace('/(auth)/login');
};

  if (loading) return <ActivityIndicator size="large" />;


  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>NAGU ORGANICS</Text>
      
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
  itemText: { fontSize: 16, color: '#000' }
});