import { Button } from "@/src/components/shared/Button";
import { Input } from "@/src/components/shared/Input";
import useUserStore from "@/src/stores/userStore";

import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const { user, setUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const containerScale = useSharedValue(0.9);
  const containerOpacity = useSharedValue(0);

  React.useEffect(() => {
    containerScale.value = withSpring(1, { damping: 20, stiffness: 100 });
    containerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  //   const onSubmit = async (data: LoginFormData) => {
  //     try {
  //       const mockUser = {
  //         id: "1",
  //         email: data.email,
  //         name: "Usuario Demo",
  //       };
  //       const mockToken = "demo-token-123";

  //       await login(mockUser, mockToken);
  //       router.replace("/(tabs)");
  //     } catch (error) {
  //       console.error("Login error:", error);
  //     }
  //   };
  console.log(user);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {router.canGoBack() && (
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <KeyboardAwareScrollView
        style={styles.keyboardAwareContainer}
        contentContainerStyle={styles.keyboardAwareContent}
        showsVerticalScrollIndicator={false}
      >
        <Button
          title="set user"
          onPress={() => setUser({ id: "1", name: "John Doe", email: "john.doe@example.com" })}
        />
        <View style={styles.content}>
          <Animated.View style={[styles.card, containerAnimatedStyle]}>
            <View style={styles.header}>
              <MaterialIcons name="lock" size={24} color="#FFFFFF" />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your appointment management account</Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      setEmailFocused(false);
                      onBlur();
                    }}
                    onFocus={() => setEmailFocused(true)}
                    focused={emailFocused}
                    error={errors.email?.message}
                    icon="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      setPasswordFocused(false);
                      onBlur();
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    focused={passwordFocused}
                    error={errors.password?.message}
                    icon="lock"
                    secureTextEntry={!showPassword}
                    showPasswordToggle
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <Button
                title={isSubmitting ? "Signing In..." : "Sign In"}
                onPress={() => setUser({ id: "1", name: "John Doe", email: "john.doe@example.com" })}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.signInButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <Button
                  title="Continue with Google"
                  variant="social"
                  icon={<MaterialIcons name="search" size={20} color="#FFFFFF" />}
                />

                <Button
                  title="Continue with Microsoft"
                  variant="social"
                  icon={<MaterialIcons name="business" size={20} color="#FFFFFF" />}
                />

                <Button
                  title="Continue with GitHub"
                  variant="social"
                  icon={<MaterialIcons name="code" size={20} color="#FFFFFF" />}
                />
              </View>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                {/* <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                  <Text style={styles.signUpLink}>Sign up</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAwareContainer: {
    flex: 1,
  },
  keyboardAwareContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#60A5FA",
  },
  signInButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    color: "#9CA3AF",
    fontSize: 12,
    paddingHorizontal: 16,
    fontWeight: "500",
  },
  socialButtons: {
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  signUpLink: {
    color: "#60A5FA",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
