import ConfirmationModal from "@/components/ConfirmationModal";
import InsightHistoryCard from "@/components/InsightHistoryCard";
import ListHeading from "@/components/ListHeading";
import ScreenHeader from "@/components/ScreenHeader";
import WeeklyInsightsChart from "@/components/WeeklyInsightsChart";
import {
  INSIGHTS_HISTORY_DATA,
  INSIGHTS_WEEKLY_DATA,
  MONTHLY_EXPENSES_DATA,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type InsightsModalType = "upcoming" | "history" | null;

interface InsightsModalConfig {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  confirmBgColor: string;
}

export default function InsightsScreen() {
  const [activeModal, setActiveModal] = useState<InsightsModalType>(null);

  const getModalConfig = (): InsightsModalConfig => {
    if (activeModal === "upcoming") {
      return {
        title: "Upcoming Insights",
        message:
          "You have 6 scheduled renewal charges totaling $176.44 coming up this month.",
        confirmText: "Got it",
        cancelText: "Dismiss",
        iconName: "trending-up-outline",
        iconColor: "#2563EB",
        iconBgColor: "bg-accent/10",
        confirmBgColor: "bg-primary",
      };
    }
    return {
      title: "Payment History",
      message:
        "Viewing all completed subscription payments. 18 successful charges recorded over the past 6 months.",
      confirmText: "Got it",
      cancelText: "Dismiss",
      iconName: "time-outline",
      iconColor: "#2563EB",
      iconBgColor: "bg-accent/10",
      confirmBgColor: "bg-primary",
    };
  };

  const modalConfig = getModalConfig();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={INSIGHTS_HISTORY_DATA}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <ScreenHeader title="Monthly Insights" />

            {/* Upcoming Section */}
            <ListHeading
              title="Upcoming"
              onViewAllPress={() => setActiveModal("upcoming")}
            />

            {/* Bar Chart */}
            <WeeklyInsightsChart data={INSIGHTS_WEEKLY_DATA} />

            {/* Monthly Expenses Card */}
            <View className="mt-4 rounded-3xl border border-border bg-card p-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xl font-sans-bold text-primary">
                    Expenses
                  </Text>
                  <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                    {MONTHLY_EXPENSES_DATA.month}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-2xl font-sans-bold text-primary">
                    -
                    {formatCurrency(
                      MONTHLY_EXPENSES_DATA.amount,
                      MONTHLY_EXPENSES_DATA.currency,
                    )}
                  </Text>
                  <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                    +{MONTHLY_EXPENSES_DATA.changePercentage}%
                  </Text>
                </View>
              </View>
            </View>

            {/* History Section Heading */}
            <ListHeading
              title="History"
              onViewAllPress={() => setActiveModal("history")}
            />
          </>
        }
        renderItem={({ item }) => <InsightHistoryCard item={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
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
        onConfirm={() => setActiveModal(null)}
        onCancel={() => setActiveModal(null)}
      />
    </SafeAreaView>
  );
}
