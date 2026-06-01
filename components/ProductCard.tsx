import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Product } from '../types';

interface Props {
  item: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ item, onAddToCart }: Props) {
  return (
    <View style={styles.card}>

      
      {/* Discount Badge */}
      {item.discount && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.discount}% OFF</Text>
        </View>
      )}
      
      {/* Product Image */}
      <Image source={{ uri: item.image}} style={styles.image} />
      
      {/* Product Name */}
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      
      {/* Pricing */}
      <View style={styles.priceRow}>
        <Text style={styles.mrp}>MRP: ₹{item.MRP}</Text>
        <Text style={styles.dp}>DP: ₹{item.DP}</Text>
      </View>
      
      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.button} onPress={onAddToCart ? onAddToCart : () => console.log("Default action")}>
        <Text style={styles.buttonText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    flex: 1, 
    margin: 8, 
    padding: 10, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    elevation: 3,
    position: 'relative' // Needed for the absolute positioned badge
  },
  badge: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: '#d32f2f', 
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1, 
    borderRadius: 4 
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  image: { width: '100%', height: 120, resizeMode: 'contain', marginBottom: 10 },
  name: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  mrp: { textDecorationLine: 'line-through', color: 'gray', fontSize: 12 },
  dp: { color: 'green', fontWeight: 'bold' },
  button: { backgroundColor: '#2e7d32', padding: 8, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});