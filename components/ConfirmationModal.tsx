import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  confirmBgColor?: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  iconName = "alert-circle-outline",
  iconColor = "#dc2626",
  iconBgColor = "bg-destructive/10",
  confirmBgColor = "bg-destructive",
  children,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <Pressable
          className="absolute inset-0"
          onPress={isLoading ? undefined : onCancel}
        />
        <View
          style={{ backgroundColor: colors.card }}
          className="w-full max-w-[340px] items-center rounded-3xl border border-border p-6 shadow-2xl"
        >
          {/* Icon Badge */}
          <View
            className={`mb-4 size-14 items-center justify-center rounded-2xl ${iconBgColor}`}
          >
            <Ionicons name={iconName} size={26} color={iconColor} />
          </View>

          {/* Title & Message */}
          <Text className="text-center text-xl font-sans-bold text-primary">
            {title}
          </Text>
          {message ? (
            <Text className="mt-2 text-center text-sm font-sans-medium text-muted-foreground leading-5">
              {message}
            </Text>
          ) : null}

          {/* Optional Content / Children */}
          {children}

          {/* Action Buttons */}
          <View className="mt-6 w-full gap-2.5">
            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              className={`w-full items-center justify-center rounded-2xl py-3.5 active:opacity-90 ${confirmBgColor}`}
              accessibilityRole="button"
              accessibilityLabel={confirmText}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-base font-sans-bold text-white">
                  {confirmText}
                </Text>
              )}
            </Pressable>

            {cancelText ? (
              <Pressable
                onPress={onCancel}
                disabled={isLoading}
                className="w-full items-center justify-center rounded-2xl py-3 active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel={cancelText}
              >
                <Text className="text-sm font-sans-semibold text-muted-foreground">
                  {cancelText}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
