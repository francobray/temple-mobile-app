import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import Colors from '@/constants/Colors';

interface CategoryButtonProps {
  name: string;
  imageUrl?: string;
  isActive?: boolean;
  onPress: () => void;
}

export default function CategoryButton({
  name,
  imageUrl,
  isActive = false,
  onPress,
}: CategoryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[
          styles.imagePlaceholder,
          isActive && styles.activeImagePlaceholder,
        ]} />
      )}
      <Text
        style={[
          styles.text,
          isActive && styles.activeText,
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  activeContainer: {
    transform: [{ scale: 1.05 }],
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background.tertiary,
    marginBottom: 8,
  },
  activeImagePlaceholder: {
    backgroundColor: Colors.primary.main,
  },
  text: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  activeText: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary.main,
  },
});