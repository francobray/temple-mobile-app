import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Clock, Phone, MessageCircle, User } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';

interface OrderTrackingData {
  orderNumber: string;
  status: OrderStatus;
  estimatedTime: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  driver?: {
    name: string;
    rating: number;
    vehicle: string;
    phone: string;
  };
  realTimeTracking: boolean;
}

const statusSteps = [
  { key: 'placed', label: 'Order Placed', description: 'Your order has been placed' },
  { key: 'confirmed', label: 'Order Confirmed', description: 'Restaurant confirmed your order' },
  { key: 'preparing', label: 'Preparing', description: 'Your food is being prepared' },
  { key: 'ready', label: 'Ready', description: 'Your order is ready' },
  { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Driver is on the way' },
  { key: 'delivered', label: 'Delivered', description: 'Order delivered successfully' },
];

export default function OrderTrackingScreen() {
  const { id, orderData: orderDataParam } = useLocalSearchParams();
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('confirmed');
  const [estimatedTime, setEstimatedTime] = useState('25-35 min');

  // Parse order data from params or use fallback
  const parsedOrderData = orderDataParam ? JSON.parse(orderDataParam as string) : null;
  
  // Use passed order data or fallback to mock data
  const orderData: OrderTrackingData = {
    orderNumber: id as string,
    status: currentStatus,
    estimatedTime,
    customerInfo: parsedOrderData?.customerInfo || {
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
    },
    deliveryAddress: parsedOrderData?.deliveryAddress ? {
      street: parsedOrderData.deliveryAddress.address,
      city: parsedOrderData.deliveryAddress.city,
      state: parsedOrderData.deliveryAddress.state,
      zip: parsedOrderData.deliveryAddress.zip,
    } : {
      street: '123 Main Street',
      city: 'Miami',
      state: 'FL',
      zip: '33130',
    },
    driver: currentStatus === 'out_for_delivery' ? {
      name: 'Alex',
      rating: 4.9,
      vehicle: 'White Honda Civic',
      phone: '+1 (555) 987-6543',
    } : undefined,
    realTimeTracking: currentStatus === 'out_for_delivery',
  };

  // Simulate order status progression
  useEffect(() => {
    const statusProgression: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    let currentIndex = 1; // Start at 'confirmed'

    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
        
        // Update estimated time based on status
        switch (statusProgression[currentIndex]) {
          case 'ready':
            setEstimatedTime('Ready now');
            break;
          case 'out_for_delivery':
            setEstimatedTime('1 min');
            break;
          case 'delivered':
            setEstimatedTime('Delivered');
            break;
        }
      } else {
        clearInterval(interval);
      }
    }, 10000); // Progress every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getStatusIndex = (status: OrderStatus) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const renderStatusProgress = () => {
    const currentIndex = getStatusIndex(currentStatus);
    
    return (
      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>
            {currentStatus === 'delivered' ? 'Delivered!' : 
             currentStatus === 'out_for_delivery' ? 'Almost here!' : 
             currentStatus === 'ready' ? 'Ready for pickup!' :
             currentStatus === 'preparing' ? 'Being prepared...' : 'Order confirmed!'}
          </Text>
        </View>
        
        <Text style={styles.arrivalTime}>Arriving at {estimatedTime}</Text>
        
        <View style={styles.stagesContainer}>
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;
            
            return (
              <View key={step.key} style={styles.stageRow}>
                <View style={styles.stageIndicatorContainer}>
                  <View style={[
                    styles.stageIndicator,
                    isCompleted && styles.completedStageIndicator,
                    isActive && styles.activeStageIndicator,
                  ]}>
                    {isCompleted ? (
                      <Text style={styles.checkmark}>✓</Text>
                    ) : (
                      <Text style={[
                        styles.stageNumber,
                        isActive && styles.activeStageNumber,
                      ]}>
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  {index < statusSteps.length - 1 && (
                    <View style={[
                      styles.stageLine,
                      isCompleted && styles.completedStageLine,
                    ]} />
                  )}
                </View>
                <View style={styles.stageContent}>
                  <Text style={[
                    styles.stageLabel,
                    isActive && styles.activeStageLabel,
                  ]}>
                    {step.label}
                  </Text>
                  <Text style={styles.stageDescription}>
                    {step.description}
                  </Text>
                </View>
              </View>
            );
          })}
          </View>
        
        {currentStatus === 'out_for_delivery' && (
          <View style={styles.driverMessageContainer}>
            <Text style={styles.driverMessage}>Time to meet Alex at the door</Text>
            <View style={styles.latestArrivalContainer}>
              <Text style={styles.latestArrival}>Latest arrival by 12:50 PM</Text>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>i</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCustomerInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <User size={20} color={Colors.primary.main} />
        <Text style={styles.sectionTitle}>Customer Information</Text>
      </View>
      <View style={styles.customerInfo}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerInitials}>JD</Text>
        </View>
        <View style={styles.customerDetails}>
          <Text style={styles.customerName}>{orderData.customerInfo.name}</Text>
          <Text style={styles.customerContact}>{orderData.customerInfo.phone}</Text>
          <Text style={styles.customerContact}>{orderData.customerInfo.email}</Text>
        </View>
      </View>
    </View>
  );

  const renderDeliveryAddress = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MapPin size={20} color={Colors.primary.main} />
        <Text style={styles.sectionTitle}>Delivery Address</Text>
      </View>
      <Text style={styles.addressText}>
        {orderData.deliveryAddress.street}
      </Text>
      <Text style={styles.addressText}>
        {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} {orderData.deliveryAddress.zip}
      </Text>
    </View>
  );

  const renderDriverInfo = () => {
    if (!orderData.driver) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Driver</Text>
        <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitials}>AL</Text>
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{orderData.driver.name}</Text>
            <Text style={styles.driverRating}>⭐ {orderData.driver.rating} • {orderData.driver.vehicle}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.driverActionButton}>
              <Phone size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.driverActionButton}>
              <MessageCircle size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderTrackingMap = () => (
    <View style={styles.section}>
      <View style={styles.mapPlaceholder}>
        <MapPin size={40} color={Colors.text.tertiary} />
        <Text style={styles.mapPlaceholderText}>
          {orderData.realTimeTracking 
            ? `${orderData.driver?.name} is on the way`
            : 'Real-time tracking coming soon'
          }
        </Text>
        <Text style={styles.mapSubtext}>
          {orderData.realTimeTracking
            ? '21 mins • 8.2 mi away'
            : 'Once your food is out for delivery, we\'ll show you the driver\'s location and route in real-time on this map.'
          }
        </Text>
        <View style={styles.currentStatusContainer}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.currentStatusText}>
            Current status: {statusSteps[getStatusIndex(currentStatus)]?.label}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Order Tracking" showBackButton />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStatusProgress()}
        {renderTrackingMap()}
        {renderCustomerInfo()}
        {renderDeliveryAddress()}
        {renderDriverInfo()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Order Again"
          onPress={() => router.push('/menu')}
          size="lg"
          fullWidth
          style={styles.orderAgainButton}
        />
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  statusContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusHeader: {
    marginBottom: 8,
  },
  statusTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  arrivalTime: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  stagesContainer: {
    marginBottom: 20,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stageIndicatorContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stageIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
  },
  completedStageIndicator: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  activeStageIndicator: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  stageNumber: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  activeStageNumber: {
    color: Colors.white,
  },
  stageLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.background.tertiary,
    marginTop: 4,
  },
  completedStageLine: {
    backgroundColor: Colors.primary.main,
  },
  stageContent: {
    flex: 1,
    paddingTop: 4,
  },
  stageLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  activeStageLabel: {
    color: Colors.primary.main,
  },
  stageDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  driverMessageContainer: {
    marginTop: 8,
  },
  driverMessage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  latestArrivalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  latestArrival: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 8,
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    color: Colors.background.card,
  },
  activeStatusLabel: {
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
  },
  statusLine: {
    position: 'absolute',
    top: 20,
    left: '70%',
    width: '60%',
    height: 2,
    backgroundColor: Colors.grey[600],
    zIndex: -1,
  },
  activeStatusLine: {
    backgroundColor: Colors.primary.main,
  },
  section: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInitials: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.white,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  customerContact: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInitials: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.black,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  driverRating: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  driverActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
  },
  mapPlaceholderText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  mapSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  currentStatusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  footer: {
    backgroundColor: Colors.background.card,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  orderAgainButton: {
    marginBottom: 12,
  },
  helpButton: {
    alignItems: 'center',
    padding: 8,
  },
  helpButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.secondary,
  },
});