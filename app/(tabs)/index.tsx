import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Star, MapPin, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import LocationSelectionModal from '@/components/home/LocationSelectionModal';
import PickupDeliveryModal from '@/components/home/PickupDeliveryModal';
import { useCart } from '@/contexts/CartContext';

// Mock data for popular items
const popularItems = [
  { 
    id: '1', 
    name: 'Temple Wolf IPA', 
    description: 'Bold blond with herbal hop flavor',
    price: 11, 
    imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
    category: 'beer'
  },
  { 
    id: '2', 
    name: 'Wynwood Burger', 
    description: 'Double smash, cheddar & secret sauce',
    price: 23, 
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    category: 'food'
  },
  { 
    id: '3', 
    name: 'American Fries', 
    description: 'With cheddar cheese, bacon & green onion',
    price: 19, 
    imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
    category: 'food'
  },
  { 
    id: '4', 
    name: 'Temple Indie Lager', 
    description: 'Golden beer for rebellious spirits',
    price: 10, 
    imageUrl: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg',
    category: 'beer'
  },
  { 
    id: '5', 
    name: 'Chicken Roll', 
    description: 'Chicken, bacon, cheese, tomato & onion',
    price: 20, 
    imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    category: 'food'
  },
  { 
    id: '6', 
    name: 'Flan & Dulce de Leche', 
    description: 'Creamy flan topped with dulce de leche',
    price: 11, 
    imageUrl: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg',
    category: 'dessert'
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addItem } = useCart();
  const [loyaltyPoints] = useState(740);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPickupDeliveryModal, setShowPickupDeliveryModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    id: '1',
    name: 'Temple Brickell',
    address: '1234 Brickell Ave, Miami, FL',
    distance: '0.5 mi',
  });
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [estimatedTime, setEstimatedTime] = useState('10 min');

  // Debug logging
  useEffect(() => {
    console.log('HomeScreen: Component mounted');
  }, []);

  const handleItemPress = (itemId: string) => {
    router.push(`/menu/${itemId}`);
  };

  const handleMenuPress = () => {
    router.push('/menu');
  };

  const handleLocationPress = () => {
    setShowPickupDeliveryModal(true);
  };

  const handleLocationChange = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const handleOrderTypeSelect = (type: 'pickup' | 'delivery', time?: string) => {
    setOrderType(type);
    if (time) {
      setEstimatedTime(time);
    }
  };

  const handleAddToCart = (item: typeof popularItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    
    // Optional: You could add a toast notification here
    // For now, the cart badge will update immediately to show feedback
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://templeusa.co/temple-logo.png' }} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <ShoppingBag size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Loyalty Hero Section */}
        <View style={styles.loyaltyHero}>
          <ImageBackground
            source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg' }}
            style={styles.loyaltyHeroBackground}
            resizeMode="cover"
          >
            <View style={styles.loyaltyHeroOverlay} />
            <View style={styles.loyaltyHeroContent}>
              <TouchableOpacity 
                style={styles.loyaltyNotification}
                onPress={handleLocationPress}
                activeOpacity={0.8}
              >
                <Text style={styles.loyaltyNotificationText}>
                  {selectedLocation.name}
                </Text>
                <Text style={styles.loyaltyNotificationSubtext}>
                  {orderType === 'pickup' ? 'Pickup' : 'Delivery'} in {estimatedTime} ⌄
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.loyaltyHeroPoints}>{loyaltyPoints}</Text>
              <Text style={styles.loyaltyHeroSubtext}>
                {500 - (loyaltyPoints % 500)} points until your next reward
              </Text>
              
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${((loyaltyPoints % 500) / 500) * 100}%` }
                    ]} 
                  />
                </View>
                <View style={styles.progressIndicators}>
                  {[0, 100, 200, 300, 400, 500].map((point, index) => (
                    <View key={index} style={styles.progressPoint}>
                      <Text style={styles.progressPointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.rewardsButton}
                onPress={() => router.push('/rewards')}
              >
                <Text style={styles.rewardsButtonText}>Rewards</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Recommended Section */}
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>Recommended</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedScrollContent}
          >
            {popularItems.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recommendedCard}
                onPress={() => handleItemPress(item.id)}
              >
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={styles.recommendedImage} 
                />
                <View style={styles.recommendedContent}>
                  <Text style={styles.recommendedName}>{item.name}</Text>
                  <View style={styles.recommendedFooter}>
                    <Text style={styles.recommendedPrice}>${item.price}</Text>
                    <TouchableOpacity 
                      style={styles.recommendedAddButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <Text style={styles.recommendedHeartIcon}>♡</Text>
                      <Text style={styles.recommendedLikes}>1</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Location & Hours */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>LOCATION</Text>
              <Text style={styles.infoValue}>Brickell</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>PICKUP</Text>
              <Text style={styles.infoValue}>10 min</Text>
            </View>
          </View>
        </View>
        
        {/* Popular Items Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OUR POPULAR ITEMS</Text>
          <TouchableOpacity onPress={handleMenuPress}>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemsGrid}>
          {popularItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => handleItemPress(item.id)}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.itemImage} 
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>Add item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <LocationSelectionModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        currentLocation={selectedLocation}
      />

      <PickupDeliveryModal
        visible={showPickupDeliveryModal}
        onClose={() => setShowPickupDeliveryModal(false)}
        onSelect={handleOrderTypeSelect}
        locationName={selectedLocation.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  cartButton: {
    backgroundColor: Colors.primary.main,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loyaltyHero: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    height: 280,
  },
  loyaltyHeroBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  loyaltyHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  loyaltyHeroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loyaltyNotification: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  loyaltyNotificationText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  loyaltyNotificationSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
  },
  loyaltyHeroPoints: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 48,
    color: Colors.white,
    marginBottom: 8,
  },
  loyaltyHeroSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  progressIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  progressPoint: {
    alignItems: 'center',
  },
  progressPointText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    color: Colors.white,
    opacity: 0.8,
  },
  rewardsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: Colors.white,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  rewardsButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
  },
  recommendedSection: {
    marginBottom: 20,
  },
  recommendedTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  recommendedScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  recommendedCard: {
    width: 160,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 100,
  },
  recommendedContent: {
    padding: 12,
  },
  recommendedName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  recommendedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.primary.main,
  },
  recommendedAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedHeartIcon: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginRight: 4,
  },
  recommendedLikes: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  infoCard: {
    backgroundColor: Colors.background.card,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  viewAllText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.primary.main,
  },
  itemsGrid: {
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  itemContent: {
    padding: 16,
  },
  itemName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  addButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.white,
  },
});