import React, { useState } from 'react';
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
import { ShoppingBag, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';

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
  const [loyaltyPoints] = useState(740);

  const handleItemPress = (itemId: string) => {
    router.push(`/menu/${itemId}`);
  };

  const handleMenuPress = () => {
    router.push('/menu');
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

        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg' }}
          style={styles.heroSection}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>PREMIUM EXPERIENCE</Text>
            <Text style={styles.heroSubtitle}>Craft beer & gourmet food</Text>
            <TouchableOpacity style={styles.heroButton} onPress={handleMenuPress}>
              <Text style={styles.heroButtonText}>EXPLORE MENU</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

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
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Loyalty Section */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <Star size={24} color={Colors.primary.main} />
            <Text style={styles.loyaltyTitle}>TEMPLE REWARDS</Text>
          </View>
          <Text style={styles.loyaltyPoints}>{loyaltyPoints} points</Text>
          <Text style={styles.loyaltySubtext}>Earn points with every order</Text>
          <TouchableOpacity 
            style={styles.loyaltyButton}
            onPress={() => router.push('/rewards')}
          >
            <Text style={styles.loyaltyButtonText}>VIEW REWARDS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  heroSection: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  heroButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: Colors.white,
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
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.text.primary,
  },
  loyaltyCard: {
    backgroundColor: Colors.background.card,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  loyaltyPoints: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
    color: Colors.primary.main,
    marginBottom: 4,
  },
  loyaltySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  loyaltyButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  loyaltyButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: Colors.white,
  },
});