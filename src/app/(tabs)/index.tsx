import React, { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { fetchUserWorkouts } from "../../services/workoutService";
import { WorkoutSession } from "../../types/workout";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const data = await fetchUserWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload workouts every time the screen gains focus (e.g., after finishing a workout)
  useFocusEffect(
    useCallback(() => {
      loadData(workouts.length === 0);
    }, [loadData, workouts.length]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  // Search filter
  const filteredWorkouts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return workouts;

    return workouts.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesExercise = item.exercises?.some((ex) =>
        ex.exerciseName.toLowerCase().includes(query),
      );
      return matchesTitle || matchesExercise;
    });
  }, [workouts, searchQuery]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const parsed = new Date(isoString);
    if (isNaN(parsed.getTime())) return isoString;

    return parsed.toLocaleDateString(
      i18n.language.startsWith("pl") ? "pl-PL" : "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  };

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
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
                  {formatDate(item.date)}
                </Text>
              </View>

              {/* Metrics Row: Duration, Calories, Heart Rate */}
              <View style={styles.metricsRow}>
                <Text
                  style={[
                    typography.caption,
                    { color: theme.primary, fontWeight: "600" },
                  ]}
                >
                  {item.durationMinutes} {t("home.minutes")}
                </Text>

                {item.caloriesBurned !== undefined && (
                  <View style={styles.metricBadge}>
                    <Ionicons name="flame-outline" size={14} color="#F59E0B" />
                    <Text
                      style={[
                        typography.caption,
                        { color: theme.textSecondary, fontWeight: "600" },
                      ]}
                    >
                      {item.caloriesBurned} {t("workoutDetails.kcal")}
                    </Text>
                  </View>
                )}

                {item.avgHeartRate !== undefined && (
                  <View style={styles.metricBadge}>
                    <Ionicons
                      name="heart-outline"
                      size={14}
                      color={theme.danger}
                    />
                    <Text
                      style={[
                        typography.caption,
                        { color: theme.textSecondary, fontWeight: "600" },
                      ]}
                    >
                      {item.avgHeartRate} {t("workoutDetails.bpm")}
                    </Text>
                  </View>
                )}
              </View>

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
    gap: 8,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  metricBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
