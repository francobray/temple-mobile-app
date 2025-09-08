import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/layout/Header';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useCart } from '@/contexts/CartContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { Star } from 'lucide-react-native';

export default function CartScreen() {
  const router = useRouter();
  const { items: cartItems, updateQuantity, removeItem } = useCart();
  const { calculateOrderPoints } = useLoyalty();

  const handleIncrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDecrement = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleRemove = (id: string) => {
    removeItem(id);
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

  // Calculate points to be earned
  const pointsToEarn = calculateOrderPoints(total);

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

            {/* Loyalty Points Preview */}
            <View style={styles.loyaltyContainer}>
              <View style={styles.loyaltyHeader}>
                <Star size={20} color={Colors.secondary.main} fill={Colors.secondary.main} />
                <Text style={styles.loyaltyTitle}>You'll Earn Points</Text>
              </View>
              <View style={styles.pointsPreview}>
                <Text style={styles.pointsPreviewText}>+{pointsToEarn} pts</Text>
                <Text style={styles.pointsSubtext}>
                  Complete this order to earn {pointsToEarn} loyalty points!
                </Text>
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
  loyaltyContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.secondary.main + '30',
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  pointsPreview: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pointsPreviewText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.secondary.main,
    marginBottom: 4,
  },
  pointsSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  checkoutButton: {
    marginBottom: 40,
  },
});