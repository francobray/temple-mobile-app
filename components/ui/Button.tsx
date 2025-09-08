import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Colors from '@/constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const getButtonStyles = () => {
    const baseStyle = [styles.button, styles[`${size}Button`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghostButton);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    return baseStyle;
  };

  const getTextStyles = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghostText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.white : Colors.primary.main} 
          size="small" 
        />
      ) : (
        <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  // Size variations
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mdButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  lgButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: Colors.primary.main,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary.main,
    borderWidth: 0,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  // Text styles based on variant
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.black,
  },
  outlineText: {
    color: Colors.primary.main,
  },
  ghostText: {
    color: Colors.primary.main,
  },
  // Disabled state
  disabledButton: {
    backgroundColor: Colors.background.tertiary,
    borderColor: Colors.background.tertiary,
  },
  disabledText: {
    color: Colors.text.tertiary,
  },
  // Width
  fullWidth: {
    width: '100%',
  },
});