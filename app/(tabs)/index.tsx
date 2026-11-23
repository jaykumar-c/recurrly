import ConfirmationModal from "@/components/ConfirmationModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import images from "@/constants/image";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
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

export default function App() {
  const { user } = useUser();
  const [homeSubscriptions, setHomeSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [isUpcomingModalVisible, setIsUpcomingModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const userName =
    user?.fullName ||
    user?.firstName ||
    (user?.emailAddresses?.[0]?.emailAddress
      ? user.emailAddresses[0].emailAddress.split("@")[0]
      : HOME_USER.name);

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
      setHomeSubscriptions((prev) =>
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
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={homeSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId(
                expandedSubscriptionId === item.id ? null : item.id,
              )
            }
            onCancelPress={() => handleCancelPress(item)}
            onManagePress={() => handleManagePress(item)}
            onChangePlanPress={() => handleChangePlanPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 110,
        }}
        ListHeaderComponent={
          <>
            {/* Home Header - '+' icon removed as requested */}
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <Text className="home-user-name">{userName}</Text>
              </View>
            </View>

            {/* Home Balance card */}
            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            {/* Upcoming Subscriptions */}
            <View className="mb-5">
              <ListHeading
                title="Upcoming"
                onViewAllPress={() => setIsUpcomingModalVisible(true)}
              />

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming subscriptions
                  </Text>
                }
              />
            </View>

            {/* All Subscriptions - View all redirects to my subscriptions */}
            <ListHeading
              title="All Subscriptions"
              onViewAllPress={() => router.push("/(tabs)/subscriptions")}
            />
          </>
        }
      />

      {/* Modal displaying all upcoming subscriptions */}
      <ConfirmationModal
        visible={isUpcomingModalVisible}
        title="Upcoming Subscriptions"
        message="Here are all your scheduled renewals:"
        confirmText="Got it"
        cancelText="Close"
        iconName="calendar-outline"
        iconColor="#2563EB"
        iconBgColor="bg-accent/10"
        confirmBgColor="bg-primary"
        onConfirm={() => setIsUpcomingModalVisible(false)}
        onCancel={() => setIsUpcomingModalVisible(false)}
      >
        <View className="my-3 max-h-64 w-full">
          <ScrollView showsVerticalScrollIndicator={false} className="w-full">
            {UPCOMING_SUBSCRIPTIONS.map((item) => (
              <View
                key={item.id}
                className="mb-2.5 flex-row items-center justify-between rounded-2xl border border-border bg-background p-3"
              >
                <View className="flex-row items-center gap-3">
                  <View className="size-10 items-center justify-center rounded-xl bg-card">
                    <Image
                      source={item.icon}
                      className="size-7"
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <Text className="text-sm font-sans-bold text-primary">
                      {item.name}
                    </Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground">
                      {item.daysLeft > 1
                        ? `${item.daysLeft} days left`
                        : "Last day"}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-sans-bold text-primary">
                  {formatCurrency(item.price, item.currency)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ConfirmationModal>

      {/* Confirmation Modal for Subscription Card Actions (Manage, Change, Cancel) */}
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
