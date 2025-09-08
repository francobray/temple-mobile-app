import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface PromotionBannerProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onPress?: () => void;
  backgroundImageUrl?: string;
}

export default function PromotionBanner({
  title,
  subtitle,
  buttonText = 'Order Now',
  onPress,
  backgroundImageUrl = 'https://images.pexels.com/photos/7627440/pexels-photo-7627440.jpeg',
}: PromotionBannerProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {buttonText && onPress && (
            <Button
              title={buttonText}
              onPress={onPress}
              variant="secondary"
              size="sm"
              style={styles.button}
            />
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 16,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 8,
  }
});