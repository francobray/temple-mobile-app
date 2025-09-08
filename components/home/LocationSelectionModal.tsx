import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, MapPin, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Location {
  id: string;
  name: string;
  address: string;
  distance?: string;
}

interface LocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  currentLocation?: Location;
}

// Mock locations - in a real app, this would come from an API
const locations: Location[] = [
  {
    id: '1',
    name: 'Temple Brickell',
    address: '1234 Brickell Ave, Miami, FL',
    distance: '0.5 mi',
  },
  {
    id: '2', 
    name: 'Temple Wynwood',
    address: '2345 NW 2nd Ave, Miami, FL',
    distance: '2.1 mi',
  },
  {
    id: '3',
    name: 'Temple South Beach',
    address: '3456 Ocean Dr, Miami Beach, FL', 
    distance: '3.2 mi',
  },
  {
    id: '4',
    name: 'Temple Coral Gables',
    address: '4567 Miracle Mile, Coral Gables, FL',
    distance: '4.5 mi',
  },
  {
    id: '5',
    name: 'Temple Downtown',
    address: '5678 Flagler St, Miami, FL',
    distance: '1.8 mi',
  },
];

export default function LocationSelectionModal({
  visible,
  onClose,
  onSelectLocation,
  currentLocation,
}: LocationSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
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
            <Text style={styles.title}>Select Location</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.text.tertiary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <ScrollView style={styles.content}>
            {filteredLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationCard,
                  currentLocation?.id === location.id && styles.selectedLocationCard,
                ]}
                onPress={() => handleSelectLocation(location)}
              >
                <View style={styles.locationHeader}>
                  <MapPin size={20} color={Colors.primary.main} />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                  {location.distance && (
                    <Text style={styles.locationDistance}>{location.distance}</Text>
                  )}
                </View>
                {currentLocation?.id === location.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  selectedLocationCard: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '10',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  locationDistance: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.primary.main,
  },
  selectedIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  selectedText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.primary.main,
    textAlign: 'center',
  },
});
