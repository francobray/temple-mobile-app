import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/layout/Header';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

// Mock cart data
const initialCartItems = [
  {
    id: '1',
    name: 'Temple Wolf IPA',
    price: 11,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
  },
  {
    id: '4',
    name: 'American Fries',
    price: 19,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleIncrement = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate delivery fee
  const deliveryFee = 3.99;

  // Calculate tax (8.25%)
  const tax = subtotal * 0.0825;

  // Calculate total
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <Header title="Shopping Cart" showBackButton />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Button
              title="Browse Menu"
              onPress={() => router.push('/menu')}
              style={styles.browseButton}
            />
          </View>
        ) : (
          <>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onIncrement={() => handleIncrement(item.id)}
                onDecrement={() => handleDecrement(item.id)}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
            
            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              style={styles.checkoutButton}
              size="lg"
              fullWidth
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 40,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyCartText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  browseButton: {
    width: 200,
  },
  summaryContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: Colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  totalLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  totalValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.primary.main,
  },
  checkoutButton: {
    marginBottom: 40,
  },
});