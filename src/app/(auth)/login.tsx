import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { loginUser } from "../../services/authService";
import { mapFirebaseAuthError } from "../../utils/authErrors";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage(t("auth.fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await loginUser(identifier.trim(), password);
      // Redirection to /(tabs) handled by AuthContext listener in _layout.tsx
    } catch (err: any) {
      setErrorMessage(mapFirebaseAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Title */}
        <Text style={[typography.h1, { color: theme.text }]}>
          {t("auth.loginTitle")}
        </Text>
        <Text
          style={[
            typography.body,
            { color: theme.textSecondary, marginTop: 6, marginBottom: 28 },
          ]}
        >
          {t("auth.loginSubtitle")}
        </Text>

        {/* Error Alert */}
        {errorMessage && (
          <View
            style={[
              styles.errorBox,
              {
                backgroundColor: theme.danger + "15",
                borderColor: theme.danger,
              },
            ]}
          >
            <Text style={[typography.caption, { color: theme.danger }]}>
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Identifier Field (Email or Username) */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder={t("auth.emailOrUsername")}
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          value={identifier}
          onChangeText={setIdentifier}
        />

        {/* Password Field */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder={t("auth.password")}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[typography.bodyBold, styles.buttonText]}>
              {t("auth.signInBtn")}
            </Text>
          )}
        </TouchableOpacity>

        {/* Go to Register */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.footerLink}
        >
          <Text style={[typography.caption, { color: theme.primary }]}>
            {t("auth.noAccount")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
  },
  footerLink: {
    alignItems: "center",
    marginTop: 24,
  },
});
