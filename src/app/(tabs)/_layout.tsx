import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

// Main Tab Navigation Layout

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              size={size || 24}
              color={typeof color === "string" ? color : theme.textSecondary}
            />
          ),
        }}
      />

      {/* Workout Tab */}
      <Tabs.Screen
        name="workout"
        options={{
          title: t("tabs.workout"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="dumbbell"
              size={size || 24}
              color={typeof color === "string" ? color : theme.textSecondary}
            />
          ),
        }}
      />

      {/* Profile & Settings Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-cog"
              size={size || 24}
              color={typeof color === "string" ? color : theme.textSecondary}
            />
          ),
        }}
      />
    </Tabs>
  );
}
