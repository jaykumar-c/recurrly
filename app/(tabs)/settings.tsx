import ConfirmationModal from "@/components/ConfirmationModal";
import images from "@/constants/image";
import { colors } from "@/constants/theme";
import { executeSignOut } from "@/lib/auth";
import { en } from "@/locales/en";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    en.settings.unregisteredEmail;

  const displayName =
    user?.fullName ||
    user?.firstName ||
    (primaryEmail.includes("@")
      ? primaryEmail.split("@")[0]
      : en.settings.fallbackName);

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);

    const result = await executeSignOut(signOut);

    if (result.success) {
      setShowSignOutModal(false);
      router.replace("/onboarding");
    } else {
      setSignOutError(result.error || null);
    }

    setIsSigningOut(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-sans-bold text-primary">
          {en.settings.title}
        </Text>

        {/* Profile Card */}
        <View className="mt-5 flex-row items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full"
          />
          <View className="min-w-0 flex-1">
            <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
              {displayName}
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
              {primaryEmail}
            </Text>
            <View className="mt-1.5 flex-row items-center gap-1.5">
              <View className="size-2 rounded-full bg-success" />
              <Text className="text-xs font-sans-semibold text-success">
                {en.settings.verifiedStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Details */}
        <View className="mt-6 gap-3">
          <Text className="text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground">
            {en.settings.accountSection}
          </Text>

          <View className="rounded-2xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {en.settings.emailLabel}
              </Text>
              <Text className="text-sm font-sans-semibold text-primary">
                {primaryEmail}
              </Text>
            </View>

            <View className="my-1 h-px bg-border/50" />

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {en.settings.statusLabel}
              </Text>
              <Text className="text-sm font-sans-semibold text-accent">
                {en.settings.activeStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Security & Preferences */}
        <View className="mt-6 gap-3">
          <Text className="text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground">
            {en.settings.securitySection}
          </Text>

          <View className="rounded-2xl border border-border bg-card p-4">
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center gap-3">
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-sans-medium text-primary">
                  {en.settings.authLabel}
                </Text>
              </View>
              <Text className="text-xs font-sans-semibold text-success">
                {en.settings.protectedStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="mt-8">
          <Pressable
            onPress={() => setShowSignOutModal(true)}
            disabled={isSigningOut}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-4 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={en.settings.signOutAction}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color="#dc2626" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
                <Text className="text-base font-sans-bold text-destructive">
                  {en.settings.signOutAction}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Branded Confirmation Modal */}
      <ConfirmationModal
        visible={showSignOutModal}
        title={en.settings.signOutTitle}
        message={signOutError || en.settings.signOutPrompt}
        confirmText={en.settings.signOutAction}
        cancelText={en.settings.cancelAction}
        isLoading={isSigningOut}
        onConfirm={handleConfirmSignOut}
        onCancel={() => {
          setSignOutError(null);
          setShowSignOutModal(false);
        }}
      />
    </SafeAreaView>
  );
}
