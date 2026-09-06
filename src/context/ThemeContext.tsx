import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkTheme, lightTheme, AppTheme } from "../theme/colors";

type ThemeMode = "system" | "dark" | "light";

interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const STORAGE_KEY = "@gymy_theme_mode";

// Context initialization
const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  mode: "system",
  isDark: true,
  setMode: async () => {},
});

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  // Load saved preference from storage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "dark" || stored === "light" || stored === "system") {
        setModeState(stored);
      }
    });
  }, []);

  // Update preference and persist to storage
  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";
  const theme: AppTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
