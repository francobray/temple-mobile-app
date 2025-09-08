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
} from 'react-native';
import { X, MapPin, Plus, Chrome as Home, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  currentAddress: Address | null;
}

const savedAddresses: Address[] = [
  {
    id: '1',
    type: 'Home',
    address: '123 Main Street',
    city: 'Miami',
    state: 'FL',
    zip: '33130',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Work',
    address: '456 Business Ave',
    city: 'Miami',
    state: 'FL',
    zip: '33131',
  },
  {
    id: '3',
    type: 'Other',
    address: '789 Friend Street',
    city: 'Miami',
    state: 'FL',
    zip: '33132',
  },
];

export default function AddressSelectionModal({
  visible,
  onClose,
  onSelectAddress,
  currentAddress,
}: AddressSelectionModalProps) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  const handleAddNewAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.state && newAddress.zip) {
      const address: Address = {
        id: Date.now().toString(),
        ...newAddress,
      };
      onSelectAddress(address);
      setNewAddress({ type: 'Home', address: '', city: '', state: '', zip: '' });
      setShowAddNew(false);
      onClose();
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home size={20} color={Colors.primary.main} />;
      case 'work':
        return <Briefcase size={20} color={Colors.primary.main} />;
      default:
        return <MapPin size={20} color={Colors.primary.main} />;
    }
  };

  if (showAddNew) {
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
              <TouchableOpacity onPress={() => setShowAddNew(false)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Add New Address</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address Type</Text>
                <View style={styles.typeButtons}>
                  {['Home', 'Work', 'Other'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        newAddress.type === type && styles.selectedTypeButton,
                      ]}
                      onPress={() => setNewAddress({ ...newAddress, type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          newAddress.type === type && styles.selectedTypeButtonText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  style={styles.input}
                  value={newAddress.address}
                  onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
                  placeholder="Enter street address"
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={newAddress.city}
                    onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                    placeholder="City"
                    placeholderTextColor={Colors.text.tertiary}
                  />
                </View>

                <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={newAddress.state}
                    onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
                    placeholder="State"
                    placeholderTextColor={Colors.text.tertiary}
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>ZIP Code</Text>
                <TextInput
                  style={[styles.input, styles.zipInput]}
                  value={newAddress.zip}
                  onChangeText={(text) => setNewAddress({ ...newAddress, zip: text })}
                  placeholder="ZIP Code"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Add Address"
                onPress={handleAddNewAddress}
                size="lg"
                fullWidth
              />
            </View>
          </View>
        </View>
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
            <Text style={styles.title}>Select Address</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {savedAddresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressCard,
                  currentAddress?.id === address.id && styles.selectedAddressCard,
                ]}
                onPress={() => handleSelectAddress(address)}
              >
                <View style={styles.addressHeader}>
                  {getAddressIcon(address.type)}
                  <Text style={styles.addressType}>{address.type}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
                <Text style={styles.addressText}>
                  {address.city}, {address.state} {address.zip}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.addNewCard}
              onPress={() => setShowAddNew(true)}
            >
              <Plus size={24} color={Colors.primary.main} />
              <Text style={styles.addNewText}>Add New Address</Text>
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
  addressCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAddressCard: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '10',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
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
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
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
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  selectedTypeButton: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  typeButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  selectedTypeButtonText: {
    color: Colors.white,
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
  zipInput: {
    maxWidth: 120,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
});