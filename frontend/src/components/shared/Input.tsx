import { useTheme } from "@/src/hooks/useTheme";
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
  const { colors } = useTheme();
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

  const getIconColor = () => {
    if (error) return colors.error;
    if (focused) return colors.primary;
    return colors.textMuted;
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Animated.View style={[styles.inputWrapper, inputAnimatedStyle]}>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
            focused && { borderColor: colors.primary + "50", backgroundColor: colors.primary + "20" },
            error && { borderColor: colors.error + "50", backgroundColor: colors.error + "10" },
            props.multiline && styles.inputContainerMultiline,
          ]}
        >
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={getIconColor()}
              style={[styles.icon, props.multiline && styles.iconMultiline]}
            />
          )}
          <TextInput
            style={[
              styles.input,
              { color: colors.text },
              showPasswordToggle && styles.passwordInput,
              props.multiline && styles.inputMultiline,
              style,
            ]}
            placeholderTextColor={colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            textAlignVertical={props.multiline ? "top" : "center"}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity style={styles.eyeButton} onPress={onTogglePassword}>
              <MaterialIcons
                name={props.secureTextEntry ? "visibility-off" : "visibility"}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
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
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 48,
  },
  inputContainerMultiline: {
    alignItems: "flex-start",
    height: "auto",
    minHeight: 48,
    paddingTop: 12,
    paddingBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  iconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  inputMultiline: {
    height: "auto",
    minHeight: 20,
  },
  passwordInput: {
    marginRight: 8,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
