import ConfirmationModal from "@/components/ConfirmationModal";
import ScreenHeader from "@/components/ScreenHeader";
import SubscriptionCard from "@/components/SubscriptionCard";
import { MY_SUBSCRIPTIONS } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type ModalType = "cancel" | "manage" | "change" | null;

interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  confirmBgColor: string;
}

export default function SubscriptionsScreen() {
  const [subscriptionsList, setSubscriptionsList] =
    useState<Subscription[]>(MY_SUBSCRIPTIONS);
  const [expandedId, setExpandedId] = useState<string | null>(
    "github-copilot-sub",
  );
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCancelPress = (item: Subscription) => {
    setSelectedSub(item);
    setActiveModal("cancel");
  };

  const handleManagePress = (item: Subscription) => {
    setSelectedSub(item);
    setActiveModal("manage");
  };

  const handleChangePlanPress = (item: Subscription) => {
    setSelectedSub(item);
    setActiveModal("change");
  };

  const handleConfirmAction = () => {
    if (activeModal === "cancel" && selectedSub) {
      setSubscriptionsList((prev) =>
        prev.map((sub) =>
          sub.id === selectedSub.id ? { ...sub, status: "cancelled" } : sub,
        ),
      );
    }
    setActiveModal(null);
    setSelectedSub(null);
  };

  const getModalConfig = (): ModalConfig => {
    const subName = selectedSub?.name || "this subscription";
    switch (activeModal) {
      case "manage":
        return {
          type: "manage",
          title: "Manage Payment",
          message: `Update your payment methods and billing preferences for ${subName}.`,
          confirmText: "Update Method",
          cancelText: "Dismiss",
          iconName: "card-outline",
          iconColor: "#2563EB",
          iconBgColor: "bg-accent/10",
          confirmBgColor: "bg-primary",
        };
      case "change":
        return {
          type: "change",
          title: "Change Subscription Plan",
          message: `Choose a different plan tier or billing frequency for ${subName}.`,
          confirmText: "Change Plan",
          cancelText: "Dismiss",
          iconName: "swap-horizontal-outline",
          iconColor: "#2563EB",
          iconBgColor: "bg-accent/10",
          confirmBgColor: "bg-primary",
        };
      case "cancel":
      default:
        return {
          type: "cancel",
          title: "Cancel Subscription",
          message: `Are you sure you want to cancel your ${subName} subscription? You will still have access until the end of the billing period.`,
          confirmText: "Yes, Cancel",
          cancelText: "Keep Subscription",
          iconName: "alert-circle-outline",
          iconColor: "#EF4444",
          iconBgColor: "bg-destructive/10",
          confirmBgColor: "bg-destructive",
        };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={subscriptionsList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <ScreenHeader title="My Subscriptions" showOptions={false} />
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() => handleToggleExpand(item.id)}
            onCancelPress={() => handleCancelPress(item)}
            onManagePress={() => handleManagePress(item)}
            onChangePlanPress={() => handleChangePlanPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />

      <ConfirmationModal
        visible={activeModal !== null}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        iconName={modalConfig.iconName}
        iconColor={modalConfig.iconColor}
        iconBgColor={modalConfig.iconBgColor}
        confirmBgColor={modalConfig.confirmBgColor}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setActiveModal(null);
          setSelectedSub(null);
        }}
      />
    </SafeAreaView>
  );
}
