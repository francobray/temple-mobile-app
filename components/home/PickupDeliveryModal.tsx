import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { X, ShoppingBag, Truck, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface PickupDeliveryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'pickup' | 'delivery', time?: string) => void;
  locationName: string;
}

export default function PickupDeliveryModal({
  visible,
  onClose,
  onSelect,
  locationName,
}: PickupDeliveryModalProps) {
  const [selectedType, setSelectedType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedTime, setSelectedTime] = useState<string>('ASAP');

  const timeOptions = [
    'ASAP',
    '15 min',
    '30 min', 
    '45 min',
    '1 hour',
  ];

  const handleConfirm = () => {
    onSelect(selectedType, selectedTime);
    onClose();
  };

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
            <Text style={styles.title}>Order Type</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.locationText}>
              From: {locationName}
            </Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedType === 'pickup' && styles.selectedOptionCard,
                ]}
                onPress={() => setSelectedType('pickup')}
              >
                <View style={styles.optionHeader}>
                  <ShoppingBag 
                    size={24} 
                    color={selectedType === 'pickup' ? Colors.primary.main : Colors.text.secondary} 
                  />
                  <Text style={[
                    styles.optionTitle,
                    selectedType === 'pickup' && styles.selectedOptionTitle,
                  ]}>
                    Pickup
                  </Text>
                </View>
                <Text style={styles.optionDescription}>
                  Ready in 10-15 minutes
                </Text>
                <Text style={styles.optionPrice}>Free</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedType === 'delivery' && styles.selectedOptionCard,
                ]}
                onPress={() => setSelectedType('delivery')}
              >
                <View style={styles.optionHeader}>
                  <Truck 
                    size={24} 
                    color={selectedType === 'delivery' ? Colors.primary.main : Colors.text.secondary} 
                  />
                  <Text style={[
                    styles.optionTitle,
                    selectedType === 'delivery' && styles.selectedOptionTitle,
                  ]}>
                    Delivery
                  </Text>
                </View>
                <Text style={styles.optionDescription}>
                  Delivered in 25-35 minutes
                </Text>
                <Text style={styles.optionPrice}>$2.99</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeSection}>
              <View style={styles.timeSectionHeader}>
                <Clock size={20} color={Colors.text.primary} />
                <Text style={styles.timeSectionTitle}>When do you want it?</Text>
              </View>
              
              <View style={styles.timeOptions}>
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      selectedTime === time && styles.selectedTimeOption,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      selectedTime === time && styles.selectedTimeOptionText,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title={`Confirm ${selectedType === 'pickup' ? 'Pickup' : 'Delivery'}`}
              onPress={handleConfirm}
              size="lg"
              fullWidth
            />
          </View>
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
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  content: {
    padding: 20,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
  },
  selectedOptionCard: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '10',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  selectedOptionTitle: {
    color: Colors.primary.main,
  },
  optionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  optionPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  timeSection: {
    marginBottom: 20,
  },
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeSectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    backgroundColor: Colors.background.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  selectedTimeOption: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  timeOptionText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedTimeOptionText: {
    color: Colors.white,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
});
