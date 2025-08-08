import Colors from "@/src/constants/Colors";
import { useThemeStore } from "@/src/stores";
import { useColorScheme } from "react-native";

export type Theme = "light" | "dark";

export function useTheme() {
  const { themePreference, setTheme } = useThemeStore();
  const systemTheme = useColorScheme();

  const actualTheme: Theme =
    themePreference === "system" ? (systemTheme === "dark" ? "dark" : "light") : themePreference;

  const colors = Colors[actualTheme];

  return {
    theme: actualTheme,
    themePreference,
    setTheme,
    colors,
    isDark: actualTheme === "dark",
  };
}
