import BrandLogo from "@/components/BrandLogo";
import KeyboardAwareView from "@/components/KeyboardAwareView";
import { colors } from "@/constants/theme";
import {
  executeGoogleAuth,
  executePasswordSignUp,
  executeResendVerificationCode,
  executeResetSignUp,
  executeVerifyEmailCode,
  validateSignUp,
} from "@/lib/auth";
import { useWarmUpBrowser } from "@/lib/useWarmUpBrowser";
import { en } from "@/locales/en";
import { useAuth, useClerk, useSignUp, useSSO } from "@clerk/expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded: isAuthLoaded } = useAuth();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const { startSSOFlow } = useSSO();
  useWarmUpBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    code?: string;
  }>({});

  // Email verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSignUp = async () => {
    if (isSubmitting || isGoogleSubmitting) return;

    setFormError(null);
    const validation = validateSignUp(email, password);
    setFieldErrors(validation.errors);
    if (!validation.isValid) return;

    if (!isAuthLoaded || !signUp) {
      setFormError(en.validation.authInitializing);
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    const result = await executePasswordSignUp(signUp, email, password);

    if (result.success) {
      setIsVerifying(true);
      setResendCooldown(30);
    } else {
      setFormError(result.error || null);
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignUp = async () => {
    if (isSubmitting || isGoogleSubmitting) return;

    setFormError(null);
    setIsGoogleSubmitting(true);

    const result = await executeGoogleAuth(startSSOFlow);

    if (result.success && result.isComplete) {
      router.replace("/(tabs)");
    } else if (result.error) {
      setFormError(result.error);
    }

    setIsGoogleSubmitting(false);
  };

  const handleVerify = async () => {
    if (isSubmitting) return;

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setFieldErrors({ code: en.validation.codeRequired });
      return;
    }

    setFieldErrors({});
    setFormError(null);
    Keyboard.dismiss();
    setIsSubmitting(true);

    if (!signUp) {
      setFormError(en.validation.authInitializing);
      setIsSubmitting(false);
      return;
    }

    const result = await executeVerifyEmailCode(signUp, trimmedCode, setActive);

    if (result.success && result.isComplete) {
      router.replace("/(tabs)");
    } else {
      setFormError(result.error || null);
    }

    setIsSubmitting(false);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending || !signUp) return;

    setIsResending(true);
    setFormError(null);

    const result = await executeResendVerificationCode(signUp);

    if (result.success) {
      setResendCooldown(30);
    } else {
      setFormError(result.error || null);
    }

    setIsResending(false);
  };

  const handleChangeEmail = async () => {
    if (isSubmitting) return;

    await executeResetSignUp(signUp);
    setIsVerifying(false);
    setCode("");
    setFormError(null);
    setFieldErrors({});
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      className="auth-safe-area"
    >
      <StatusBar style="dark" />
      <KeyboardAwareView
        style={{ flex: 1 }}
        className="auth-scroll"
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={50}
      >
        <View className="auth-content justify-center">
          {/* Brand Header */}
          <View className="auth-brand-block">
            <BrandLogo />
            <Text className="auth-title">
              {isVerifying ? en.auth.verifyTitle : en.auth.signUpTitle}
            </Text>
            <Text className="auth-subtitle">
              {isVerifying
                ? `${en.auth.verifySubtitlePrefix}${email}`
                : en.auth.signUpSubtitle}
            </Text>
          </View>

          {/* Form Card */}
          <View className="auth-card">
            {formError && (
              <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5">
                <Text className="text-center text-sm font-sans-medium text-destructive">
                  {formError}
                </Text>
              </View>
            )}

            {isVerifying ? (
              /* Verification View */
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">{en.auth.codeLabel}</Text>
                  <TextInput
                    value={code}
                    onChangeText={(text) => {
                      setCode(text.replace(/[^0-9]/g, ""));
                      if (fieldErrors.code) {
                        setFieldErrors((prev) => ({ ...prev, code: undefined }));
                      }
                      if (formError) setFormError(null);
                    }}
                    placeholder={en.auth.codePlaceholder}
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    keyboardType="number-pad"
                    maxLength={6}
                    className={`auth-input text-center text-xl tracking-[6px] font-sans-bold ${
                      fieldErrors.code ? "auth-input-error" : ""
                    }`}
                    editable={!isSubmitting}
                    autoFocus
                  />
                  {fieldErrors.code && (
                    <Text className="auth-error text-center">
                      {fieldErrors.code}
                    </Text>
                  )}
                </View>

                {/* Primary Verify Button */}
                <Pressable
                  onPress={handleVerify}
                  disabled={isSubmitting}
                  className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
                  accessibilityRole="button"
                  accessibilityLabel={en.auth.verifyAction}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="auth-button-text">
                      {en.auth.verifyAction}
                    </Text>
                  )}
                </Pressable>

                {/* Resend & Edit Email Controls */}
                <View className="mt-4 items-center gap-3">
                  <Pressable
                    onPress={handleResendCode}
                    disabled={resendCooldown > 0 || isResending}
                    className="py-1"
                  >
                    <Text
                      className={`text-sm font-sans-semibold ${
                        resendCooldown > 0 || isResending
                          ? "text-muted-foreground"
                          : "text-accent"
                      }`}
                    >
                      {isResending
                        ? en.auth.resendingAction
                        : resendCooldown > 0
                        ? `${en.auth.resendCooldownPrefix}${resendCooldown}s`
                        : en.auth.resendAction}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleChangeEmail}
                    disabled={isSubmitting}
                    className="py-1"
                  >
                    <Text className="text-xs font-sans-medium text-muted-foreground underline">
                      {en.auth.editEmailAction}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              /* Sign Up Form View */
              <View className="auth-form">
                {/* Email Field */}
                <View className="auth-field">
                  <Text className="auth-label">{en.auth.emailLabel}</Text>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                      if (formError) setFormError(null);
                    }}
                    placeholder={en.auth.emailPlaceholder}
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    className={`auth-input ${
                      fieldErrors.email ? "auth-input-error" : ""
                    }`}
                    editable={!isSubmitting && !isGoogleSubmitting}
                  />
                  {fieldErrors.email && (
                    <Text className="auth-error">{fieldErrors.email}</Text>
                  )}
                </View>

                {/* Password Field */}
                <View className="auth-field">
                  <Text className="auth-label">{en.auth.passwordLabel}</Text>
                  <View className="relative justify-center">
                    <TextInput
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                        if (formError) setFormError(null);
                      }}
                      placeholder={en.auth.passwordPlaceholderSignUp}
                      placeholderTextColor="rgba(0, 0, 0, 0.4)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      className={`auth-input pr-12 ${
                        fieldErrors.password ? "auth-input-error" : ""
                      }`}
                      editable={!isSubmitting && !isGoogleSubmitting}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 p-1"
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                  {fieldErrors.password ? (
                    <Text className="auth-error">{fieldErrors.password}</Text>
                  ) : (
                    <Text className="auth-helper">
                      {en.auth.passwordHelper}
                    </Text>
                  )}
                </View>

                {/* Primary Create Account Button */}
                <Pressable
                  onPress={handleSignUp}
                  disabled={isSubmitting || isGoogleSubmitting}
                  className={`auth-button ${
                    isSubmitting || isGoogleSubmitting ? "auth-button-disabled" : ""
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={en.auth.signUpAction}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="auth-button-text">
                      {en.auth.signUpAction}
                    </Text>
                  )}
                </Pressable>

                {/* Social Divider */}
                <View className="auth-divider-row">
                  <View className="auth-divider-line" />
                  <Text className="auth-divider-text">
                    {en.auth.dividerText}
                  </Text>
                  <View className="auth-divider-line" />
                </View>

                {/* Google Auth Button */}
                <Pressable
                  onPress={handleGoogleSignUp}
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-background py-3.5 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={en.auth.googleAction}
                >
                  {isGoogleSubmitting ? (
                    <ActivityIndicator size="small" color={colors.accent} />
                  ) : (
                    <>
                      <AntDesign name="google" size={18} color="#081126" />
                      <Text className="text-sm font-sans-bold text-primary">
                        {en.auth.googleAction}
                      </Text>
                    </>
                  )}
                </Pressable>

                {/* Web CAPTCHA container for web fallback if needed */}
                {Platform.OS === "web" && <View nativeID="clerk-captcha" />}

                {/* Trust & Terms caption */}
                <Text className="mt-2 text-center text-xs font-sans-medium text-muted-foreground">
                  {en.auth.termsNotice}
                </Text>
              </View>
            )}

            {/* Footer Switch to Sign In */}
            {!isVerifying && (
              <View className="auth-link-row">
                <Text className="auth-link-text">
                  {en.auth.alreadyHaveAccount}
                </Text>
                <Link href="/(auth)/signIn" asChild>
                  <Pressable hitSlop={8}>
                    <Text className="auth-link">
                      {en.auth.signInLink}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}
