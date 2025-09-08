import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Image
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Clock } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

// Mock order data (in a real app, this would come from a database)
const orders = {
  '1': {
    id: '1',
    orderNumber: 'TMP-2024-001',
    date: 'Today, 12:30 PM',
    status: 'Delivered',
    total: 31.97,
    items: [
      { 
        id: '1', 
        name: 'Buffalo Wings', 
        quantity: 1,
        price: 12.99,
        options: [
          { name: 'Size', value: '6 Pieces' },
          { name: 'Sauce Level', value: 'Medium' },
          { name: 'Dressing', value: 'Ranch' }
        ],
        imageUrl: 'https://images.pexels.com/photos/7627440/pexels-photo-7627440.jpeg'
      },
      { 
        id: '4', 
        name: 'Lemon Pepper Fries', 
        quantity: 1,
        price: 4.99,
        options: [
          { name: 'Size', value: 'Regular' },
          { name: 'Seasoning Level', value: 'Extra' }
        ],
        imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg'
      },
      { 
        id: '6', 
        name: 'Soda', 
        quantity: 1,
        price: 2.49,
        options: [
          { name: 'Size', value: 'Regular' }
        ],
        imageUrl: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg'
      }
    ],
    deliveryDetails: {
      type: 'Delivery',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      instructions: 'Please leave at the door'
    },
    timeline: [
      { time: '12:30 PM', status: 'Delivered', description: 'Order delivered successfully' },
      { time: '12:15 PM', status: 'Out for Delivery', description: 'Driver is on the way' },
      { time: '12:00 PM', status: 'Preparing', description: 'Restaurant is preparing your order' },
      { time: '11:45 AM', status: 'Confirmed', description: 'Order confirmed by restaurant' },
      { time: '11:45 AM', status: 'Placed', description: 'Order placed successfully' }
    ]
  },
  '2': {
    id: '2',
    orderNumber: 'TMP-2024-002',
    date: 'Yesterday, 7:15 PM',
    status: 'Delivered',
    total: 25.98,
    items: [
      { 
        id: '2', 
        name: 'BBQ Wings', 
        quantity: 2,
        price: 12.99,
        options: [
          { name: 'Size', value: '6 Pieces' },
          { name: 'Sauce Amount', value: 'Extra Sauce' },
          { name: 'Dressing', value: 'Blue Cheese' }
        ],
        imageUrl: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg'
      }
    ],
    deliveryDetails: {
      type: 'Delivery',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      instructions: 'Ring doorbell on delivery'
    },
    timeline: [
      { time: '7:15 PM', status: 'Delivered', description: 'Order delivered successfully' },
      { time: '7:00 PM', status: 'Out for Delivery', description: 'Driver is on the way' },
      { time: '6:45 PM', status: 'Preparing', description: 'Restaurant is preparing your order' },
      { time: '6:30 PM', status: 'Confirmed', description: 'Order confirmed by restaurant' },
      { time: '6:30 PM', status: 'Placed', description: 'Order placed successfully' }
    ]
  }
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const order = orders[id as string];

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Order Details" showBackButton />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Order not found</Text>
        </View>
      </View>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 3.99;
  const tax = subtotal * 0.0825; // 8.25% tax

  return (
    <View style={styles.container}>
      <Header title="Order Details" showBackButton />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status */}
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              order.status === 'Delivered' && styles.deliveredBadge
            ]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          {order.timeline.map((event, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              {index !== order.timeline.length - 1 && (
                <View style={styles.timelineLine} />
              )}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>{event.time}</Text>
                <Text style={styles.timelineStatus}>{event.status}</Text>
                <Text style={styles.timelineDescription}>{event.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Delivery Details</Text>
          </View>
          <View style={styles.deliveryDetails}>
            <Text style={styles.deliveryAddress}>
              {order.deliveryDetails.address}
            </Text>
            <Text style={styles.deliveryAddress}>
              {order.deliveryDetails.city}, {order.deliveryDetails.state} {order.deliveryDetails.zip}
            </Text>
            {order.deliveryDetails.instructions && (
              <Text style={styles.deliveryInstructions}>
                Note: {order.deliveryDetails.instructions}
              </Text>
            )}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.orderItem,
                index !== order.items.length - 1 && styles.orderItemBorder
              ]}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                {item.options.map((option, optionIndex) => (
                  <Text key={optionIndex} style={styles.itemOption}>
                    {option.name}: {option.value}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
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
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Reorder"
          onPress={() => {}}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey[100],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.grey[900],
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.grey[200],
  },
  deliveredBadge: {
    backgroundColor: Colors.success.light,
  },
  statusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.grey[900],
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary.main,
    marginTop: 6,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 18,
    bottom: -14,
    width: 2,
    backgroundColor: Colors.grey[300],
  },
  timelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  timelineTime: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.grey[900],
    marginBottom: 2,
  },
  timelineStatus: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: Colors.primary.main,
    marginBottom: 2,
  },
  timelineDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
  },
  deliveryDetails: {
    marginTop: 8,
  },
  deliveryAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.grey[800],
    marginBottom: 4,
  },
  deliveryInstructions: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    marginTop: 8,
    fontStyle: 'italic',
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  itemQuantity: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[700],
    marginTop: 4,
  },
  itemOption: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.grey[700],
  },
  summaryValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.grey[900],
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  totalLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.grey[900],
  },
  totalValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.primary.main,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.grey[700],
  },
});