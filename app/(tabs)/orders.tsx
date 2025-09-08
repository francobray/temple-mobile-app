import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { Clock, ShoppingBag, MapPin, Star } from 'lucide-react-native';

// Mock order data with Temple branding
const orders = [
  {
    id: '1',
    orderNumber: 'TMP-2024-001',
    date: 'Today, 12:30 PM',
    status: 'Delivered',
    total: 45.97,
    items: [
      { 
        id: '1', 
        name: 'Temple Wolf IPA', 
        quantity: 2,
        price: 11.00,
        imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg'
      },
      { 
        id: '4', 
        name: 'Wynwood Burger', 
        quantity: 1,
        price: 23.00,
        imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
      },
    ],
    restaurant: 'Temple Brickell',
    deliveryType: 'Delivery',
    rating: 5,
  },
  {
    id: '2',
    orderNumber: 'TMP-2024-002',
    date: 'Yesterday, 7:15 PM',
    status: 'Delivered',
    total: 32.50,
    items: [
      { 
        id: '2', 
        name: 'Temple Indie Lager', 
        quantity: 2,
        price: 10.00,
        imageUrl: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'
      },
      { 
        id: '6', 
        name: 'American Fries', 
        quantity: 1,
        price: 19.00,
        imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg'
      },
    ],
    restaurant: 'Temple Brickell',
    deliveryType: 'Pickup',
    rating: 4,
  },
  {
    id: '3',
    orderNumber: 'TMP-2024-003',
    date: 'Jan 15, 2024',
    status: 'Delivered',
    total: 28.99,
    items: [
      { 
        id: '8', 
        name: 'Flan & Dulce de Leche', 
        quantity: 1,
        price: 11.00,
        imageUrl: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg'
      },
      { 
        id: '3', 
        name: 'Temple Royal Amber', 
        quantity: 1,
        price: 10.00,
        imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg'
      },
    ],
    restaurant: 'Temple Brickell',
    deliveryType: 'Delivery',
    rating: 5,
  },
];

interface OrderCardProps {
  order: typeof orders[0];
  onReorder: () => void;
  onViewDetails: () => void;
  onRate: () => void;
}

function OrderCard({ order, onReorder, onViewDetails, onRate }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return Colors.success.main;
      case 'Preparing':
        return Colors.warning.main;
      case 'On the way':
        return Colors.tertiary.main;
      default:
        return Colors.text.secondary;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? Colors.secondary.main : Colors.background.tertiary}
        fill={index < rating ? Colors.secondary.main : 'transparent'}
      />
    ));
  };

  return (
    <View style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
          <View style={styles.restaurantInfo}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.restaurantName}>{order.restaurant}</Text>
            <Text style={styles.deliveryType}>• {order.deliveryType}</Text>
          </View>
        </View>
        <View style={styles.orderStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsTitle}>Items ({order.items.length})</Text>
          {order.status === 'Delivered' && (
            <View style={styles.ratingContainer}>
              {renderStars(order.rating)}
            </View>
          )}
        </View>
        
        <View style={styles.itemsList}>
          {order.items.map((item, index) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Order Actions */}
      <View style={styles.orderActions}>
        <Button
          title="Reorder"
          variant="outline"
          size="sm"
          onPress={onReorder}
          style={styles.actionButton}
        />
        <Button
          title="View Details"
          variant="primary"
          size="sm"
          onPress={onViewDetails}
          style={styles.actionButton}
        />
        {order.status === 'Delivered' && order.rating === 0 && (
          <Button
            title="Rate Order"
            variant="ghost"
            size="sm"
            onPress={onRate}
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('past');

  const handleReorder = (orderId: string) => {
    // In a real app, this would add items to cart
    router.push('/cart');
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleRate = (orderId: string) => {
    // In a real app, this would open a rating modal
    alert('Rating functionality would be implemented here');
  };

  const currentOrders = orders.filter(order => 
    order.status === 'Preparing' || order.status === 'On the way'
  );
  
  const pastOrders = orders.filter(order => 
    order.status === 'Delivered' || order.status === 'Cancelled'
  );

  const displayOrders = activeTab === 'current' ? currentOrders : pastOrders;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingBag size={80} color={Colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === 'current' ? 'No Current Orders' : 'No Past Orders'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'current' 
          ? 'You don\'t have any orders in progress'
          : 'Your order history will appear here'
        }
      </Text>
      <Button
        title="Browse Menu"
        onPress={() => router.push('/menu')}
        style={styles.emptyButton}
        size="lg"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Your Orders" />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Clock size={20} color={activeTab === 'current' ? Colors.primary.main : Colors.text.secondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'current' && styles.activeTabText
          ]}>
            Current ({currentOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <ShoppingBag size={20} color={activeTab === 'past' ? Colors.primary.main : Colors.text.secondary} />
          <Text style={[
            styles.tabText,
            activeTab === 'past' && styles.activeTabText
          ]}>
            Past ({pastOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onReorder={() => handleReorder(item.id)}
              onViewDetails={() => handleViewDetails(item.id)}
              onRate={() => handleRate(item.id)}
            />
          )}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 100 : 80,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.background.tertiary,
  },
  tabText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  activeTabText: {
    color: Colors.primary.main,
    fontFamily: 'Montserrat-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 50,
    padding: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text.secondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    width: 200,
  },
  ordersList: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  deliveryType: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  orderTotal: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.primary.main,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemsTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  itemsList: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    padding: 12,
    borderRadius: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  itemQuantity: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  itemPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.primary.main,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});