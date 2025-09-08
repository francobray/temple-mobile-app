import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import Colors from '@/constants/Colors';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={{ uri: 'https://templeusa.co/temple-logo.png' }} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Premium Experience</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 16,
  },
  tagline: {
    fontFamily: Platform.select({
      web: 'Poppins-Medium',
      default: 'Poppins-Medium',
    }),
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
  },
});