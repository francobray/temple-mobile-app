import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Gift, UtensilsCrossed, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SignUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSignUp: (data: SignUpData) => void;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
}

export default function SignUpModal({ visible, onClose, onSignUp }: SignUpModalProps) {
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emailOptIn: true,
    smsOptIn: false,
  });

  const handleSignUp = () => {
    onSignUp(formData);
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
            <Text style={styles.title}>Sign up to Earn Points</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <X size={24} color={Colors.grey[900]} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Gift size={24} color="#00C853" />
                <Text style={styles.benefitText}>
                  Earn points with every order
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <UtensilsCrossed size={24} color="#00C853" />
                <Text style={styles.benefitText}>
                  Redeem points for free food
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <Star size={24} color="#00C853" />
                <Text style={styles.benefitText}>
                  Receive exclusive discounts
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="First name"
                  placeholderTextColor={Colors.grey[400]}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                />

                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Last name"
                  placeholderTextColor={Colors.grey[400]}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.grey[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Mobile number"
                placeholderTextColor={Colors.grey[400]}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setFormData({ ...formData, emailOptIn: !formData.emailOptIn })}
              >
                <View style={[
                  styles.checkboxBox,
                  formData.emailOptIn && styles.checkboxChecked
                ]}>
                  {formData.emailOptIn && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Send me emails with exclusive offers and news
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setFormData({ ...formData, smsOptIn: !formData.smsOptIn })}
              >
                <View style={[
                  styles.checkboxBox,
                  formData.smsOptIn && styles.checkboxChecked
                ]}>
                  {formData.smsOptIn && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Send me texts with exclusive offers and news
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing up, you agree to receive email and SMS marketing communications and consent to our{' '}
                <Text style={styles.link}>Platform Terms</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>.
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginLink}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.grey[900],
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.grey[900],
    marginLeft: 12,
  },
  form: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    backgroundColor: Colors.grey[100],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: Colors.grey[900],
  },
  halfInput: {
    width: '48%',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#00C853',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00C853',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[800],
    flex: 1,
  },
  signUpButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  termsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.grey[600],
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  link: {
    color: '#00C853',
    textDecorationLine: 'underline',
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    textAlign: 'center',
  },
  loginLink: {
    color: '#00C853',
  },
});