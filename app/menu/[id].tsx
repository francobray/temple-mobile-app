import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Platform,
  Animated
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import Colors from '@/constants/Colors';

// Mock data for menu items
const menuItems = [
  { 
    id: '1', 
    name: 'Buffalo Wings', 
    description: 'Our signature buffalo wings tossed in spicy buffalo sauce. Each order comes with celery sticks and your choice of ranch or blue cheese dressing.',
    price: 12.99, 
    imageUrl: 'https://images.pexels.com/photos/7627440/pexels-photo-7627440.jpeg',
    options: [
      { 
        id: 'size', 
        name: 'Size', 
        required: true, 
        items: [
          { id: '6pc', name: '6 Pieces', price: 0 },
          { id: '12pc', name: '12 Pieces', price: 10.99 },
          { id: '18pc', name: '18 Pieces', price: 19.99 },
        ] 
      },
      { 
        id: 'sauce', 
        name: 'Sauce Level', 
        required: true, 
        items: [
          { id: 'mild', name: 'Mild', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
          { id: 'hot', name: 'Hot', price: 0 },
          { id: 'extra-hot', name: 'Extra Hot', price: 0 },
        ] 
      },
      { 
        id: 'dressing', 
        name: 'Dressing', 
        required: true, 
        items: [
          { id: 'ranch', name: 'Ranch', price: 0 },
          { id: 'blue-cheese', name: 'Blue Cheese', price: 0 },
        ] 
      },
      { 
        id: 'extras', 
        name: 'Add Extras', 
        required: false, 
        items: [
          { id: 'extra-sauce', name: 'Extra Sauce', price: 0.99 },
          { id: 'extra-dressing', name: 'Extra Dressing', price: 0.99 },
          { id: 'extra-celery', name: 'Extra Celery', price: 1.49 },
        ] 
      }
    ]
  },
  { 
    id: '2', 
    name: 'BBQ Wings', 
    description: 'Tender chicken wings smothered in our house-made smoky BBQ sauce. A perfect blend of sweet and tangy flavors, served with your choice of dressing.',
    price: 12.99, 
    imageUrl: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg',
    options: [
      { 
        id: 'size', 
        name: 'Size', 
        required: true, 
        items: [
          { id: '6pc', name: '6 Pieces', price: 0 },
          { id: '12pc', name: '12 Pieces', price: 10.99 },
          { id: '18pc', name: '18 Pieces', price: 19.99 },
        ] 
      },
      { 
        id: 'sauce', 
        name: 'Sauce Amount', 
        required: true, 
        items: [
          { id: 'light', name: 'Light Sauce', price: 0 },
          { id: 'regular', name: 'Regular Sauce', price: 0 },
          { id: 'extra', name: 'Extra Sauce', price: 0 },
        ] 
      },
      { 
        id: 'dressing', 
        name: 'Dressing', 
        required: true, 
        items: [
          { id: 'ranch', name: 'Ranch', price: 0 },
          { id: 'blue-cheese', name: 'Blue Cheese', price: 0 },
        ] 
      },
      { 
        id: 'extras', 
        name: 'Add Extras', 
        required: false, 
        items: [
          { id: 'extra-sauce', name: 'Extra BBQ Sauce', price: 0.99 },
          { id: 'extra-dressing', name: 'Extra Dressing', price: 0.99 },
          { id: 'extra-celery', name: 'Celery Sticks', price: 1.49 },
        ] 
      }
    ]
  },
  {
    id: '3',
    name: 'Garlic Parmesan Wings',
    description: 'Crispy wings tossed in our creamy garlic parmesan sauce, topped with fresh grated parmesan and chopped parsley.',
    price: 13.99,
    imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    options: [
      {
        id: 'size',
        name: 'Size',
        required: true,
        items: [
          { id: '6pc', name: '6 Pieces', price: 0 },
          { id: '12pc', name: '12 Pieces', price: 10.99 },
          { id: '18pc', name: '18 Pieces', price: 19.99 },
        ]
      },
      {
        id: 'sauce',
        name: 'Sauce Amount',
        required: true,
        items: [
          { id: 'light', name: 'Light Sauce', price: 0 },
          { id: 'regular', name: 'Regular Sauce', price: 0 },
          { id: 'extra', name: 'Extra Sauce', price: 0 },
        ]
      },
      {
        id: 'extras',
        name: 'Add Extras',
        required: false,
        items: [
          { id: 'extra-sauce', name: 'Extra Garlic Sauce', price: 0.99 },
          { id: 'extra-parmesan', name: 'Extra Parmesan', price: 0.99 },
          { id: 'extra-celery', name: 'Celery Sticks', price: 1.49 },
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Lemon Pepper Fries',
    description: 'Crispy golden fries seasoned with our signature lemon pepper blend. The perfect combination of citrusy brightness and black pepper kick.',
    price: 4.99,
    imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
    options: [
      {
        id: 'size',
        name: 'Size',
        required: true,
        items: [
          { id: 'regular', name: 'Regular', price: 0 },
          { id: 'large', name: 'Large', price: 2.00 },
        ]
      },
      {
        id: 'seasoning',
        name: 'Seasoning Level',
        required: true,
        items: [
          { id: 'light', name: 'Light', price: 0 },
          { id: 'regular', name: 'Regular', price: 0 },
          { id: 'extra', name: 'Extra', price: 0 },
        ]
      },
      {
        id: 'extras',
        name: 'Add Extras',
        required: false,
        items: [
          { id: 'ranch', name: 'Ranch Dipping Sauce', price: 0.75 },
          { id: 'cheese', name: 'Cheese Sauce', price: 1.49 },
          { id: 'garlic', name: 'Garlic Aioli', price: 0.99 },
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Onion Rings',
    description: 'Thick-cut onion rings in a crispy beer batter, served with your choice of dipping sauce.',
    price: 5.99,
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    options: [
      {
        id: 'size',
        name: 'Size',
        required: true,
        items: [
          { id: 'regular', name: 'Regular', price: 0 },
          { id: 'large', name: 'Large', price: 2.00 },
        ]
      },
      {
        id: 'sauce',
        name: 'Dipping Sauce',
        required: true,
        items: [
          { id: 'ranch', name: 'Ranch', price: 0 },
          { id: 'bbq', name: 'BBQ Sauce', price: 0 },
          { id: 'honey-mustard', name: 'Honey Mustard', price: 0 },
        ]
      },
      {
        id: 'extras',
        name: 'Add Extras',
        required: false,
        items: [
          { id: 'extra-sauce', name: 'Extra Sauce', price: 0.75 },
          { id: 'seasoning', name: 'Cajun Seasoning', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'Soda',
    description: 'Your choice of refreshing fountain drink.',
    price: 2.49,
    imageUrl: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg',
    options: [
      {
        id: 'size',
        name: 'Size',
        required: true,
        items: [
          { id: 'regular', name: 'Regular (20 oz)', price: 0 },
          { id: 'large', name: 'Large (32 oz)', price: 1.00 },
        ]
      },
      {
        id: 'type',
        name: 'Drink Selection',
        required: true,
        items: [
          { id: 'cola', name: 'Cola', price: 0 },
          { id: 'diet-cola', name: 'Diet Cola', price: 0 },
          { id: 'lemon-lime', name: 'Lemon Lime', price: 0 },
          { id: 'root-beer', name: 'Root Beer', price: 0 },
        ]
      },
      {
        id: 'extras',
        name: 'Add Extras',
        required: false,
        items: [
          { id: 'extra-ice', name: 'Extra Ice', price: 0 },
          { id: 'no-ice', name: 'No Ice', price: 0 },
        ]
      }
    ]
  },
  {
    id: '7',
    name: 'Chocolate Cake',
    description: 'Rich, moist chocolate cake layered with chocolate fudge frosting.',
    price: 6.99,
    imageUrl: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg',
    options: [
      {
        id: 'size',
        name: 'Size',
        required: true,
        items: [
          { id: 'slice', name: 'Single Slice', price: 0 },
          { id: 'whole', name: 'Whole Cake', price: 35.99 },
        ]
      },
      {
        id: 'extras',
        name: 'Add Extras',
        required: false,
        items: [
          { id: 'ice-cream', name: 'Vanilla Ice Cream', price: 2.49 },
          { id: 'whipped-cream', name: 'Whipped Cream', price: 0.99 },
          { id: 'extra-fudge', name: 'Extra Fudge Sauce', price: 1.49 },
        ]
      }
    ]
  }
];

interface OptionItem {
  id: string;
  name: string;
  price: number;
}

interface Option {
  id: string;
  name: string;
  required: boolean;
  items: OptionItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  options: Option[];
}

export default function MenuItemDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  const { addItem } = useCart();
  
  const menuItem = menuItems.find(item => item.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [scrollY] = useState(new Animated.Value(0));
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  if (!menuItem) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Item not found</Text>
        <Button 
          title="Back to Menu" 
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleOptionSelect = (optionId: string, itemId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: itemId,
    }));
    // Clear validation message when user makes a selection
    setValidationMessage('');
  };

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev => ({
      ...prev,
      [extraId]: !prev[extraId],
    }));
  };

  const calculateTotalPrice = () => {
    let total = menuItem.price * quantity;

    // Add price for size option if selected
    const sizeOption = menuItem.options.find(opt => opt.id === 'size');
    if (sizeOption && selectedOptions.size) {
      const selectedSize = sizeOption.items.find(item => item.id === selectedOptions.size);
      if (selectedSize) {
        total += selectedSize.price * quantity;
      }
    }

    // Add price for selected extras
    const extrasOption = menuItem.options.find(opt => opt.id === 'extras');
    if (extrasOption) {
      extrasOption.items.forEach(extra => {
        if (selectedExtras[extra.id]) {
          total += extra.price * quantity;
        }
      });
    }

    return total;
  };

  const validateRequiredOptions = () => {
    const requiredOptions = menuItem.options.filter(option => option.required);
    
    for (const option of requiredOptions) {
      if (!selectedOptions[option.id]) {
        return { isValid: false, missingOption: option.name };
      }
    }
    
    return { isValid: true };
  };

  const handleAddToCart = () => {
    const validation = validateRequiredOptions();
    
    if (!validation.isValid) {
      // Show validation message to user
      const message = `Please select a ${validation.missingOption} before adding to cart.`;
      setValidationMessage(message);
      // Clear message after 3 seconds
      setTimeout(() => setValidationMessage(''), 3000);
      return;
    }
    
    // Clear any previous validation message
    setValidationMessage('');

    // Build options object for the cart item
    const itemOptions: Record<string, any> = {};
    
    // Add selected options
    Object.entries(selectedOptions).forEach(([optionId, itemId]) => {
      const option = menuItem.options.find(opt => opt.id === optionId);
      if (option) {
        const selectedItem = option.items.find(item => item.id === itemId);
        if (selectedItem) {
          itemOptions[optionId] = {
            id: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
          };
        }
      }
    });

    // Add selected extras
    const selectedExtrasArray: any[] = [];
    Object.entries(selectedExtras).forEach(([extraId, isSelected]) => {
      if (isSelected) {
        const extrasOption = menuItem.options.find(opt => opt.id === 'extras');
        if (extrasOption) {
          const extra = extrasOption.items.find(item => item.id === extraId);
          if (extra) {
            selectedExtrasArray.push({
              id: extra.id,
              name: extra.name,
              price: extra.price,
            });
          }
        }
      }
    });

    if (selectedExtrasArray.length > 0) {
      itemOptions.extras = selectedExtrasArray;
    }

    // Add item to cart
    const cartItem = {
      id: menuItem.id,
      name: menuItem.name,
      price: calculateTotalPrice(),
      imageUrl: menuItem.imageUrl,
      quantity,
      options: itemOptions,
    };

    addItem(cartItem);
    
    // Navigate back to menu after adding to cart
    router.back();
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderOption = (option: Option) => (
    <View key={option.id} style={styles.optionSection}>
      <Text style={styles.optionTitle}>
        {option.name} {option.required && <Text style={styles.requiredText}>(Required)</Text>}
      </Text>
      
      {option.id !== 'extras' ? (
        // Radio button style selection for required options
        option.items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.optionItem,
              selectedOptions[option.id] === item.id && styles.selectedOptionItem,
            ]}
            onPress={() => handleOptionSelect(option.id, item.id)}
          >
            <View style={styles.optionItemContent}>
              <Text style={styles.optionItemName}>{item.name}</Text>
              {item.price > 0 && (
                <Text style={styles.optionItemPrice}>+${item.price.toFixed(2)}</Text>
              )}
            </View>
            <View style={[
              styles.optionItemRadio,
              selectedOptions[option.id] === item.id && styles.selectedOptionItemRadio,
            ]}>
              {selectedOptions[option.id] === item.id && (
                <View style={styles.optionItemRadioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        // Checkbox style selection for extras
        option.items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.optionItem,
              selectedExtras[item.id] && styles.selectedOptionItem,
            ]}
            onPress={() => handleExtraToggle(item.id)}
          >
            <View style={styles.optionItemContent}>
              <Text style={styles.optionItemName}>{item.name}</Text>
              <Text style={styles.optionItemPrice}>+${item.price.toFixed(2)}</Text>
            </View>
            <View style={[
              styles.optionItemCheckbox,
              selectedExtras[item.id] && styles.selectedOptionItemCheckbox,
            ]}>
              {selectedExtras[item.id] && (
                <View style={styles.optionItemCheckboxInner} />
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]} />
      <Header showBackButton transparent />
      
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: menuItem.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.name}>{menuItem.name}</Text>
          <Text style={styles.description}>{menuItem.description}</Text>
          <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>
          
          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus 
                  size={20} 
                  color={quantity <= 1 ? Colors.grey[400] : Colors.grey[800]} 
                />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
              >
                <Plus size={20} color={Colors.grey[800]} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Options */}
          {menuItem.options.map(renderOption)}
        </View>
      </Animated.ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${calculateTotalPrice().toFixed(2)}</Text>
        </View>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          size="lg"
          style={styles.addButton}
        />
      </View>
      
      {/* Validation Message */}
      {validationMessage ? (
        <View style={styles.validationMessageContainer}>
          <Text style={styles.validationMessage}>{validationMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: Colors.white,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  name: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.grey[900],
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.grey[700],
    marginBottom: 16,
    lineHeight: 24,
  },
  price: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: Colors.primary.main,
    marginBottom: 24,
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.grey[900],
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginHorizontal: 16,
  },
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.grey[900],
    marginBottom: 12,
  },
  requiredText: {
    fontFamily: 'Poppins-Regular',
    color: Colors.primary.main,
    fontSize: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOptionItem: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '10',
  },
  optionItemContent: {
    flex: 1,
  },
  optionItemName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.grey[800],
  },
  optionItemPrice: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    marginTop: 4,
  },
  optionItemRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.grey[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOptionItemRadio: {
    borderColor: Colors.primary.main,
  },
  optionItemRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary.main,
  },
  optionItemCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.grey[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOptionItemCheckbox: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main,
  },
  optionItemCheckboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
  },
  totalPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.primary.main,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    width: 200,
  },
  validationMessageContainer: {
    backgroundColor: Colors.error.main,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    position: 'absolute',
    bottom: 120, // Position above the footer
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  validationMessage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
  },
});