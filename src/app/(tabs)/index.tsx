import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { fetchUserWorkouts } from "../../services/workoutService";
import { WorkoutSession } from "../../types/workout";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load user workouts on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchUserWorkouts();
      setWorkouts(data);
      setLoading(false);
    }

    loadData();
  }, []);

  // Search filter
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((item) => {
      const matchesTitle = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesExercise = item.exercises?.some((ex) =>
        ex.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return matchesTitle || matchesExercise;
    });
  }, [workouts, searchQuery]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + 12,
        },
      ]}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={[typography.h1, { color: theme.text }]}>
          {t("home.title")}
        </Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder={t("home.searchPlaceholder")}
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Main Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="barbell-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text
                style={[
                  typography.bodyBold,
                  { color: theme.text, marginTop: 12 },
                ]}
              >
                {t("home.emptyTitle")}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {
                    color: theme.textSecondary,
                    textAlign: "center",
                    marginTop: 4,
                  },
                ]}
              >
                {t("home.emptyDescription")}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/workout/${item.id}`)}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[typography.h3, { color: theme.text, flex: 1 }]}>
                  {item.title}
                </Text>
                <Text
                  style={[typography.caption, { color: theme.textSecondary }]}
                >
                  {item.date}
                </Text>
              </View>

              <Text
                style={[
                  typography.caption,
                  { color: theme.primary, marginTop: 2, fontWeight: "600" },
                ]}
              >
                {item.durationMinutes} {t("home.minutes")}
              </Text>

              {/* Exercise Summary Preview */}
              <View style={styles.exercisesList}>
                {item.exercises?.map((ex, idx) => (
                  <Text
                    key={idx}
                    style={[
                      typography.body,
                      { color: theme.textSecondary, fontSize: 13 },
                    ]}
                    numberOfLines={1}
                  >
                    • {ex.exerciseName} ({ex.sets?.length || 0} {t("home.sets")}
                    )
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    fontSize: 15,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exercisesList: {
    marginTop: 10,
    gap: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
});
