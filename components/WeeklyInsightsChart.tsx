import { INSIGHTS_WEEKLY_DATA } from "@/constants/data";
import React from "react";
import { Text, View } from "react-native";

interface WeeklyInsightsChartProps {
  data?: InsightWeeklyBar[];
}

const Y_TICKS = [45, 35, 25, 5, 0];
const MAX_VALUE = 45;
const CHART_HEIGHT = 150;

export default function WeeklyInsightsChart({
  data = INSIGHTS_WEEKLY_DATA,
}: WeeklyInsightsChartProps) {
  return (
    <View className="rounded-3xl border border-border bg-card p-5">
      {/* Chart container */}
      <View style={{ height: CHART_HEIGHT }} className="relative flex-row">
        {/* Y Axis Labels */}
        <View className="h-full w-7 justify-between py-1">
          {Y_TICKS.map((tick) => (
            <Text
              key={tick}
              className="text-[11px] font-sans-medium text-muted-foreground"
            >
              {tick}
            </Text>
          ))}
        </View>

        {/* Plotting area */}
        <View className="relative flex-1">
          {/* Horizontal Grid lines */}
          {Y_TICKS.map((tick) => {
            const topPercent = ((MAX_VALUE - tick) / MAX_VALUE) * 100;
            return (
              <View
                key={tick}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${Math.min(Math.max(topPercent, 0), 98)}%`,
                }}
                className="border-b border-dashed border-border"
              />
            );
          })}

          {/* Bars */}
          <View className="h-full flex-row items-end justify-between px-2">
            {data.map((item) => {
              const barHeight = Math.max(
                (item.value / MAX_VALUE) * (CHART_HEIGHT - 35),
                6,
              );
              return (
                <View
                  key={item.day}
                  className="w-8 items-center justify-end"
                >
                  {/* Tooltip for highlighted bar */}
                  {item.isHighlighted && (
                    <View className="mb-1.5 items-center">
                      <View className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5">
                        <Text className="text-[10px] font-sans-bold text-accent">
                          {item.formattedValue || `$${item.value}`}
                        </Text>
                      </View>
                      <View className="h-2 w-px border-l border-dashed border-accent" />
                    </View>
                  )}

                  {/* Vertical Bar */}
                  <View
                    style={{ height: barHeight }}
                    className={`w-3.5 rounded-full ${
                      item.isHighlighted ? "bg-accent" : "bg-primary"
                    }`}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* X Axis Labels */}
      <View className="ml-7 mt-3 flex-row justify-between px-2">
        {data.map((item) => (
          <View key={item.day} className="w-8 items-center">
            <Text className="text-xs font-sans-medium text-muted-foreground">
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
