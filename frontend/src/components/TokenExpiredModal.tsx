import { Button } from "@/src/components/shared/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { Text } from "./Themed";

interface TokenExpiredModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TokenExpiredModal: React.FC<TokenExpiredModalProps> = ({ visible, onClose }) => {
  const handleLoginRedirect = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(15).stiffness(200)}
          exiting={SlideOutDown.springify().damping(15).stiffness(200)}
          style={styles.modal}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="error" size={48} color="#F87171" />
            </View>
            <Text style={styles.title}>Session Expired</Text>
            <Text style={styles.message}>Your session has expired. Please log in again to continue using the app.</Text>
          </View>

          <View style={styles.footer}>
            <Button title="Log In Again" onPress={handleLoginRedirect} style={styles.loginButton} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 24,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loginButton: {
    marginBottom: 0,
  },
});
