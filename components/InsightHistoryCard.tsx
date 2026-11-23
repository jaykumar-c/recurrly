import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Image, Text, View } from "react-native";

interface InsightHistoryCardProps {
  item: InsightHistoryItem;
}

export default function InsightHistoryCard({ item }: InsightHistoryCardProps) {
  return (
    <View
      className="rounded-2xl border border-border bg-card p-4"
      style={item.color ? { backgroundColor: item.color } : undefined}
    >
      <View className="flex-row items-center justify-between">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View className="size-14 items-center justify-center rounded-xl bg-background/80">
            <Image
              source={item.icon}
              className="size-10"
              resizeMode="contain"
            />
          </View>
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="text-lg font-sans-bold text-primary"
            >
              {item.name}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 text-sm font-sans-medium text-muted-foreground"
            >
              {item.date}
            </Text>
          </View>
        </View>

        <View className="ml-3 shrink-0 items-end">
          <Text className="text-lg font-sans-bold text-primary">
            {formatCurrency(item.price, item.currency)}
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground">
            {item.billing}
          </Text>
        </View>
      </View>
    </View>
  );
}
