import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, Clock, ChevronRight, User } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import AddressSelectionModal from '@/components/checkout/AddressSelectionModal';
import PaymentMethodModal from '@/components/checkout/PaymentMethodModal';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

// Mock data for saved addresses and payment methods
const savedAddresses = [
  {
    id: '1',
    type: 'Home',
    address: '123 Main Street',
    city: 'Miami',
    state: 'FL',
    zip: '33130',
  },
];

const paymentMethods = [
  {
    id: '1',
    type: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
  },
];

type DeliveryOption = 'delivery' | 'pickup';
type PaymentMethod = typeof paymentMethods[0];
type Address = typeof savedAddresses[0];

export default function CheckoutScreen() {
  const router = useRouter();
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('delivery');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(savedAddresses[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(paymentMethods[0]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com'
  });

  // Mock order summary data
  const subtotal = 31.97;
  const tax = subtotal * 0.0825; // 8.25% tax
  const deliveryFee = deliveryOption === 'delivery' ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = () => {
    // Generate random order number
    const orderNumber = Math.floor(Math.random() * 900000) + 100000;
    
    // Prepare order data to pass to tracking screen
    const orderData = {
      orderNumber,
      customerInfo,
      deliveryAddress: selectedAddress,
      deliveryOption,
      paymentMethod: selectedPayment,
      specialInstructions,
      total,
      subtotal,
      tax,
      deliveryFee
    };
    
    // Store order data (in a real app, this would be saved to a database)
    // For now, we'll use AsyncStorage or a similar approach
    router.push({
      pathname: `/order-tracking/${orderNumber}`,
      params: {
        orderData: JSON.stringify(orderData)
      }
    });
  };

  const handleAddressChange = () => {
    setShowAddressModal(true);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handlePaymentChange = () => {
    setShowPaymentModal(true);
  };

  const handleSelectPayment = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
  };

  const renderDeliveryOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Options</Text>
      <View style={styles.deliveryOptions}>
        <TouchableOpacity
          style={[
            styles.deliveryOption,
            deliveryOption === 'delivery' && styles.selectedDeliveryOption,
          ]}
          onPress={() => setDeliveryOption('delivery')}
        >
          <Text style={[
            styles.deliveryOptionText,
            deliveryOption === 'delivery' && styles.selectedDeliveryOptionText,
          ]}>Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deliveryOption,
            deliveryOption === 'pickup' && styles.selectedDeliveryOption,
          ]}
          onPress={() => setDeliveryOption('pickup')}
        >
          <Text style={[
            styles.deliveryOptionText,
            deliveryOption === 'pickup' && styles.selectedDeliveryOptionText,
          ]}>Pickup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCustomerInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <User size={24} color={Colors.primary.main} />
        <Text style={styles.sectionTitle}>Customer Information</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customerInfo.name}</Text>
        <Text style={styles.customerDetail}>{customerInfo.phone}</Text>
        <Text style={styles.customerDetail}>{customerInfo.email}</Text>
      </View>
    </View>
  );

  const renderAddressSection = () => (
    deliveryOption === 'delivery' && (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={24} color={Colors.primary.main} />
          <Text style={styles.sectionTitle}>Delivery Address</Text>
        </View>
        <TouchableOpacity 
          style={styles.clickableCard}
          onPress={handleAddressChange}
        >
          {selectedAddress ? (
            <View style={styles.addressContainer}>
              <View style={styles.addressInfo}>
                <Text style={styles.addressType}>{selectedAddress.type}</Text>
                <Text style={styles.addressText}>
                  {selectedAddress.address}
                </Text>
                <Text style={styles.addressText}>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </View>
          ) : (
            <View style={styles.addNewContainer}>
              <Text style={styles.addNewText}>Add New Address</Text>
              <ChevronRight size={20} color={Colors.primary.main} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    )
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <CreditCard size={24} color={Colors.primary.main} />
        <Text style={styles.sectionTitle}>Payment Method</Text>
      </View>
      <TouchableOpacity 
        style={styles.clickableCard}
        onPress={() => handlePaymentChange()}
      >
        {selectedPayment ? (
          <View style={styles.paymentContainer}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentType}>{selectedPayment.brand}</Text>
              <Text style={styles.paymentText}>
                •••• {selectedPayment.last4}
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </View>
        ) : (
          <View style={styles.addNewContainer}>
            <Text style={styles.addNewText}>Add Payment Method</Text>
            <ChevronRight size={20} color={Colors.primary.main} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderDeliveryTime = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={24} color={Colors.primary.main} />
        <Text style={styles.sectionTitle}>Estimated {deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'} Time</Text>
      </View>
      <Text style={styles.deliveryTimeText}>
        {deliveryOption === 'delivery' ? '25-35 minutes' : '15-20 minutes'}
      </Text>
    </View>
  );

  const renderSpecialInstructions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Special Instructions</Text>
      <TextInput
        style={styles.instructionsInput}
        placeholder="Add any special instructions..."
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        multiline
        numberOfLines={3}
        placeholderTextColor={Colors.text.tertiary}
      />
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>
      {deliveryOption === 'delivery' && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
        </View>
      )}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax</Text>
        <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Checkout" showBackButton />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderDeliveryOptions()}
        {renderCustomerInfo()}
        {renderAddressSection()}
        {renderPaymentSection()}
        {renderDeliveryTime()}
        {renderSpecialInstructions()}
        {renderOrderSummary()}
      </ScrollView>

      <AddressSelectionModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleSelectAddress}
        currentAddress={selectedAddress}
      />

      <PaymentMethodModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectPayment={handleSelectPayment}
        currentPayment={selectedPayment}
      />

      <View style={styles.footer}>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
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
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  deliveryOption: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDeliveryOption: {
    backgroundColor: Colors.primary.main,
  },
  deliveryOptionText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  selectedDeliveryOptionText: {
    color: Colors.white,
  },
  customerInfo: {
    marginTop: 8,
  },
  customerName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  customerDetail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressInfo: {
    flex: 1,
  },
  clickableCard: {
    borderRadius: 8,
  },
  addressType: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentType: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  paymentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  addNewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  addNewText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  deliveryTimeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  instructionsInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: Colors.background.tertiary,
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
  footer: {
    backgroundColor: Colors.background.card,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
});