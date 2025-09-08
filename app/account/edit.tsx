import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

// Mock initial user data
const initialUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(initialUserData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!userData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(userData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // In a real app, this would update the user's profile in the backend
      router.back();
    }
  };

  const handlePhoneChange = (text: string) => {
    // Format phone number as (XXX) XXX-XXXX
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)})`;
      if (cleaned.length >= 6) {
        formatted += ` ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      } else {
        formatted += ` ${cleaned.slice(3)}`;
      }
    }
    setUserData({ ...userData, phone: formatted });
  };

  const handleUploadPhoto = () => {
    // In a real app, this would open the camera or photo picker
    alert('Photo upload functionality would be implemented here');
  };

  const handleRemovePhoto = () => {
    setUserData({
      ...userData,
      profilePicture: '',
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" showBackButton />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoSection}>
          {userData.profilePicture ? (
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: userData.profilePicture }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={handleRemovePhoto}
              >
                <X size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={40} color={Colors.grey[400]} />
            </View>
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadPhoto}
          >
            <Text style={styles.uploadButtonText}>
              {userData.profilePicture ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.grey[400]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter your email"
              placeholderTextColor={Colors.grey[400]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={userData.phone}
              onChangeText={handlePhoneChange}
              placeholder="(555) 123-4567"
              placeholderTextColor={Colors.grey[400]}
              keyboardType="phone-pad"
              maxLength={14}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey[100],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error.main,
    borderRadius: 20,
    padding: 8,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  uploadButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  formSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.grey[800],
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.grey[900],
    backgroundColor: Colors.grey[100],
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.grey[300],
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.error.main,
    marginTop: 4,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
});