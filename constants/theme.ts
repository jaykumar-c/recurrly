export const colors = {
  background: "#F8FAFC",
  foreground: "#0F172A",
  card: "#FFFFFF",
  muted: "#F1F5F9",
  mutedForeground: "rgba(15, 23, 42, 0.6)",
  primary: "#0F172A",
  accent: "#2563EB",
  border: "rgba(15, 23, 42, 0.08)",
  success: "#10B981",
  destructive: "#EF4444",
  subscription: "#38BDF8",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
    itemPaddingVertical: spacing[2],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
