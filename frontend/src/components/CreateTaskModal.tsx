import { useTheme } from "@/src/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "./shared/Button";
import { Input } from "./shared/Input";
import { Text } from "./Themed";

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ visible, onClose, onSubmit, isLoading = false }) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title is required");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Reset form and close
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to create task. Please try again.");
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Create New Task</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Task Title"
              placeholder="What needs to be done?"
              value={title}
              onChangeText={setTitle}
              focused={titleFocused}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              icon="assignment"
            />

            <Input
              label="Description (Optional)"
              placeholder="Add some details..."
              value={description}
              onChangeText={setDescription}
              focused={descriptionFocused}
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              icon="description"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleClose}
              disabled={isLoading}
              style={styles.button}
            />
            <Button
              title={isLoading ? "Creating..." : "Create Task"}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading || !title.trim()}
              style={styles.button}
            />
          </View>
        </View>
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
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
    gap: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  button: {
    flex: 1,
  },
});
