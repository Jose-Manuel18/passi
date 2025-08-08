import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/src/hooks/useTasks";
import { useTheme } from "@/src/hooks/useTheme";
import { Task } from "@/src/services/tasks";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CompletedTaskModal } from "./CompletedTaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Text } from "./Themed";

export const TaskCard = ({ item, index }: { item: Task; index: number }) => {
  const { colors } = useTheme();
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // API hooks
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTaskMutation(item.id);

  const handlePressIn = () => {
    cardScale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
    cardOpacity.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, { damping: 20, stiffness: 300 });
    cardOpacity.value = withTiming(1, { duration: 100 });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleComplete = async () => {
    try {
      await updateTask({ completed: !item.completed });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleMoreActions = () => {
    if (item.completed) {
      setShowCompletedModal(true);
    } else {
      // For active tasks, you could show a different modal or actions
      setShowEditModal(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(item.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = async (data: { title: string; description?: string }) => {
    try {
      await updateTask(data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleMarkIncomplete = async () => {
    try {
      await updateTask({ completed: false });
    } catch (error) {
      console.error("Error marking task as incomplete:", error);
    }
  };

  return (
    <>
      <Animated.View
        entering={FadeInDown.delay(index * 50)
          .duration(400)
          .springify()}
        exiting={FadeOutRight.duration(300)}
        layout={LinearTransition.springify().damping(15).stiffness(200)}
        style={[cardAnimatedStyle]}
      >
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            item.completed && {
              backgroundColor: colors.surfaceCompleted,
              opacity: 0.8,
            },
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={item.completed ? () => setShowCompletedModal(true) : undefined}
        >
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                {
                  borderColor: item.completed ? colors.success : colors.border,
                  backgroundColor: item.completed ? colors.success : "transparent",
                },
              ]}
              onPress={handleToggleComplete}
            >
              {item.completed && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.title,
                  {
                    color: item.completed ? colors.textCompleted : colors.text,
                    textDecorationLine: item.completed ? "line-through" : "none",
                  },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View style={styles.metaRow}>
                <View style={[styles.statusBadge, { backgroundColor: colors.primary + "15" }]}>
                  <Text style={[styles.statusText, { color: colors.primary }]}>
                    {item.completed ? "Done" : "Active"}
                  </Text>
                </View>
                <Text style={[styles.date, { color: colors.textTertiary }]}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
          </View>

          {item.description && (
            <Text
              style={[styles.description, { color: item.completed ? colors.textCompleted : colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.actions}>
            {!item.completed && (
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowEditModal(true)}>
                <MaterialIcons name="edit" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={handleMoreActions}>
              <MaterialIcons name="more-horiz" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowDeleteModal(true)}>
              <MaterialIcons name="delete" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>

      {/* Modals */}
      <DeleteTaskModal
        visible={showDeleteModal}
        taskTitle={item.title}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <EditTaskModal
        visible={showEditModal}
        task={item}
        isLoading={isUpdating}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEdit}
      />

      <CompletedTaskModal
        visible={showCompletedModal}
        taskTitle={item.title}
        onClose={() => setShowCompletedModal(false)}
        onMarkIncomplete={handleMarkIncomplete}
        onEdit={() => {
          setShowCompletedModal(false);
          setShowEditModal(true);
        }}
        onDelete={() => {
          setShowCompletedModal(false);
          setShowDeleteModal(true);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    paddingLeft: 36,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginLeft: 36,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 36,
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
  },
});
