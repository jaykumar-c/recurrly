import images from "@/constants/image";
import { colors } from "@/constants/theme";
import { en } from "@/locales/en";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const { height: screenHeight } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.accent }}
      className="flex-1 bg-accent"
    >
      <StatusBar style="light" />

      <View className="flex-1 justify-between px-6 pb-8 pt-4">
        {/* Top Graphic Artwork */}
        <View
          style={{ height: screenHeight * 0.52 }}
          className="w-full items-center justify-center overflow-hidden rounded-3xl"
        >
          <Image
            source={images.splashPattern}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Bottom Content */}
        <View className="items-center pb-2 pt-6">
          <Text className="text-center text-4xl font-sans-extrabold text-white">
            {en.onboarding.title}
          </Text>
          <Text className="mt-3 text-center text-base font-sans-medium text-white/80">
            {en.onboarding.subtitle}
          </Text>

          <Pressable
            onPress={() => router.push("/(auth)/signIn")}
            className="mt-8 w-full items-center justify-center rounded-full bg-white py-4 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel={en.onboarding.getStarted}
          >
            <Text className="text-base font-sans-bold text-primary">
              {en.onboarding.getStarted}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(auth)/signIn")}
            className="mt-4 py-2"
          >
            <Text className="text-sm font-sans-medium text-white/80">
              {en.onboarding.alreadyHaveAccount}{" "}
              <Text className="font-sans-bold text-white underline">
                {en.onboarding.signIn}
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
