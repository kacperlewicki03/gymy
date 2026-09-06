// Functional accent colors
export const palette = {
  primary: "#0A84FF",
  primaryMuted: "rgba(10, 132, 255, 0.15)",
  accent: "#30D158",
  danger: "#FF453A",
  warning: "#FF9F0A",
  white: "#FFFFFF",
  black: "#000000",
};

// Dark theme tokens
export const darkTheme = {
  mode: "dark" as const,
  background: "#0B0C10",
  surface: "#16181F",
  surfaceHover: "#1F222C",
  border: "#262936",
  text: "#F5F6F8",
  textSecondary: "#8A8F9E",
  inputBackground: "#12141A",
  primary: palette.primary,
  primaryMuted: palette.primaryMuted,
  accent: palette.accent,
  danger: palette.danger,
};

// Light theme tokens
export const lightTheme = {
  mode: "light" as const,
  background: "#F6F7FB",
  surface: "#FFFFFF",
  surfaceHover: "#F0F2F7",
  border: "#E2E5EE",
  text: "#12141A",
  textSecondary: "#6E7387",
  inputBackground: "#EEF0F5",
  primary: "#0066FF",
  primaryMuted: "rgba(0, 102, 255, 0.12)",
  accent: "#28CD41",
  danger: "#FF3B30",
};

// Theme type union
export type AppTheme = typeof darkTheme | typeof lightTheme;
