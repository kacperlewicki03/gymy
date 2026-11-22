import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme/typography";
import {
  fetchUserRoutines,
  createWorkoutRoutine,
  deleteWorkoutRoutine,
} from "../../services/routineService";
import { WorkoutRoutine, RoutineExercise } from "../../types/routine";
import { Exercise } from "../../types/exercise";
import { ExercisePickerModal } from "../../components/ExercisePickerModal";

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const lang = i18n.language.startsWith("pl") ? "pl" : "en";

  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Routine Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>(
    [],
  );
  const [savingRoutine, setSavingRoutine] = useState(false);

  // Exercise Picker State (for adding exercises to a routine)
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    setLoading(true);
    const data = await fetchUserRoutines();
    setRoutines(data);
    setLoading(false);
  };

  // Start Empty Workout
  const handleStartEmptyWorkout = () => {
    router.push("/workout/active");
  };

  // Start Workout from Routine
  const handleStartRoutine = (routine: WorkoutRoutine) => {
    router.push({
      pathname: "/workout/active",
      params: { routineId: routine.id },
    });
  };

  // Add exercise picked from ExercisePickerModal into the new routine draft
  const handleAddExerciseToDraft = (exercise: Exercise) => {
    setSelectedExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        targetSets: 3,
      },
    ]);
  };

  const handleUpdateTargetSets = (index: number, delta: number) => {
    setSelectedExercises((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, targetSets: Math.max(1, item.targetSets + delta) }
          : item,
      ),
    );
  };

  const handleRemoveDraftExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveRoutine = async () => {
    if (!routineTitle.trim() || selectedExercises.length === 0) return;

    setSavingRoutine(true);
    try {
      const created = await createWorkoutRoutine(
        routineTitle,
        selectedExercises,
      );
      setRoutines((prev) => [created, ...prev]);
      setRoutineTitle("");
      setSelectedExercises([]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create routine:", err);
    } finally {
      setSavingRoutine(false);
    }
  };

  const handleDeleteRoutine = (routineId: string) => {
    Alert.alert(t("workout.myRoutines"), t("workout.deleteRoutineConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: "OK",
        style: "destructive",
        onPress: async () => {
          await deleteWorkoutRoutine(routineId);
          setRoutines((prev) => prev.filter((r) => r.id !== routineId));
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        {/* Quick Start Section */}
        <Text style={[typography.h2, { color: theme.text, marginBottom: 12 }]}>
          {t("workout.quickStart")}
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
          onPress={handleStartEmptyWorkout}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={[typography.bodyBold, styles.primaryButtonText]}>
            {t("workout.startEmpty")}
          </Text>
        </TouchableOpacity>

        {/* Routines Header + Add Routine Button */}
        <View style={styles.routinesHeader}>
          <Text style={[typography.h2, { color: theme.text }]}>
            {t("workout.myRoutines")}
          </Text>

          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.75}
            style={[
              styles.newRoutineBtn,
              {
                backgroundColor: theme.primaryMuted,
                borderColor: theme.primary + "40",
              },
            ]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
            <Text
              style={[
                typography.caption,
                { color: theme.primary, fontWeight: "700" },
              ]}
            >
              {t("workout.newRoutine")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Routines List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : routines.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="clipboard-outline"
              size={40}
              color={theme.textSecondary}
            />
            <Text
              style={[
                typography.bodyBold,
                { color: theme.text, marginTop: 10 },
              ]}
            >
              {t("workout.emptyRoutinesTitle")}
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
              {t("workout.emptyRoutinesDesc")}
            </Text>
          </View>
        ) : (
          routines.map((routine) => (
            <TouchableOpacity
              key={routine.id}
              activeOpacity={0.75}
              onPress={() => handleStartRoutine(routine)}
              style={[
                styles.routineCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.routineCardTop}>
                <Text
                  style={[typography.h3, { color: theme.text, flex: 1 }]}
                  numberOfLines={1}
                >
                  {routine.title}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDeleteRoutine(routine.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Exercises preview */}
              <View style={styles.routineExercisesList}>
                {routine.exercises.map((ex, idx) => (
                  <Text
                    key={idx}
                    style={[
                      typography.caption,
                      { color: theme.textSecondary, fontSize: 13 },
                    ]}
                    numberOfLines={1}
                  >
                    • {ex.exerciseName[lang]} ({ex.targetSets}{" "}
                    {t("workout.targetSets")})
                  </Text>
                ))}
              </View>

              {/* Start Routine Action Bar */}
              <View
                style={[
                  styles.startRoutineBadge,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Ionicons name="play" size={14} color="#FFFFFF" />
                <Text
                  style={[
                    typography.caption,
                    { color: "#FFFFFF", fontWeight: "700" },
                  ]}
                >
                  {t("workout.startRoutine")}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ==================== CREATE ROUTINE MODAL ==================== */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.background,
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* Modal Top Bar */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={{ padding: 4 }}
            >
              <Ionicons name="close" size={26} color={theme.text} />
            </TouchableOpacity>

            <Text style={[typography.h3, { color: theme.text }]}>
              {t("workout.newRoutine")}
            </Text>

            <TouchableOpacity
              onPress={handleSaveRoutine}
              disabled={
                savingRoutine ||
                !routineTitle.trim() ||
                selectedExercises.length === 0
              }
              style={{ padding: 4 }}
            >
              {savingRoutine ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Text
                  style={[
                    typography.bodyBold,
                    {
                      color:
                        routineTitle.trim() && selectedExercises.length > 0
                          ? theme.primary
                          : theme.textSecondary,
                    },
                  ]}
                >
                  {t("common.save")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody}>
            {/* Routine Name Input */}
            <TextInput
              style={[
                styles.titleInput,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={t("workout.routineTitlePlaceholder")}
              placeholderTextColor={theme.textSecondary}
              value={routineTitle}
              onChangeText={setRoutineTitle}
            />

            {/* Selected Exercises List */}
            {selectedExercises.map((item, idx) => (
              <View
                key={`${item.exerciseId}-${idx}`}
                style={[
                  styles.draftCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.draftCardHeader}>
                  <Text
                    style={[
                      typography.bodyBold,
                      { color: theme.text, flex: 1 },
                    ]}
                  >
                    {item.exerciseName[lang]}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleRemoveDraftExercise(idx)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme.danger}
                    />
                  </TouchableOpacity>
                </View>

                {/* Target Sets Stepper */}
                <View style={styles.stepperRow}>
                  <Text
                    style={[typography.caption, { color: theme.textSecondary }]}
                  >
                    {t("workout.targetSets").toUpperCase()}:
                  </Text>

                  <View style={styles.stepperControls}>
                    <TouchableOpacity
                      onPress={() => handleUpdateTargetSets(idx, -1)}
                      style={[
                        styles.stepBtn,
                        { backgroundColor: theme.inputBackground },
                      ]}
                    >
                      <Ionicons name="remove" size={16} color={theme.text} />
                    </TouchableOpacity>

                    <Text
                      style={[
                        typography.bodyBold,
                        {
                          color: theme.text,
                          minWidth: 24,
                          textAlign: "center",
                        },
                      ]}
                    >
                      {item.targetSets}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleUpdateTargetSets(idx, 1)}
                      style={[
                        styles.stepBtn,
                        { backgroundColor: theme.inputBackground },
                      ]}
                    >
                      <Ionicons name="add" size={16} color={theme.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Open Exercise Database Picker */}
            <TouchableOpacity
              style={[
                styles.addExerciseBtn,
                {
                  backgroundColor: theme.primaryMuted,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setShowExercisePicker(true)}
            >
              <Ionicons name="add" size={20} color={theme.primary} />
              <Text style={[typography.bodyBold, { color: theme.primary }]}>
                {t("workout.addExerciseToRoutine")}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Exercise Picker Modal */}
          <ExercisePickerModal
            visible={showExercisePicker}
            onClose={() => setShowExercisePicker(false)}
            onSelectExercise={handleAddExerciseToDraft}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
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
  routinesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 14,
  },
  newRoutineBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyCard: {
    padding: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  routineCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  routineCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: {
    padding: 4,
  },
  routineExercisesList: {
    marginTop: 8,
    marginBottom: 14,
    gap: 3,
  },
  startRoutineBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  titleInput: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  draftCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  draftCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addExerciseBtn: {
    flexDirection: "row",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
});
