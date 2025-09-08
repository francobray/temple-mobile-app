import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useCart } from '@/contexts/CartContext';

interface CartIconWithBadgeProps {
  color: string;
  size: number;
}

export default function CartIconWithBadge({ color, size }: CartIconWithBadgeProps) {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <View style={styles.container}>
      <ShoppingBag size={size} color={color} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : itemCount.toString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.primary.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.background.card,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 14,
    textAlign: 'center',
  },
});
