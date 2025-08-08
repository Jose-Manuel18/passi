import { Button } from "@/src/components/shared/Button";
import { Input } from "@/src/components/shared/Input";
import { useLoginMutation, useRegisterMutation } from "@/src/hooks/useAuth";
import { useTheme } from "@/src/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { BounceIn, FadeIn, SlideInDown, SlideInLeft, SlideInRight } from "react-native-reanimated";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen = () => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const { mutateAsync: registerMutate, isPending: isRegistering } = useRegisterMutation();
  const { mutateAsync: loginMutate, isPending: isLoggingIn } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const isLoading = isRegistering || isLoggingIn;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // First, register the user
      await registerMutate({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Then automatically log them in
      await loginMutate({
        email: data.email,
        password: data.password,
      });

      // Navigate to the main app
      router.replace("/(app)");
    } catch (error) {
      Alert.alert("Registration Failed", error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        style={styles.keyboardAwareContainer}
        contentContainerStyle={styles.keyboardAwareContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Animated.View style={styles.header} entering={FadeIn.delay(400).duration(600)}>
              <Animated.View entering={BounceIn.delay(600).duration(800)}>
                <MaterialIcons name="person-add" size={24} color={colors.primary} />
              </Animated.View>
              <Animated.Text
                style={[styles.title, { color: colors.text }]}
                entering={SlideInDown.delay(700).duration(500)}
              >
                Create Account
              </Animated.Text>
              <Animated.Text
                style={[styles.subtitle, { color: colors.textSecondary }]}
                entering={SlideInDown.delay(800).duration(500)}
              >
                Sign up to start managing your tasks
              </Animated.Text>
            </Animated.View>

            <View style={styles.form}>
              <Animated.View entering={SlideInLeft.delay(900).duration(400)}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        setNameFocused(false);
                        onBlur();
                      }}
                      onFocus={() => setNameFocused(true)}
                      focused={nameFocused}
                      error={errors.name?.message}
                      icon="person"
                      autoCapitalize="words"
                    />
                  )}
                />
              </Animated.View>

              <Animated.View entering={SlideInRight.delay(1000).duration(400)}>
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
              </Animated.View>

              <Animated.View entering={SlideInLeft.delay(1100).duration(400)}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Create a password"
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
              </Animated.View>

              <Animated.View entering={SlideInRight.delay(1200).duration(400)}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        setConfirmPasswordFocused(false);
                        onBlur();
                      }}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      focused={confirmPasswordFocused}
                      error={errors.confirmPassword?.message}
                      icon="lock"
                      secureTextEntry={!showConfirmPassword}
                      showPasswordToggle
                      onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  )}
                />
              </Animated.View>

              <Animated.View entering={FadeIn.delay(1300).duration(400)}>
                <Button
                  title={isRegistering ? "Creating Account..." : isLoggingIn ? "Signing You In..." : "Create Account"}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  loading={isLoading}
                  style={styles.registerButton}
                />
              </Animated.View>

              <Animated.View entering={FadeIn.delay(1400).duration(400)}>
                <View style={styles.loginLink}>
                  <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                    <Text style={[styles.loginLinkButton, { color: colors.primary }]}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
    overflow: "hidden",
    position: "relative",
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  form: {
    padding: 16,
    gap: 12,
  },
  registerButton: {
    marginTop: 8,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
  },
  loginLinkButton: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;
