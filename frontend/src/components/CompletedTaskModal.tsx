import { useTheme } from "@/src/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import { Text } from "./Themed";

interface CompletedTaskModalProps {
  visible: boolean;
  taskTitle: string;
  onClose: () => void;
  onMarkIncomplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CompletedTaskModal: React.FC<CompletedTaskModalProps> = ({
  visible,
  taskTitle,
  onClose,
  onMarkIncomplete,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();

  const ActionButton: React.FC<{
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
  }> = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity
      style={[styles.actionButton]}
      onPress={() => {
        onPress();
        onClose();
      }}
    >
      <View style={[styles.iconContainer]}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          entering={SlideInUp.duration(300)}
          style={[styles.modal, { backgroundColor: colors.background }]}
        >
          <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
            <View style={[styles.celebrationIcon, { backgroundColor: colors.success + "15" }]}>
              <MaterialIcons name="celebration" size={32} color={colors.success} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Task Complete! 🎉</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
              "{taskTitle}"
            </Text>
          </Animated.View>

          <View style={styles.actions}>
            <ActionButton
              icon="refresh"
              title="Mark as Incomplete"
              subtitle="Bring this task back to active"
              color={colors.warning}
              onPress={onMarkIncomplete}
            />

            <ActionButton
              icon="edit"
              title="Edit Task"
              subtitle="Update title or description"
              color={colors.primary}
              onPress={onEdit}
            />

            <ActionButton
              icon="delete"
              title="Delete Task"
              subtitle="Permanently remove this task"
              color={colors.error}
              onPress={onDelete}
            />
          </View>

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.actionBackground }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 400,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  celebrationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  actions: {
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  closeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
