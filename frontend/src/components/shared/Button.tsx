import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
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
  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const getTextColor = () => {
    return variant === "social" ? "#FFFFFF" : "#FFFFFF";
  };

  if (variant === "social") {
    return (
      <Animated.View style={[buttonAnimatedStyle, style]}>
        <TouchableOpacity
          style={[styles.socialButton, disabled && styles.buttonDisabled]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          {...props}
        >
          {icon}
          <Text style={[styles.socialButtonText, { color: getTextColor() }]}>{loading ? "Loading..." : title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[buttonAnimatedStyle, style]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        {...props}
      >
        {icon}
        <Text style={[styles.buttonText, { color: getTextColor() }]}>{loading ? "Loading..." : title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  gradient: {
    height: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
