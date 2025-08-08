import { Button } from "@/src/components/shared/Button";
import { Input } from "@/src/components/shared/Input";
import { useTheme } from "@/src/hooks/useTheme";
import { Task } from "@/src/services/tasks";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { z } from "zod";
import { Text } from "./Themed";

const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
});

type EditTaskFormData = z.infer<typeof editTaskSchema>;

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  task,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
      });
    }
  }, [task, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: EditTaskFormData) => {
    try {
      await onSubmit({
        title: data.title,
        description: data.description || undefined,
      });
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} presentationStyle="pageSheet" animationType="slide">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Edit Task</Text>

          <View style={styles.placeholder} />
        </Animated.View>

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={SlideInDown.delay(100).duration(400)} style={styles.form}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    setTitleFocused(false);
                    onBlur();
                  }}
                  onFocus={() => setTitleFocused(true)}
                  focused={titleFocused}
                  error={errors.title?.message}
                  icon="assignment"
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description (Optional)"
                  placeholder="Add some details..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => {
                    setDescriptionFocused(false);
                    onBlur();
                  }}
                  onFocus={() => setDescriptionFocused(true)}
                  focused={descriptionFocused}
                  error={errors.description?.message}
                  icon="description"
                  multiline
                  numberOfLines={4}
                  style={{ minHeight: 100 }}
                />
              )}
            />

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={handleClose}
                disabled={isLoading}
                style={styles.button}
              />
              <Button
                title={isLoading ? "Updating..." : "Update Task"}
                onPress={handleSubmit(handleFormSubmit)}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              />
            </View>
          </Animated.View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  form: {
    gap: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
});
