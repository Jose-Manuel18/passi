import { useTheme } from "@/src/hooks/useTheme";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AuthLayout() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  );
}
