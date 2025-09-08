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
import { ShoppingBag, Star, MapPin, ChevronDown, Gift, UtensilsCrossed } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import LocationSelectionModal from '@/components/home/LocationSelectionModal';
import PickupDeliveryModal from '@/components/home/PickupDeliveryModal';
import SignUpModal from '@/components/auth/SignUpModal';
import { useCart } from '@/contexts/CartContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';

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
  const { points: loyaltyPoints } = useLoyalty();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPickupDeliveryModal, setShowPickupDeliveryModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock authentication state
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

  const handleOrderTypeSelect = (type: 'pickup' | 'delivery', time?: string, date?: string) => {
    setOrderType(type);
    if (time) {
      setEstimatedTime(time);
    }
    // You can store the selected date if needed for future use
    if (date && type === 'delivery') {
      console.log('Selected delivery date:', date);
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

  const handleSignUp = (data: any) => {
    // Mock signup - in real app this would call an API
    console.log('Sign up data:', data);
    setIsLoggedIn(true);
    setShowSignUpModal(false);
  };

  const handleLogin = () => {
    // Mock login - in real app this would navigate to login screen
    console.log('Login pressed');
    setIsLoggedIn(true);
  };

  const handleGoogleSignUp = () => {
    // Mock Google signup
    console.log('Google signup pressed');
    setIsLoggedIn(true);
    setShowSignUpModal(false);
  };

  const handleAppleSignUp = () => {
    // Mock Apple signup
    console.log('Apple signup pressed');
    setIsLoggedIn(true);
    setShowSignUpModal(false);
  };

  // Render login/signup overlay for non-logged-in users
  const renderAuthOverlay = () => (
    <View style={styles.authOverlay}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg' }}
        style={styles.authBackground}
        resizeMode="cover"
      >
        <View style={styles.authOverlayContent}>
          {/* Location Banner */}
          <TouchableOpacity 
            style={styles.locationBanner}
            onPress={handleLocationPress}
          >
            <Text style={styles.locationBannerText}>
              {selectedLocation.name}
            </Text>
            <Text style={styles.locationBannerSubtext}>
              {orderType === 'pickup' ? 'Pickup' : 'Delivery'} in {estimatedTime}
            </Text>
          </TouchableOpacity>

          {/* Benefits Section */}
          <View style={styles.authBenefitsContainer}>
            <View style={styles.authBenefitItem}>
              <Gift size={24} color={Colors.white} />
              <Text style={styles.authBenefitText}>Earn points with every order</Text>
            </View>

            <View style={styles.authBenefitItem}>
              <UtensilsCrossed size={24} color={Colors.white} />
              <Text style={styles.authBenefitText}>Redeem points for free food</Text>
            </View>

            <View style={styles.authBenefitItem}>
              <Star size={24} color={Colors.white} />
              <Text style={styles.authBenefitText}>Receive exclusive discounts</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => setShowSignUpModal(true)}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Recommended Section (visible to non-logged-in users) */}
      <ScrollView style={styles.authRecommendedScroll}>
        <View style={styles.authRecommendedContainer}>
          <Text style={styles.authRecommendedTitle}>Recommended</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.authRecommendedItems}
          >
            {popularItems.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.authRecommendedItem}
                onPress={() => setShowSignUpModal(true)} // Prompt signup when trying to interact
              >
                <Image source={{ uri: item.imageUrl }} style={styles.authRecommendedImage} />
                <Text style={styles.authRecommendedItemName}>{item.name}</Text>
                <Text style={styles.authRecommendedItemPrice}>${item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {!isLoggedIn ? renderAuthOverlay() : (
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
      )}

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

      <SignUpModal
        visible={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        onAppleSignUp={handleAppleSignUp}
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
    height: 300, // Increased from 280 to 300 to accommodate the button
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
    paddingBottom: 24, // Extra bottom padding to ensure button isn't cut off
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
  // Authentication overlay styles
  authOverlay: {
    flex: 1,
  },
  authBackground: {
    flex: 1,
    minHeight: 500,
  },
  authOverlayContent: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  locationBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationBannerText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.grey[900],
    marginBottom: 4,
  },
  locationBannerSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[700],
  },
  authBenefitsContainer: {
    marginBottom: 40,
  },
  authBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authBenefitText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 16,
  },
  authButtonsContainer: {
    gap: 12,
  },
  signUpButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.grey[900],
  },
  authRecommendedScroll: {
    backgroundColor: Colors.background.primary,
  },
  authRecommendedContainer: {
    padding: 20,
  },
  authRecommendedTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  authRecommendedItems: {
    gap: 16,
  },
  authRecommendedItem: {
    width: 200,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authRecommendedImage: {
    width: '100%',
    height: 120,
  },
  authRecommendedItemName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    padding: 12,
    paddingBottom: 4,
  },
  authRecommendedItemPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.primary.main,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});