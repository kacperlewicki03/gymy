import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import {
  registerUserWithProfile,
  isEmailAvailable,
  isUsernameAvailable,
} from "../../services/authService";
import { mapFirebaseAuthError } from "../../utils/authErrors";
import { ValuePickerModal } from "../../components/ValuePickerModal";

// Range generators
const HEIGHT_OPTIONS = Array.from({ length: 111 }, (_, i) => 120 + i); // 120 to 230 cm
const WEIGHT_OPTIONS = Array.from({ length: 291 }, (_, i) =>
  parseFloat((35 + i * 0.5).toFixed(1)),
); // 35 to 180 kg

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Username
  const [username, setUsername] = useState("");

  // Step 3: Profile & Metrics
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Birth Date
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Height & Weight
  const [selectedHeight, setSelectedHeight] = useState<number>(178);
  const [isHeightSelected, setIsHeightSelected] = useState(false);
  const [showHeightPicker, setShowHeightPicker] = useState(false);

  const [selectedWeight, setSelectedWeight] = useState<number>(75.0);
  const [isWeightSelected, setIsWeightSelected] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  // Statuses
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handlers for Pickers
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "set" && date) {
      setBirthDate(date);
      setIsDateSelected(true);
    }
  };

  // Step 1 Validation
  const handleNextStep1 = async () => {
    setErrorMessage(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(t("authErrors.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setErrorMessage(t("authErrors.weakPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t("auth.passwordsDoNotMatch"));
      return;
    }

    setIsCheckingEmail(true);
    try {
      const available = await isEmailAvailable(email.trim());
      if (!available) {
        setErrorMessage(t("authErrors.emailInUse"));
        return;
      }
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMessage(mapFirebaseAuthError(err.code || "unknown"));
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Step 2 Validation
  const handleNextStep2 = async () => {
    setErrorMessage(null);
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser.length < 3) {
      setErrorMessage(t("auth.usernameTooShort"));
      return;
    }

    setIsCheckingUsername(true);
    try {
      const available = await isUsernameAvailable(cleanUser);
      if (!available) {
        setErrorMessage(t("auth.usernameTaken"));
        return;
      }
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMessage(mapFirebaseAuthError(err.code || "unknown"));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Step 3 Validation & Finish
  const handleFinalSubmit = async () => {
    setErrorMessage(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !isDateSelected ||
      !isHeightSelected ||
      !isWeightSelected
    ) {
      setErrorMessage(t("auth.fillAllFields"));
      return;
    }

    const formattedDate = birthDate.toISOString().split("T")[0];

    setLoading(true);
    try {
      await registerUserWithProfile({
        email: email.trim(),
        password,
        username: username.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: formattedDate,
        heightCm: selectedHeight,
        weightKg: selectedWeight,
      });
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
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* Navigation & Step Dots */}
        <View style={styles.topNav}>
          {currentStep > 1 ? (
            <TouchableOpacity
              onPress={() => {
                setErrorMessage(null);
                setCurrentStep((prev) => (prev - 1) as 1 | 2);
              }}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          )}

          <View style={styles.dotsRow}>
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentStep === step
                        ? theme.primary
                        : currentStep > step
                          ? theme.accent
                          : theme.border,
                    width: currentStep === step ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={[typography.h1, { color: theme.text }]}>
            {currentStep === 1 && t("auth.step1Title")}
            {currentStep === 2 && t("auth.step2Title")}
            {currentStep === 3 && t("auth.step3Title")}
          </Text>
          <Text
            style={[
              typography.body,
              { color: theme.textSecondary, marginTop: 4 },
            ]}
          >
            {currentStep === 1 && t("auth.step1Subtitle")}
            {currentStep === 2 && t("auth.step2Subtitle")}
            {currentStep === 3 && t("auth.step3Subtitle")}
          </Text>
        </View>

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

        {/* ================= STEP 1: CREDENTIALS ================= */}
        {currentStep === 1 && (
          <View style={styles.formContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={t("auth.email")}
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

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

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={t("auth.confirmPassword")}
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleNextStep1}
              disabled={isCheckingEmail}
              activeOpacity={0.8}
            >
              {isCheckingEmail ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[typography.bodyBold, { color: "#FFFFFF" }]}>
                  {t("auth.next")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 2: USERNAME ================= */}
        {currentStep === 2 && (
          <View style={styles.formContainer}>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodyBold,
                  { color: theme.textSecondary, marginRight: 4 },
                ]}
              ></Text>
              <TextInput
                style={[styles.usernameInput, { color: theme.text }]}
                placeholder={t("auth.username")}
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleNextStep2}
              disabled={isCheckingUsername}
              activeOpacity={0.8}
            >
              {isCheckingUsername ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[typography.bodyBold, { color: "#FFFFFF" }]}>
                  {t("auth.next")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 3: ORDERED PROFILE DETAILS ================= */}
        {currentStep === 3 && (
          <View style={styles.formContainer}>
            {/* 1. First & Last Name */}
            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder={t("auth.firstName")}
                placeholderTextColor={theme.textSecondary}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder={t("auth.lastName")}
                placeholderTextColor={theme.textSecondary}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            {/* 2. Birth Date */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.pickerButton,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.primary}
                style={{ marginRight: 12 }}
              />
              <Text
                style={[
                  typography.body,
                  {
                    color: isDateSelected ? theme.text : theme.textSecondary,
                  },
                ]}
              >
                {isDateSelected
                  ? birthDate.toLocaleDateString(
                      i18n.language === "pl" ? "pl-PL" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  : t("auth.birthDate")}
              </Text>
            </TouchableOpacity>

            {/* DatePicker */}
            {showDatePicker && (
              <View
                style={
                  Platform.OS === "ios" ? styles.iosPickerContainer : undefined
                }
              >
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                  themeVariant={isDark ? "dark" : "light"}
                  onChange={handleDateChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(false);
                      setIsDateSelected(true);
                    }}
                    style={[styles.doneBtn, { backgroundColor: theme.primary }]}
                  >
                    <Text
                      style={[
                        typography.caption,
                        { color: "#FFFFFF", fontWeight: "700" },
                      ]}
                    >
                      {t("common.save")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 3. Height & 4. Weight Pickers */}
            <View style={styles.row}>
              {/* Height Selector Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowHeightPicker(true)}
                style={[
                  styles.pickerButton,
                  styles.halfInput,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="resize-outline"
                  size={18}
                  color={theme.accent}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    typography.body,
                    {
                      color: isHeightSelected
                        ? theme.text
                        : theme.textSecondary,
                    },
                  ]}
                >
                  {isHeightSelected ? `${selectedHeight} cm` : t("auth.height")}
                </Text>
              </TouchableOpacity>

              {/* Weight Selector Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowWeightPicker(true)}
                style={[
                  styles.pickerButton,
                  styles.halfInput,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="speedometer-outline"
                  size={18}
                  color={theme.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    typography.body,
                    {
                      color: isWeightSelected
                        ? theme.text
                        : theme.textSecondary,
                    },
                  ]}
                >
                  {isWeightSelected ? `${selectedWeight} kg` : t("auth.weight")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Height Modal */}
            <ValuePickerModal
              visible={showHeightPicker}
              title={t("auth.height")}
              unit="cm"
              items={HEIGHT_OPTIONS}
              selectedValue={selectedHeight}
              onSelect={(val) => {
                setSelectedHeight(val);
                setIsHeightSelected(true);
              }}
              onClose={() => setShowHeightPicker(false)}
            />

            {/* Weight Modal */}
            <ValuePickerModal
              visible={showWeightPicker}
              title={t("auth.weight")}
              unit="kg"
              items={WEIGHT_OPTIONS}
              selectedValue={selectedWeight}
              onSelect={(val) => {
                setSelectedWeight(val);
                setIsWeightSelected(true);
              }}
              onClose={() => setShowWeightPicker(false)}
            />

            {/* Final Submit */}
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleFinalSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[typography.bodyBold, { color: "#FFFFFF" }]}>
                  {t("auth.finish")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Footer Link */}
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          style={styles.footerLink}
        >
          <Text style={[typography.caption, { color: theme.primary }]}>
            {t("auth.haveAccount")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Component Styles

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  headerBlock: {
    marginBottom: 24,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  formContainer: {
    gap: 14,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  pickerButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iosPickerContainer: {
    alignItems: "center",
    marginVertical: 4,
  },
  doneBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  usernameInput: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerLink: {
    alignItems: "center",
    marginTop: 24,
  },
});
