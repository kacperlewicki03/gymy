import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import { fetchWorkoutById } from "../../services/workoutService";
import { WorkoutSession } from "../../types/workout";

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkoutDetails() {
      if (!id) return;
      setLoading(true);
      const data = await fetchWorkoutById(id);
      setWorkout(data);
      setLoading(false);
    }

    loadWorkoutDetails();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!workout) {
    return (
      <View
        style={[
          styles.centerContainer,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top,
          },
        ]}
      >
        <Text style={[typography.body, { color: theme.textSecondary }]}>
          {t("workoutDetails.notFound")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.surface }]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[typography.h3, { color: theme.text }]}>
          {t("workoutDetails.title")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Title & Metadata Card */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[typography.h2, { color: theme.text }]}>
          {workout.title}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: theme.textSecondary, marginTop: 4 },
          ]}
        >
          {workout.date}
        </Text>

        <View
          style={[styles.statsDivider, { backgroundColor: theme.border }]}
        />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={18} color={theme.primary} />
            <Text
              style={[
                typography.bodyBold,
                { color: theme.text, marginLeft: 6 },
              ]}
            >
              {workout.durationMinutes} {t("workoutDetails.minutes")}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="barbell-outline" size={18} color={theme.accent} />
            <Text
              style={[
                typography.bodyBold,
                { color: theme.text, marginLeft: 6 },
              ]}
            >
              {workout.exercises?.length || 0}{" "}
              {t("workoutDetails.exercisesCount")}
            </Text>
          </View>
        </View>
      </View>

      {/* Exercises Breakdown */}
      {workout.exercises?.map((exerciseItem, index) => (
        <View
          key={exerciseItem.exerciseId || index}
          style={[
            styles.exerciseSection,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text
            style={[typography.h3, { color: theme.text, marginBottom: 12 }]}
          >
            {exerciseItem.exerciseName}
          </Text>

          {/* Table Header */}
          <View
            style={[
              styles.tableRow,
              styles.tableHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <Text
              style={[
                typography.badge,
                styles.colIndex,
                { color: theme.textSecondary },
              ]}
            >
              {t("workoutDetails.set")}
            </Text>
            <Text
              style={[
                typography.badge,
                styles.colData,
                { color: theme.textSecondary },
              ]}
            >
              {t("workoutDetails.weight")}
            </Text>
            <Text
              style={[
                typography.badge,
                styles.colData,
                { color: theme.textSecondary },
              ]}
            >
              {t("workoutDetails.reps")}
            </Text>
          </View>

          {/* Sets Rows */}
          {exerciseItem.sets?.map((set, setIndex) => (
            <View
              key={setIndex}
              style={[
                styles.tableRow,
                {
                  borderBottomColor:
                    setIndex === exerciseItem.sets.length - 1
                      ? "transparent"
                      : theme.border,
                },
              ]}
            >
              <View style={styles.colIndex}>
                <View
                  style={[
                    styles.setNumberBadge,
                    { backgroundColor: theme.inputBackground },
                  ]}
                >
                  <Text
                    style={[
                      typography.caption,
                      { color: theme.text, fontWeight: "700" },
                    ]}
                  >
                    {set.setNumber}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  typography.bodyBold,
                  styles.colData,
                  { color: theme.text },
                ]}
              >
                {set.weightKg} kg
              </Text>
              <Text
                style={[
                  typography.bodyBold,
                  styles.colData,
                  { color: theme.text },
                ]}
              >
                {set.reps}
              </Text>
            </View>
          ))}
        </View>
      ))}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 40,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  statsDivider: {
    height: 1,
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseSection: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableHeader: {
    paddingBottom: 8,
  },
  colIndex: {
    width: 50,
  },
  colData: {
    flex: 1,
    textAlign: "center",
  },
  setNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
});
