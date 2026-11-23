import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import { clsx } from "clsx";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  expanded,
  onPress,
  paymentMethod,
  startDate,
  status,
  onCancelPress,
  isCancelling,
  onManagePress,
  onChangePlanPress,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", !color && (expanded ? "bg-muted" : "bg-card"))}
      style={color ? { backgroundColor: color } : undefined}
    >
      {/* subtitle */}
      <View className="sub-head">
        <View className="sub-main">
          <View className="size-16 items-center justify-center rounded-xl bg-white/70">
            <Image
              source={icon}
              className="size-11"
              resizeMode="contain"
            />
          </View>
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {plan?.trim() ||
                category?.trim() ||
                (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>

      {/* EXPANDED CARD DETAILS */}
      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment info:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {paymentMethod?.trim() ?? "*****8530"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onManagePress}
                className="rounded-full border border-primary/20 bg-white/70 px-4 py-1"
                activeOpacity={0.7}
              >
                <Text className="text-xs font-sans-semibold text-primary">
                  Manage
                </Text>
              </TouchableOpacity>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Plan details:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {plan?.trim() || category?.trim() || "Premium"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onChangePlanPress}
                className="rounded-full border border-primary/20 bg-white/70 px-4 py-1"
                activeOpacity={0.7}
              >
                <Text className="text-xs font-sans-semibold text-primary">
                  Change
                </Text>
              </TouchableOpacity>
            </View>

            {renewalDate && (
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Renewal date:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatSubscriptionDateTime(renewalDate)}
                  </Text>
                </View>
              </View>
            )}

            {status && (
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Status:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatStatusLabel(status)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onCancelPress}
            className={clsx("sub-cancel", isCancelling && "sub-cancel-disabled")}
            activeOpacity={0.8}
            disabled={isCancelling}
          >
            <Text className="sub-cancel-text">
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};
export default SubscriptionCard;
