import "@/global.css";
import { tokenCache } from "@/lib/token-cache";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

// Complete OAuth session if returning from WebBrowser
WebBrowser.maybeCompleteAuthSession();

// Prevent splash screen from auto-hiding until assets and auth are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function AppContent({
  fontsLoaded,
  fontError,
}: {
  fontsLoaded: boolean;
  fontError: Error | null;
}) {
  const { isLoaded: isAuthLoaded } = useAuth();

  useEffect(() => {
    // Dismiss splash screen ONLY when both fonts and auth state are loaded
    if ((fontsLoaded || fontError) && isAuthLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isAuthLoaded]);

  // Keep splash screen visible until both fonts and auth state are fully initialized
  if ((!fontsLoaded && !fontError) || !isAuthLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="subscriptions/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  if (!publishableKey) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
          padding: 24,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "#dc2626",
          }}
        >
          Configuration Error
        </Text>
        <Text
          style={{
            marginTop: 8,
            textAlign: "center",
            fontSize: 14,
            color: "#081126",
          }}
        >
          EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is missing. Please add your Clerk publishable key to .env and restart the dev server.
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AppContent fontsLoaded={fontsLoaded} fontError={fontError} />
    </ClerkProvider>
  );
}
