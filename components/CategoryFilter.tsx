import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 1. Define the props interface
interface Props {
  categories: string[];
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity 
          key={cat} 
          onPress={() => onSelect(cat)} 
          style={styles.chip}
        >
          <Text>{cat}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// 2. Define the styles object
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
});