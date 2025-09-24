
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
}

export default function Button({ 
  text, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'accent':
        return styles.accentButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButtonText;
      case 'accent':
        return styles.accentButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        getButtonStyle(), 
        disabled && styles.disabledButton,
        style
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), disabled && styles.disabledText, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accentButton: {
    backgroundColor: colors.accent,
  },
  disabledButton: {
    backgroundColor: colors.border,
    elevation: 0,
    boxShadow: 'none',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  accentButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: colors.textSecondary,
  },
});
