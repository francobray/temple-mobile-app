import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  rightComponent,
  transparent = false,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[
      styles.header, 
      transparent ? styles.transparentHeader : styles.solidHeader
    ]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft 
              size={28} 
              color={transparent ? Colors.white : Colors.white} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {title && (
        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.title,
              transparent ? styles.transparentTitle : styles.solidTitle
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
  },
  solidHeader: {
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  leftContainer: {
    flexBasis: '20%',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexBasis: '60%',
    alignItems: 'center',
  },
  rightContainer: {
    flexBasis: '20%',
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  transparentTitle: {
    color: Colors.white,
  },
  solidTitle: {
    color: Colors.text.primary,
  },
  backButton: {
    padding: 8,
  },
});