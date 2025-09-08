import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItem({
  name,
  price,
  quantity,
  imageUrl,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={onDecrement}
            style={styles.quantityButton}
          >
            <Minus size={16} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{quantity}</Text>
          
          <TouchableOpacity
            onPress={onIncrement}
            style={styles.quantityButton}
          >
            <Plus size={16} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Trash2 size={20} color={Colors.error.main} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text.primary,
  },
  price: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary.main,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    marginHorizontal: 12,
    color: Colors.text.primary,
  },
  removeButton: {
    padding: 8,
  },
});