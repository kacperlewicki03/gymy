import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/authContext";
import {
  fetchUserProfile,
  updateUserProfile,
  logoutUser,
} from "../../services/authService";
import { UserProfile } from "../../types/user";
import { typography } from "../../theme/typography";
import { ValuePickerModal } from "../../components/ValuePickerModal";

const LANGUAGE_STORAGE_KEY = "@gymy_language";

// Range generators matching registration
const HEIGHT_OPTIONS = Array.from({ length: 111 }, (_, i) => 120 + i); // 120 to 230 cm
const WEIGHT_OPTIONS = Array.from({ length: 291 }, (_, i) =>
  parseFloat((35 + i * 0.5).toFixed(1)),
); // 35 to 180 kg

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { theme, mode, setMode, isDark } = useTheme();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Pickers State
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [height, setHeight] = useState<number>(175);
  const [showHeightPicker, setShowHeightPicker] = useState(false);

  const [weight, setWeight] = useState<number>(75);
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;
      setLoading(true);
      const data = await fetchUserProfile(user.uid);
      if (data) {
        setProfile(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        if (data.birthDate) {
          setBirthDate(new Date(data.birthDate));
        }
        setHeight(data.heightCm || 175);
        setWeight(data.weightKg || 75);
      }
      setLoading(false);
    }
    loadData();
  }, [user?.uid]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const formattedBirthDate = birthDate.toISOString().split("T")[0];
      const updated = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: formattedBirthDate,
        heightCm: height,
        weightKg: weight,
      };
      await updateUserProfile(user.uid, updated);
      setProfile((prev) => (prev ? { ...prev, ...updated } : null));
      setIsEditing(false);
      Alert.alert(t("profile.saveChanges"), t("profile.updateSuccess"));
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (lang: "en" | "pl") => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const handleLogout = () => {
    Alert.alert(t("profile.signOut"), t("profile.signOutConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.signOut"),
        style: "destructive",
        onPress: () => logoutUser(),
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Screen Title */}
      <Text style={[typography.h1, { color: theme.text, marginBottom: 20 }]}>
        {t("profile.title")}
      </Text>

      {/* User Information Card */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[typography.caption, { color: theme.textSecondary }]}>
          {t("profile.accountSection").toUpperCase()}
        </Text>
        <TouchableOpacity onPress={() => setIsEditing((prev) => !prev)}>
          <Text
            style={[
              typography.caption,
              { color: theme.primary, fontWeight: "700" },
            ]}
          >
            {isEditing ? t("common.cancel") : t("profile.editProfile")}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <>
            {/* Header info */}
            <View style={styles.avatarRow}>
              <View
                style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}
              >
                <Ionicons name="person" size={24} color={theme.primary} />
              </View>
              <View style={styles.accountDetails}>
                <Text style={[typography.bodyBold, { color: theme.text }]}>
                  {profile?.username ? `${profile.username}` : user?.email}
                </Text>
                <Text
                  style={[typography.caption, { color: theme.textSecondary }]}
                >
                  {user?.email}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Editable or View fields */}
            {isEditing ? (
              <View style={styles.editFieldsContainer}>
                {/* 1. Name row */}
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
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder={t("auth.firstName")}
                    placeholderTextColor={theme.textSecondary}
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
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder={t("auth.lastName")}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                {/* 2. Birth Date Picker Trigger */}
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
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[typography.body, { color: theme.text }]}>
                    {birthDate.toLocaleDateString(
                      i18n.language === "pl" ? "pl-PL" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </Text>
                </TouchableOpacity>

                {/* DatePicker */}
                {showDatePicker && (
                  <View
                    style={
                      Platform.OS === "ios"
                        ? styles.iosPickerContainer
                        : undefined
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
                        onPress={() => setShowDatePicker(false)}
                        style={[
                          styles.doneBtn,
                          { backgroundColor: theme.primary },
                        ]}
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

                {/* 3. Height & 4. Weight Selectors */}
                <View style={styles.row}>
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
                    <Text style={[typography.body, { color: theme.text }]}>
                      {height} cm
                    </Text>
                  </TouchableOpacity>

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
                    <Text style={[typography.body, { color: theme.text }]}>
                      {weight} kg
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Height Picker Modal */}
                <ValuePickerModal
                  visible={showHeightPicker}
                  title={t("auth.height")}
                  unit="cm"
                  items={HEIGHT_OPTIONS}
                  selectedValue={height}
                  onSelect={(val) => setHeight(val)}
                  onClose={() => setShowHeightPicker(false)}
                />

                {/* Weight Picker Modal */}
                <ValuePickerModal
                  visible={showWeightPicker}
                  title={t("auth.weight")}
                  unit="kg"
                  items={WEIGHT_OPTIONS}
                  selectedValue={weight}
                  onSelect={(val) => setWeight(val)}
                  onClose={() => setShowWeightPicker(false)}
                />

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={[typography.bodyBold, { color: "#FFFFFF" }]}>
                      {t("profile.saveChanges")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text
                    style={[typography.caption, { color: theme.textSecondary }]}
                  >
                    {t("auth.firstName")} & {t("auth.lastName")}
                  </Text>
                  <Text style={[typography.bodyBold, { color: theme.text }]}>
                    {profile ? `${profile.firstName} ${profile.lastName}` : "—"}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text
                    style={[typography.caption, { color: theme.textSecondary }]}
                  >
                    {t("auth.birthDate")}
                  </Text>
                  <Text style={[typography.bodyBold, { color: theme.text }]}>
                    {profile?.birthDate
                      ? new Date(profile.birthDate).toLocaleDateString(
                          i18n.language === "pl" ? "pl-PL" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )
                      : "—"}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text
                    style={[typography.caption, { color: theme.textSecondary }]}
                  >
                    {t("auth.height")}
                  </Text>
                  <Text style={[typography.bodyBold, { color: theme.text }]}>
                    {profile?.heightCm ? `${profile.heightCm} cm` : "—"}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text
                    style={[typography.caption, { color: theme.textSecondary }]}
                  >
                    {t("auth.weight")}
                  </Text>
                  <Text style={[typography.bodyBold, { color: theme.text }]}>
                    {profile?.weightKg ? `${profile.weightKg} kg` : "—"}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Preferences Section */}
      <Text
        style={[
          typography.caption,
          { color: theme.textSecondary, marginBottom: 8, marginLeft: 4 },
        ]}
      >
        {t("profile.preferencesSection").toUpperCase()}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {/* Theme Selector */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabelGroup}>
            <Ionicons
              name={
                mode === "dark"
                  ? "moon"
                  : mode === "light"
                    ? "sunny"
                    : "contrast"
              }
              size={20}
              color={theme.primary}
            />
            <Text
              style={[typography.body, { color: theme.text, marginLeft: 12 }]}
            >
              {t("profile.theme")}
            </Text>
          </View>

          <View
            style={[
              styles.segmentedControl,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            {(["system", "dark", "light"] as const).map((themeOption) => {
              const active = mode === themeOption;
              return (
                <TouchableOpacity
                  key={themeOption}
                  style={[
                    styles.segmentButton,
                    active && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setMode(themeOption)}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      { color: active ? "#FFFFFF" : theme.textSecondary },
                    ]}
                  >
                    {t(`profile.themeOptions.${themeOption}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Language Selector */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabelGroup}>
            <Ionicons name="globe-outline" size={20} color={theme.primary} />
            <Text
              style={[typography.body, { color: theme.text, marginLeft: 12 }]}
            >
              {t("profile.language")}
            </Text>
          </View>

          <View
            style={[
              styles.segmentedControl,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            {(["en", "pl"] as const).map((lang) => {
              const active = i18n.language.startsWith(lang);
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.segmentButton,
                    active && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => handleLanguageChange(lang)}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      { color: active ? "#FFFFFF" : theme.textSecondary },
                    ]}
                  >
                    {lang.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            backgroundColor: theme.surface,
            borderColor: theme.danger + "40",
          },
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.danger} />
        <Text
          style={[typography.bodyBold, { color: theme.danger, marginLeft: 8 }]}
        >
          {t("profile.signOut")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Component Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  accountDetails: {
    marginLeft: 14,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
  },
  statBox: {
    width: "50%",
  },
  editFieldsContainer: {
    marginTop: 4,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  pickerButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
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
  saveBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  settingLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 3,
  },
  segmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
});
