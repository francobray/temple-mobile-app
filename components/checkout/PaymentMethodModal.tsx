import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X, CreditCard, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
}

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPayment: (payment: PaymentMethod) => void;
  currentPayment: PaymentMethod | null;
}

const savedPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Credit Card',
    last4: '1234',
    brand: 'Mastercard',
    expiryMonth: '08',
    expiryYear: '26',
  },
  {
    id: '3',
    type: 'Credit Card',
    last4: '5678',
    brand: 'American Express',
    expiryMonth: '03',
    expiryYear: '27',
  },
];

export default function PaymentMethodModal({
  visible,
  onClose,
  onSelectPayment,
  currentPayment,
}: PaymentMethodModalProps) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
  });

  const handleSelectPayment = (payment: PaymentMethod) => {
    onSelectPayment(payment);
    onClose();
  };

  const handleAddNewPayment = () => {
    if (newPayment.cardNumber && newPayment.expiryMonth && newPayment.expiryYear && newPayment.cvv && newPayment.cardholderName) {
      const payment: PaymentMethod = {
        id: Date.now().toString(),
        type: 'Credit Card',
        last4: newPayment.cardNumber.slice(-4),
        brand: getBrandFromCardNumber(newPayment.cardNumber),
        expiryMonth: newPayment.expiryMonth,
        expiryYear: newPayment.expiryYear,
      };
      onSelectPayment(payment);
      setNewPayment({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', cardholderName: '' });
      setShowAddNew(false);
      onClose();
    }
  };

  const getBrandFromCardNumber = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    return 'Unknown';
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setNewPayment({ ...newPayment, cardNumber: formatted.replace(/\s/g, '') });
    }
  };

  const getCardIcon = (brand: string) => {
    return <CreditCard size={20} color={Colors.primary.main} />;
  };

  if (showAddNew) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setShowAddNew(false)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Add Payment Method</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  value={newPayment.cardholderName}
                  onChangeText={(text) => setNewPayment({ ...newPayment, cardholderName: text })}
                  placeholder="Enter cardholder name"
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={formatCardNumber(newPayment.cardNumber)}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Expiry Month</Text>
                  <TextInput
                    style={styles.input}
                    value={newPayment.expiryMonth}
                    onChangeText={(text) => setNewPayment({ ...newPayment, expiryMonth: text })}
                    placeholder="MM"
                    placeholderTextColor={Colors.text.tertiary}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                  <Text style={styles.label}>Expiry Year</Text>
                  <TextInput
                    style={styles.input}
                    value={newPayment.expiryYear}
                    onChangeText={(text) => setNewPayment({ ...newPayment, expiryYear: text })}
                    placeholder="YY"
                    placeholderTextColor={Colors.text.tertiary}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={newPayment.cvv}
                    onChangeText={(text) => setNewPayment({ ...newPayment, cvv: text })}
                    placeholder="123"
                    placeholderTextColor={Colors.text.tertiary}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Add Payment Method"
                onPress={handleAddNewPayment}
                size="lg"
                fullWidth
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text style={styles.title}>Select Payment Method</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {savedPaymentMethods.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={[
                  styles.paymentCard,
                  currentPayment?.id === payment.id && styles.selectedPaymentCard,
                ]}
                onPress={() => handleSelectPayment(payment)}
              >
                <View style={styles.paymentHeader}>
                  {getCardIcon(payment.brand)}
                  <Text style={styles.paymentBrand}>{payment.brand}</Text>
                  {payment.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paymentNumber}>•••• {payment.last4}</Text>
                <Text style={styles.paymentExpiry}>
                  Expires {payment.expiryMonth}/{payment.expiryYear}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.addNewCard}
              onPress={() => setShowAddNew(true)}
            >
              <Plus size={24} color={Colors.primary.main} />
              <Text style={styles.addNewText}>Add New Payment Method</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  headerSpacer: {
    width: 24,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  backText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  paymentCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentCard: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '10',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentBrand: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.white,
  },
  paymentNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  paymentExpiry: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  addNewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    borderStyle: 'dashed',
  },
  addNewText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary.main,
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
});