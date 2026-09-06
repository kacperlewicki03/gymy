import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllAvailableExercises } from "../../services/exerciseService";
import { Exercise } from "../../types/exercise";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";

export default function WorkoutScreen() {
  const { theme } = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Data fetching lifecycle
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllAvailableExercises();
        setExercises(data);
      } catch (err) {
        console.error("Failed to load workout exercises:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Quick Start Section */}
      <Text style={[typography.h2, { color: theme.text, marginBottom: 12 }]}>
        Quick Start
      </Text>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
        <Text style={[typography.bodyBold, styles.primaryButtonText]}>
          Start Empty Workout
        </Text>
      </TouchableOpacity>

      {/* Available Exercises Section */}
      <Text
        style={[
          typography.h3,
          { color: theme.text, marginTop: 28, marginBottom: 12 },
        ]}
      >
        Available Exercises
      </Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        exercises.map((ex, index) => (
          <View
            key={ex.id || index}
            style={[
              styles.exerciseCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[typography.bodyBold, { color: theme.text }]}>
                {ex.name}
              </Text>
              {ex.isCustom && (
                <View
                  style={[
                    styles.customBadge,
                    { backgroundColor: theme.accent + "20" },
                  ]}
                >
                  <Text style={[typography.badge, { color: theme.accent }]}>
                    CUSTOM
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                typography.caption,
                {
                  color: theme.textSecondary,
                  marginTop: 4,
                  textTransform: "capitalize",
                },
              ]}
            >
              {ex.category}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  primaryButton: {
    flexDirection: "row",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  loaderContainer: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
