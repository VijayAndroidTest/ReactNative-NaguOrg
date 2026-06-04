import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import * as Linking from 'expo-linking';
import { router } from 'expo-router';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

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
    clearCart,
  } = context;

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.DP * item.quantity,
    0
  );

  const placeOrder = async () => {
    Alert.alert(
      'Confirm Order',
      `Total Amount ₹${total}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Order',
          onPress: async () => {
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

            const url =
              `https://wa.me/916374807852?text=${message}`;

            await Linking.openURL(url);

            await clearCart();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.backArrow}>
              ←
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Shopping Cart
          </Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🛒
            </Text>

            <Text style={styles.emptyTitle}>
              Cart is Empty
            </Text>

            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Text
                style={styles.continueShopping}
              >
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) =>
                item.id.toString()
              }
              contentContainerStyle={{
                paddingBottom: 140,
              }}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: item.image,
                    }}
                    style={
                      styles.productImage
                    }
                  />

                  <View style={styles.details}>
                    <Text
                      style={styles.name}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={styles.price}
                    >
                      ₹{item.DP}
                    </Text>

                    <View
                      style={styles.qtyRow}
                    >
                      <TouchableOpacity
                        style={
                          styles.qtyBtn
                        }
                        onPress={() =>
                          decreaseQty(
                            item.id
                          )
                        }
                      >
                        <Text
                          style={
                            styles.qtyText
                          }
                        >
                          -
                        </Text>
                      </TouchableOpacity>

                      <Text
                        style={styles.qty}
                      >
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        style={
                          styles.qtyBtn
                        }
                        onPress={() =>
                          increaseQty(
                            item.id
                          )
                        }
                      >
                        <Text
                          style={
                            styles.qtyText
                          }
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={
                        styles.subtotal
                      }
                    >
                      Subtotal ₹
                      {item.DP *
                        item.quantity}
                    </Text>
                  </View>
                </View>
              )}
            />

            <View
              style={styles.bottomBar}
            >
              <View>
                <Text>Total</Text>

                <Text
                  style={styles.total}
                >
                  ₹{total}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.buyBtn}
                onPress={placeOrder}
              >
                <Text
                  style={styles.buyText}
                >
                  Order via WhatsApp
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  backArrow: {
    fontSize: 28,
    marginRight: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 80,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  continueShopping: {
    marginTop: 15,
    color: '#25D366',
    fontWeight: 'bold',
    fontSize: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
    elevation: 5,
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
    bottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
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