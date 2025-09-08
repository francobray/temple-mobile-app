import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Gift, UtensilsCrossed, Star } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

export default function AccountScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Header title="Account" />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Gift size={24} color={Colors.primary.main} />
              <Text style={styles.benefitText}>
                Earn points with every order
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <UtensilsCrossed size={24} color={Colors.primary.main} />
              <Text style={styles.benefitText}>
                Access exclusive menu items
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Star size={24} color={Colors.primary.main} />
              <Text style={styles.benefitText}>
                Receive VIP member discounts
              </Text>
            </View>
          </View>

          <Text style={styles.title}>Welcome to Temple</Text>
          <Text style={styles.description}>
            Sign in to your account to access exclusive features and personalized experience.
          </Text>
          <Button
            title="Sign In / Register"
            onPress={handleSignIn}
            size="lg"
            fullWidth
            style={styles.signInButton}
          />
        </View>
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
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: Colors.primary.main,
  },
});