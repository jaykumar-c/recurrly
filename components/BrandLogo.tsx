import { en } from "@/locales/en";
import React from "react";
import { Text, View } from "react-native";

export default function BrandLogo() {
  return (
    <View className="auth-logo-wrap">
      <View className="auth-logo-mark">
        <Text className="auth-logo-mark-text">R</Text>
      </View>
      <View>
        <Text className="auth-wordmark">{en.auth.brandName}</Text>
        <Text className="auth-wordmark-sub">{en.auth.brandTagline}</Text>
      </View>
    </View>
  );
}
