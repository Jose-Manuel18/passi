import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  showPasswordToggle,
  onTogglePassword,
  focused,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const inputScale = useSharedValue(1);

  const handleFocus = () => {
    inputScale.value = withSpring(1.02);
    onFocus?.();
  };

  const handleBlur = () => {
    inputScale.value = withSpring(1);
    onBlur?.();
  };

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.inputWrapper, inputAnimatedStyle]}>
        <View
          style={[styles.inputContainer, focused && styles.inputContainerFocused, error && styles.inputContainerError]}
        >
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={error ? "#EF4444" : focused ? "#3B82F6" : "#9CA3AF"}
              style={styles.icon}
            />
          )}
          <TextInput
            style={[styles.input, showPasswordToggle && styles.passwordInput, style]}
            placeholderTextColor="#9CA3AF"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity style={styles.eyeButton} onPress={onTogglePassword}>
              <MaterialIcons name={props.secureTextEntry ? "visibility-off" : "visibility"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D1D5DB",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: "rgba(59, 130, 246, 0.5)",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  inputContainerError: {
    borderColor: "rgba(239, 68, 68, 0.5)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    height: "100%",
  },
  passwordInput: {
    marginRight: 8,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
