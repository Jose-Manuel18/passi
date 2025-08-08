import { useTheme } from "@/src/hooks/useTheme";
import { ThemePreference } from "@/src/stores/themeStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "./shared/Button";
import { Text } from "./Themed";

export const ThemeSelector: React.FC = () => {
  const { themePreference, setTheme, colors } = useTheme();

  const themes: { key: ThemePreference; label: string }[] = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "System" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      <View style={styles.buttonsContainer}>
        {themes.map((theme) => (
          <Button
            key={theme.key}
            title={theme.label}
            variant={themePreference === theme.key ? "primary" : "secondary"}
            onPress={() => setTheme(theme.key)}
            style={styles.themeButton}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  themeButton: {
    flex: 1,
  },
});
