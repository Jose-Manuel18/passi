import { CreateTaskModal } from "@/src/components/CreateTaskModal";
import { TaskCard } from "@/src/components/TaskCard";
import { Text, View } from "@/src/components/Themed";
import { useCreateTaskMutation, useTasksQuery } from "@/src/hooks/useTasks";
import { useTheme } from "@/src/hooks/useTheme";
import { useAuthStore } from "@/src/stores";
import useUserStore from "@/src/stores/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  FadeInDown,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
export default function TabOneScreen() {
  const { data: tasks, isLoading, refetch } = useTasksQuery();
  const { mutateAsync: createTaskMutate, isPending: isCreating } = useCreateTaskMutation();
  const logout = useAuthStore((s) => s.logout);
  const clearUser = useUserStore((s) => s.clearUser);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const createButtonScale = useSharedValue(1);
  const { setTheme, theme, themePreference, colors } = useTheme();

  const createButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createButtonScale.value }],
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    clearUser();
    router.replace("/auth/login");
  };

  const handleCreateTask = () => {
    createButtonScale.value = withSpring(0.95, {}, () => {
      createButtonScale.value = withSpring(1);
    });
    setModalVisible(true);
  };

  const handleModalSubmit = async (data: { title: string; description?: string }) => {
    await createTaskMutate({
      title: data.title,
      description: data.description,
      completed: false,
    });
    // Modal will be closed by the CreateTaskModal component itself
  };

  const EmptyState = () => (
    <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.emptyState}>
      <MaterialIcons name="assignment" size={64} color="#E0E0E0" />
      <Text style={styles.emptyStateTitle}>No tasks yet</Text>
      <Text style={styles.emptyStateSubtitle}>Create your first task to get started</Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
        <MaterialIcons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create Task</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={SlideInRight.duration(400)}>
        <Animated.View style={styles.headerLeft} entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.subtitle}>
            {tasks?.length || 0} tasks • {tasks?.filter((t) => !t.completed).length || 0} pending
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={[styles.themeToggleContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={[styles.themeOption, themePreference === "light" && { backgroundColor: colors.primary }]}
            onPress={() => setTheme("light")}
          >
            <Feather name="sun" size={16} color={themePreference === "light" ? "#FFFFFF" : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeOption, themePreference === "dark" && { backgroundColor: colors.primary }]}
            onPress={() => setTheme("dark")}
          >
            <Feather name="moon" size={16} color={themePreference === "dark" ? "#FFFFFF" : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeOption, themePreference === "system" && { backgroundColor: colors.primary }]}
            onPress={() => setTheme("system")}
          >
            <Feather name="monitor" size={16} color={themePreference === "system" ? "#FFFFFF" : colors.textMuted} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#F44336" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <View style={styles.divider} />
      {isLoading ? (
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={32} color="#9E9E9E" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={tasks ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <TaskCard item={item} index={index} />}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          extraData={tasks}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" colors={["#3B82F6"]} />
          }
        />
      )}

      <Animated.View
        style={[styles.createTaskButtonContainer, createButtonAnimatedStyle]}
        entering={FadeInDown.delay(600).duration(500)}
      >
        <TouchableOpacity onPress={handleCreateTask} style={styles.createTaskButton} disabled={isCreating}>
          <MaterialIcons name={isCreating ? "hourglass-empty" : "add"} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <CreateTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        isLoading={isCreating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  logoutButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  systemModeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  taskCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  taskStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  createTaskButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  createTaskButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 16,
    opacity: 0.2,
  },
  themeToggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeOption: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
});
