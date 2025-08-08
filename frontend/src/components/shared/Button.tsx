import { useTheme } from "@/src/hooks/useTheme";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "social";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  loading = false,
  icon,
  disabled,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const getBackgroundColor = () => {
    if (variant === "secondary") {
      return colors.actionBackground;
    }
    return colors.primaryDark;
  };

  const getTextColor = () => {
    if (variant === "secondary") {
      return colors.text;
    }
    return "#FFFFFF";
  };

  if (variant === "social") {
    return (
      <Animated.View style={[buttonAnimatedStyle, styles.buttonContainer, style]}>
        <TouchableOpacity
          style={[styles.socialButton, disabled && styles.buttonDisabled]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          {...props}
        >
          {icon}
          <Text style={[styles.socialButtonText, { color: getTextColor() }]}>
            {loading ? <ActivityIndicator size="small" color={getTextColor()} /> : title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[buttonAnimatedStyle, styles.buttonContainer, style]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getBackgroundColor() }, disabled && styles.buttonDisabled]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        {...props}
      >
        {icon}
        <Text style={[styles.buttonText, { color: getTextColor() }]}>
          {loading ? <ActivityIndicator size="small" color={getTextColor()} /> : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
