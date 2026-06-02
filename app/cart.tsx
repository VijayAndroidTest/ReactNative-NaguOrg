import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CartContext } from '../context/CartContext'; // Import the context

export default function CartScreen() {
  const { cart } = useContext(CartContext); // Destructure 'cart' from context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shopping Cart</Text>
      
      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name} - Qty: {item.quantity}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }
});