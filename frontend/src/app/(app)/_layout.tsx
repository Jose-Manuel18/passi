import { useModal } from "@/src/contexts/token-expired-modal";
import { useTheme } from "@/src/hooks/useTheme";
import { useAuthStore } from "@/src/stores";
import useUserStore from "@/src/stores/userStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { token, clearUser } = useUserStore((s) => s);
  const { isLoggedIn, logout } = useAuthStore((s) => s);
  const { showModal } = useModal();
  const { colors } = useTheme();
  useEffect(() => {
    if (!token && isLoggedIn) {
      showModal({
        title: "Token Expired",
        description: "Your session has expired. Please log in again to continue using the app.",
        onClose: () => {
          clearUser();
          logout();
          router.replace("/auth/login");
        },
      });
    } else if (!isLoggedIn && !token) {
      router.replace("/auth/login");
    }
  }, [token, isLoggedIn]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaView>
  );
}
