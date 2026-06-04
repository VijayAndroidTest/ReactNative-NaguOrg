import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import * as Linking from 'expo-linking';

import { CartContext } from '../context/CartContext';

export default function CartScreen() {
  const context = useContext(CartContext);

  if (!context) {
    return <Text>Context Null</Text>;
  }

  const {
    cart,
    increaseQty,
    decreaseQty,
  } = context;

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.DP * item.quantity,
    0
  );

  const placeOrder = async () => {
    let message =
      '*NAGU ORGANICS ORDER*%0A%0A';

    cart.forEach((item: any) => {
      message +=
        `📦 ${item.name}%0A` +
        `Qty: ${item.quantity}%0A` +
        `Price: ₹${item.DP}%0A` +
        `Subtotal: ₹${item.DP * item.quantity}%0A%0A`;
    });

    message += `*TOTAL: ₹${total}*`;

    const phone = '+916374807852';

    const url =
      `https://wa.me/${phone}?text=${message}`;

    await Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Shopping Cart
      </Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>
          Your cart is empty
        </Text>
      ) : (
        <>
          <FlatList
            data={cart}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            keyExtractor={(item) =>
              item.id.toString()
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={styles.productImage}
                />

                <View style={styles.details}>
                  <Text
                    style={styles.name}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  <Text style={styles.price}>
                    ₹{item.DP}
                  </Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        decreaseQty(item.id)
                      }
                    >
                      <Text
                        style={styles.qtyText}
                      >
                        -
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.qty}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        increaseQty(item.id)
                      }
                    >
                      <Text
                        style={styles.qtyText}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subtotal}>
                    Subtotal ₹
                    {item.DP *
                      item.quantity}
                  </Text>
                </View>
              </View>
            )}
          />

          <View style={styles.bottomBar}>
            <View>
              <Text>Total</Text>

              <Text style={styles.total}>
                ₹{total}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buyBtn}
              onPress={placeOrder}
            >
              <Text style={styles.buyText}>
                Order via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    padding: 15,
  },

  empty: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },

  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    resizeMode: 'contain',
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008000',
    marginTop: 6,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  qtyBtn: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  qty: {
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },

  subtotal: {
    marginTop: 10,
    fontWeight: '600',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  total: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008000',
  },

  buyBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});