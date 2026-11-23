import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  showOptions?: boolean;
  onBackPress?: () => void;
  onOptionsPress?: () => void;
}

export default function ScreenHeader({
  title,
  showOptions = true,
  onBackPress,
  onOptionsPress,
}: ScreenHeaderProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="mb-5 flex-row items-center justify-between">
      <TouchableOpacity
        onPress={handleBack}
        className="size-11 items-center justify-center rounded-full border border-border bg-card"
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <Text className="text-xl font-sans-bold text-primary">{title}</Text>

      {showOptions ? (
        <TouchableOpacity
          onPress={onOptionsPress}
          className="size-11 items-center justify-center rounded-full border border-border bg-card"
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      ) : (
        <View className="size-11" />
      )}
    </View>
  );
}
