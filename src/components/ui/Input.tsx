import React from 'react';
import { TextInput, ViewStyle, TextStyle, StyleSheet, View } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  editable = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          !editable && styles.disabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  disabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
});
