import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, ShoppingBag, Truck, Clock, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface PickupDeliveryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'pickup' | 'delivery', time?: string, date?: string) => void;
  locationName: string;
}

interface DeliveryDateTime {
  date: string;
  time: string;
  isASAP: boolean;
}

export default function PickupDeliveryModal({
  visible,
  onClose,
  onSelect,
  locationName,
}: PickupDeliveryModalProps) {
  const [selectedType, setSelectedType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedTime, setSelectedTime] = useState<string>('ASAP');
  const [deliveryDateTime, setDeliveryDateTime] = useState<DeliveryDateTime>({
    date: 'today',
    time: 'ASAP',
    isASAP: true,
  });

  const pickupTimeOptions = [
    'ASAP',
    '15 min',
    '30 min', 
    '45 min',
    '1 hour',
  ];

  // Generate next 7 days including today
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = i === 0 ? 'Today' : 
                     i === 1 ? 'Tomorrow' : 
                     date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      dates.push({
        key: i === 0 ? 'today' : date.toISOString().split('T')[0],
        label: dayName,
        date: dateStr,
        fullDate: date,
      });
    }
    
    return dates;
  };

  const generateTimeSlots = () => {
    const times = ['ASAP'];
    const now = new Date();
    const isToday = deliveryDateTime.date === 'today';
    
    // Generate time slots from 11 AM to 10 PM
    for (let hour = 11; hour <= 22; hour++) {
      const time = new Date();
      time.setHours(hour, 0, 0, 0);
      
      // If it's today, only show future times (at least 30 min from now)
      if (isToday) {
        const minTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
        if (time < minTime) continue;
      }
      
      const timeStr = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
      times.push(timeStr);
    }
    
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeSlots = generateTimeSlots();

  // Reset state when modal opens
  React.useEffect(() => {
    if (visible) {
      setSelectedType('pickup');
      setSelectedTime('ASAP');
      setDeliveryDateTime({
        date: 'today',
        time: 'ASAP',
        isASAP: true,
      });
    }
  }, [visible]);

  const handleConfirm = () => {
    if (selectedType === 'delivery') {
      const timeString = deliveryDateTime.isASAP ? 'ASAP' : 
                        `${deliveryDateTime.time} on ${dateOptions.find(d => d.key === deliveryDateTime.date)?.label}`;
      onSelect(selectedType, timeString, deliveryDateTime.date);
    } else {
      onSelect(selectedType, selectedTime);
    }
    onClose();
  };

  const handleDeliveryDateSelect = (dateKey: string) => {
    setDeliveryDateTime(prev => ({
      ...prev,
      date: dateKey,
      time: 'ASAP',
      isASAP: true,
    }));
  };

  const handleDeliveryTimeSelect = (time: string) => {
    setDeliveryDateTime(prev => ({
      ...prev,
      time,
      isASAP: time === 'ASAP',
    }));
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

          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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

            {/* Pickup Time Selection */}
            {selectedType === 'pickup' && (
              <View style={styles.timeSection}>
                <View style={styles.timeSectionHeader}>
                  <Clock size={20} color={Colors.text.primary} />
                  <Text style={styles.timeSectionTitle}>When do you want it?</Text>
                </View>
                
                <View style={styles.timeOptions}>
                  {pickupTimeOptions.map((time) => (
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
            )}

            {/* Delivery Date & Time Selection */}
            {selectedType === 'delivery' && (
              <View style={styles.deliveryScheduling}>
                <View style={styles.timeSectionHeader}>
                  <Clock size={20} color={Colors.text.primary} />
                  <Text style={styles.timeSectionTitle}>When do you want it?</Text>
                </View>

                {/* Date Selection */}
                <View style={styles.dateSection}>
                  <View style={styles.dateSectionHeader}>
                    <Calendar size={16} color={Colors.text.secondary} />
                    <Text style={styles.dateSectionTitle}>Select Date</Text>
                  </View>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateOptions}
                  >
                    {dateOptions.map((date) => (
                      <TouchableOpacity
                        key={date.key}
                        style={[
                          styles.dateOption,
                          deliveryDateTime.date === date.key && styles.selectedDateOption,
                        ]}
                        onPress={() => handleDeliveryDateSelect(date.key)}
                      >
                        <Text style={[
                          styles.dateOptionLabel,
                          deliveryDateTime.date === date.key && styles.selectedDateOptionLabel,
                        ]}>
                          {date.label}
                        </Text>
                        <Text style={[
                          styles.dateOptionDate,
                          deliveryDateTime.date === date.key && styles.selectedDateOptionDate,
                        ]}>
                          {date.date}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Time Selection */}
                <View style={styles.timeSection}>
                  <View style={styles.dateSectionHeader}>
                    <Clock size={16} color={Colors.text.secondary} />
                    <Text style={styles.dateSectionTitle}>Select Time</Text>
                  </View>
                  <View style={styles.timeOptions}>
                    {timeSlots.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeOption,
                          deliveryDateTime.time === time && styles.selectedTimeOption,
                        ]}
                        onPress={() => handleDeliveryTimeSelect(time)}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          deliveryDateTime.time === time && styles.selectedTimeOptionText,
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
            </View>
          </ScrollView>

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
    height: '80%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    paddingBottom: 40,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 24,
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
  deliveryScheduling: {
    marginBottom: 20,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateSectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  dateOptions: {
    paddingHorizontal: 4,
    gap: 12,
  },
  dateOption: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: Colors.background.tertiary,
  },
  selectedDateOption: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '10',
  },
  dateOptionLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  selectedDateOptionLabel: {
    color: Colors.primary.main,
  },
  dateOptionDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  selectedDateOptionDate: {
    color: Colors.primary.main,
  },
});
