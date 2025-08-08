import { useTheme } from "@/src/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "./shared/Button";
import { Text } from "./Themed";

interface DeleteTaskModalProps {
  visible: boolean;
  taskTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  visible,
  taskTitle,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn.duration(200)} style={[styles.modal, { backgroundColor: colors.surface }]}>
          <Animated.View
            entering={FadeIn.delay(100)}
            style={[styles.iconContainer, { backgroundColor: colors.error + "15" }]}
          >
            <MaterialIcons name="delete-outline" size={32} color={colors.error} />
          </Animated.View>

          <Text style={[styles.title, { color: colors.text }]}>Delete Task</Text>

          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
          </Text>

          <View style={styles.buttons}>
            <Button title="Cancel" variant="secondary" onPress={onClose} disabled={isDeleting} style={styles.button} />
            <Button
              title={isDeleting ? "Deleting..." : "Delete"}
              onPress={onConfirm}
              loading={isDeleting}
              disabled={isDeleting}
              style={[styles.button]}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
  },
});
