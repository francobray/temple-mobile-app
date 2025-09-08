import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@/components/layout/Header';
import CategoryButton from '@/components/menu/CategoryButton';
import MenuItem, { MenuItemProps } from '@/components/menu/MenuItem';
import Colors from '@/constants/Colors';

// Mock data for categories
const categories = [
  { id: 'all', name: 'All' },
  { id: '1', name: 'Beer', imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg' },
  { id: '2', name: 'Food', imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg' },
  { id: '3', name: 'Cocktails', imageUrl: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg' },
  { id: '4', name: 'Desserts', imageUrl: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg' },
];

// Mock data for menu items
const menuItems = [
  { 
    id: '1', 
    name: 'Temple Wolf IPA', 
    description: 'Bold blond with herbal hop flavor', 
    price: 11, 
    imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
    categoryId: '1'
  },
  { 
    id: '2', 
    name: 'Temple Indie Lager', 
    description: 'Golden beer for rebellious spirits', 
    price: 10, 
    imageUrl: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg',
    categoryId: '1'
  },
  { 
    id: '3', 
    name: 'Temple Royal Amber', 
    description: 'Amber lager with caramel & roast notes', 
    price: 10, 
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    categoryId: '1'
  },
  { 
    id: '4', 
    name: 'Wynwood Burger', 
    description: 'Double smash, cheddar & secret sauce', 
    price: 23, 
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    categoryId: '2'
  },
  { 
    id: '5', 
    name: 'Smoked Bacon Burger', 
    description: 'Grilled angus, cheddar & caramelized onion', 
    price: 17, 
    imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    categoryId: '2'
  },
  { 
    id: '6', 
    name: 'American Fries', 
    description: 'With cheddar cheese, bacon & green onion', 
    price: 19, 
    imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
    categoryId: '2'
  },
  { 
    id: '7', 
    name: 'Classic Margarita', 
    description: 'Tequila, lime juice, triple sec', 
    price: 12, 
    imageUrl: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg',
    categoryId: '3'
  },
  { 
    id: '8', 
    name: 'Flan & Dulce de Leche', 
    description: 'Creamy flan topped with dulce de leche', 
    price: 11, 
    imageUrl: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg',
    categoryId: '4'
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialCategory = params.category as string || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === selectedCategory);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleMenuItemPress = (itemId: string) => {
    router.push(`/menu/${itemId}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Menu" />
      
      <View style={styles.content}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              name={category.name}
              imageUrl={category.imageUrl}
              isActive={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
        
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuItem
              {...item}
              onPress={() => handleMenuItemPress(item.id)}
            />
          )}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
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
    marginTop: Platform.OS === 'ios' ? 90 : 70,
  },
  categoriesContainer: {
    backgroundColor: Colors.background.card,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  menuList: {
    padding: 16,
    paddingBottom: 100,
  },
});