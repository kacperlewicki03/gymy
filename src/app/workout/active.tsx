import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Vibration,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/authContext";
import { typography } from "../../theme/typography";
import { Exercise, LocalizedText } from "../../types/exercise";
import { fetchUserProfile } from "../../services/authService";
import { fetchRoutineById } from "../../services/routineService";
import {
  saveCompletedWorkout,
  fetchLastExercisePerformances,
  CompletedSetPayload,
} from "../../services/workoutService";
import {
  estimateStrengthCalories,
  fetchSessionHealthMetrics,
  fetchLatestHeartRate,
} from "../../services/healthService";
import { ExercisePickerModal } from "../../components/ExercisePickerModal";

interface ActiveSet {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
}

interface ActiveExercise {
  instanceId: string;
  exerciseId: string;
  exerciseName: LocalizedText;
  sets: ActiveSet[];
}

const DEFAULT_REST_SECONDS = 90;

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { routineId } = useLocalSearchParams<{ routineId?: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const lang = i18n.language.startsWith("pl") ? "pl" : "en";

  const [title, setTitle] = useState(t("activeWorkout.defaultTitle"));
  const [exercises, setExercises] = useState<ActiveExercise[]>([]);
  const [previousSetsMap, setPreviousSetsMap] = useState<
    Record<string, CompletedSetPayload[]>
  >({});
  const [loadingRoutine, setLoadingRoutine] = useState(Boolean(routineId));
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Elapsed workout duration in seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest timer state
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);

  // Live Calories & Heart Rate
  const workoutStartTimeRef = useRef<Date>(new Date());
  const [userWeightKg, setUserWeightKg] = useState<number>(75);
  const [liveHeartRate, setLiveHeartRate] = useState<number | null>(null);

  // Poll live heart rate every 10 seconds during the active session
  useEffect(() => {
    let isMounted = true;

    const pollHeartRate = async () => {
      const bpm = await fetchLatestHeartRate();
      if (isMounted) {
        setLiveHeartRate(bpm);
      }
    };

    pollHeartRate();
    const hrInterval = setInterval(pollHeartRate, 10000);

    return () => {
      isMounted = false;
      clearInterval(hrInterval);
    };
  }, []);

  useEffect(() => {
    async function loadUserWeight() {
      if (!user?.uid) return;
      const profile = await fetchUserProfile(user.uid);
      if (profile?.weightKg) {
        setUserWeightKg(profile.weightKg);
      }
    }
    loadUserWeight();
  }, [user?.uid]);

  const liveCalories = estimateStrengthCalories(elapsedSeconds, userWeightKg);

  // Load routine & previous performances if routineId is provided
  useEffect(() => {
    async function initRoutine() {
      if (!routineId) return;
      setLoadingRoutine(true);
      const routine = await fetchRoutineById(routineId);
      if (routine) {
        setTitle(routine.title);
        const mappedExercises: ActiveExercise[] = routine.exercises.map(
          (ex, exIdx) => ({
            instanceId: `${ex.exerciseId}_${Date.now()}_${exIdx}`,
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: Array.from({ length: ex.targetSets || 3 }, (_, setIdx) => ({
              id: `set_${Date.now()}_${exIdx}_${setIdx}`,
              weight: "",
              reps: "",
              completed: false,
            })),
          }),
        );
        setExercises(mappedExercises);

        const ids = routine.exercises.map((e) => e.exerciseId);
        const historyMap = await fetchLastExercisePerformances(ids);
        setPreviousSetsMap(historyMap);
      }
      setLoadingRoutine(false);
    }

    initRoutine();
  }, [routineId]);

  // Session stopwatch
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest countdown timer
  useEffect(() => {
    if (restSecondsLeft === null) return;

    if (restSecondsLeft <= 0) {
      Vibration.vibrate(400);
      setRestSecondsLeft(null);
      return;
    }

    const timer = setTimeout(() => {
      setRestSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [restSecondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return hrs > 0
      ? `${hrs}:${pad(mins)}:${pad(secs)}`
      : `${pad(mins)}:${pad(secs)}`;
  };

  // Add exercise from ExercisePickerModal & fetch previous sets
  const handleAddExercise = async (exercise: Exercise) => {
    const newEntry: ActiveExercise = {
      instanceId: `${exercise.id}_${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [
        {
          id: `set_${Date.now()}_0`,
          weight: "",
          reps: "",
          completed: false,
        },
      ],
    };
    setExercises((prev) => [...prev, newEntry]);

    if (!previousSetsMap[exercise.id]) {
      const history = await fetchLastExercisePerformances([exercise.id]);
      if (history[exercise.id]) {
        setPreviousSetsMap((prev) => ({
          ...prev,
          [exercise.id]: history[exercise.id],
        }));
      }
    }
  };

  const handleRemoveExercise = (instanceId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.instanceId !== instanceId));
  };

  // Add a set (copies previous set's weight/reps for convenience)
  const handleAddSet = (instanceId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: `set_${Date.now()}_${ex.sets.length}`,
              weight: lastSet ? lastSet.weight : "",
              reps: lastSet ? lastSet.reps : "",
              completed: false,
            },
          ],
        };
      }),
    );
  };

  const handleRemoveSet = (instanceId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex;
        if (ex.sets.length <= 1) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((s) => s.id !== setId),
        };
      }),
    );
  };

  const handleUpdateSetField = (
    instanceId: string,
    setId: string,
    field: "weight" | "reps",
    value: string,
  ) => {
    const sanitized = value.replace(",", ".");
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === setId ? { ...s, [field]: sanitized } : s,
          ),
        };
      }),
    );
  };

  const handleApplyPreviousSet = (
    instanceId: string,
    setId: string,
    prevSet?: CompletedSetPayload,
  ) => {
    if (!prevSet) return;
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === setId
              ? {
                  ...s,
                  weight: String(prevSet.weight),
                  reps: String(prevSet.reps),
                }
              : s,
          ),
        };
      }),
    );
  };

  const handleToggleSetCompleted = (
    instanceId: string,
    setId: string,
    prevSet?: CompletedSetPayload,
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const nextState = !s.completed;
            if (nextState) {
              setRestSecondsLeft(DEFAULT_REST_SECONDS);
            }
            const finalWeight =
              nextState && !s.weight && prevSet
                ? String(prevSet.weight)
                : s.weight;
            const finalReps =
              nextState && !s.reps && prevSet ? String(prevSet.reps) : s.reps;

            return {
              ...s,
              weight: finalWeight,
              reps: finalReps,
              completed: nextState,
            };
          }),
        };
      }),
    );
  };

  // Discard workout confirmation
  const handleDiscard = () => {
    Alert.alert(
      t("activeWorkout.discardTitle"),
      t("activeWorkout.discardMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("activeWorkout.discardConfirm"),
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  };

  // Validate and save workout
  const handleFinishPress = () => {
    const completedExercises = exercises
      .map((ex) => {
        const validSets = ex.sets
          .filter((s) => s.completed)
          .map((s) => ({
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps, 10) || 0,
          }));

        return {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName[lang],
          sets: validSets,
        };
      })
      .filter((ex) => ex.sets.length > 0);

    if (completedExercises.length === 0) {
      Alert.alert(
        t("activeWorkout.finishTitle"),
        t("activeWorkout.noCompletedSets"),
      );
      return;
    }

    Alert.alert(
      t("activeWorkout.finishTitle"),
      t("activeWorkout.finishMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.save"),
          onPress: async () => {
            setSaving(true);
            try {
              const endTime = new Date();
              const durationMinutes = Math.max(
                1,
                Math.round(elapsedSeconds / 60),
              );

              const healthMetrics = await fetchSessionHealthMetrics({
                startTime: workoutStartTimeRef.current,
                endTime,
                durationSeconds: elapsedSeconds,
                userWeightKg,
              });

              await saveCompletedWorkout({
                title: title.trim() || t("activeWorkout.defaultTitle"),
                durationMinutes,
                exercises: completedExercises,
                caloriesBurned: healthMetrics.caloriesBurned,
                avgHeartRate: healthMetrics.avgHeartRate,
                maxHeartRate: healthMetrics.maxHeartRate,
              });
              router.replace("/(tabs)");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", t("activeWorkout.saveError"));
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Top Sticky Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleDiscard} style={styles.discardBtn}>
          <Ionicons name="close" size={24} color={theme.danger} />
        </TouchableOpacity>

        {/* Live Session Clock + Calories / HR */}
        <View style={styles.liveMetricsGroup}>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={16} color={theme.primary} />
            <Text
              style={[
                typography.bodyBold,
                { color: theme.text, fontVariant: ["tabular-nums"] },
              ]}
            >
              {formatTime(elapsedSeconds)}
            </Text>
          </View>

          <View style={styles.subMetricsRow}>
            <View style={styles.miniMetric}>
              <Ionicons name="flame-outline" size={13} color={theme.accent} />
              <Text
                style={[typography.caption, { color: theme.textSecondary }]}
              >
                {liveCalories} {t("activeWorkout.kcal")}
              </Text>
            </View>

            <View style={styles.miniMetric}>
              <Ionicons name="heart" size={13} color={theme.danger} />
              <Text
                style={[typography.caption, { color: theme.textSecondary }]}
              >
                {liveHeartRate !== null
                  ? `${liveHeartRate} ${t("activeWorkout.bpm")}`
                  : "--"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleFinishPress}
          disabled={saving}
          style={[styles.finishBtn, { backgroundColor: theme.primary }]}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text
              style={[
                typography.caption,
                { color: "#FFFFFF", fontWeight: "700" },
              ]}
            >
              {t("activeWorkout.finish")}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Rest Timer Banner (visible when counting down) */}
      {restSecondsLeft !== null && (
        <View
          style={[
            styles.restBar,
            {
              backgroundColor: theme.primaryMuted,
              borderBottomColor: theme.primary + "40",
            },
          ]}
        >
          <View style={styles.restInfo}>
            <Ionicons
              name="hourglass-outline"
              size={18}
              color={theme.primary}
            />
            <Text style={[typography.bodyBold, { color: theme.primary }]}>
              {t("activeWorkout.restTimer")}: {formatTime(restSecondsLeft)}
            </Text>
          </View>

          <View style={styles.restControls}>
            <TouchableOpacity
              onPress={() =>
                setRestSecondsLeft((prev) => Math.max(0, (prev ?? 0) - 15))
              }
              style={[styles.restAdjustBtn, { borderColor: theme.primary }]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: theme.primary, fontWeight: "700" },
                ]}
              >
                -15s
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRestSecondsLeft((prev) => (prev ?? 0) + 15)}
              style={[styles.restAdjustBtn, { borderColor: theme.primary }]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: theme.primary, fontWeight: "700" },
                ]}
              >
                +15s
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRestSecondsLeft(null)}
              style={[styles.skipBtn, { backgroundColor: theme.primary }]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: "#FFFFFF", fontWeight: "700" },
                ]}
              >
                {t("activeWorkout.skipRest")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      {loadingRoutine ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 36 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Editable Workout Title */}
          <TextInput
            style={[
              styles.titleInput,
              typography.h2,
              { color: theme.text, borderBottomColor: theme.border },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder={t("activeWorkout.workoutNamePlaceholder")}
            placeholderTextColor={theme.textSecondary}
          />

          {/* Exercises List */}
          {exercises.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Ionicons
                name="barbell-outline"
                size={42}
                color={theme.textSecondary}
              />
              <Text
                style={[
                  typography.bodyBold,
                  { color: theme.text, marginTop: 10 },
                ]}
              >
                {t("activeWorkout.emptyTitle")}
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
                {t("activeWorkout.emptyDesc")}
              </Text>
            </View>
          ) : (
            exercises.map((ex) => {
              const prevSets = previousSetsMap[ex.exerciseId] || [];

              return (
                <View
                  key={ex.instanceId}
                  style={[
                    styles.exerciseCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  {/* Exercise Header */}
                  <View style={styles.exerciseHeader}>
                    <Text
                      style={[typography.h3, { color: theme.primary, flex: 1 }]}
                    >
                      {ex.exerciseName[lang]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(ex.instanceId)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={theme.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Table Columns Header */}
                  <View style={styles.tableHeader}>
                    <Text
                      style={[
                        styles.colSet,
                        typography.caption,
                        { color: theme.textSecondary, textAlign: "center" },
                      ]}
                    >
                      {t("activeWorkout.set")}
                    </Text>
                    <Text
                      style={[
                        styles.colPrev,
                        typography.caption,
                        { color: theme.textSecondary, textAlign: "center" },
                      ]}
                    >
                      {t("activeWorkout.previous")}
                    </Text>
                    <Text
                      style={[
                        styles.colInput,
                        typography.caption,
                        { color: theme.textSecondary, textAlign: "center" },
                      ]}
                    >
                      {t("activeWorkout.kg")}
                    </Text>
                    <Text
                      style={[
                        styles.colInput,
                        typography.caption,
                        { color: theme.textSecondary, textAlign: "center" },
                      ]}
                    >
                      {t("activeWorkout.reps")}
                    </Text>
                    <View style={styles.colCheck} />
                  </View>

                  {/* Set Rows */}
                  {ex.sets.map((setItem, setIdx) => {
                    const prevSet = prevSets[setIdx];

                    return (
                      <View
                        key={setItem.id}
                        style={[
                          styles.setRow,
                          setItem.completed && {
                            backgroundColor: theme.accent + "18",
                            borderRadius: 8,
                          },
                        ]}
                      >
                        {/* Set Number (long press removes set) */}
                        <TouchableOpacity
                          onLongPress={() =>
                            handleRemoveSet(ex.instanceId, setItem.id)
                          }
                          style={styles.colSet}
                        >
                          <Text
                            style={[typography.bodyBold, { color: theme.text }]}
                          >
                            {setIdx + 1}
                          </Text>
                        </TouchableOpacity>

                        {/* Previous Set Column (tap to autofill) */}
                        <TouchableOpacity
                          disabled={!prevSet}
                          onPress={() =>
                            handleApplyPreviousSet(
                              ex.instanceId,
                              setItem.id,
                              prevSet,
                            )
                          }
                          style={styles.colPrev}
                        >
                          <Text
                            style={[
                              typography.caption,
                              {
                                color: prevSet
                                  ? theme.textSecondary
                                  : theme.border,
                                fontWeight: "600",
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {prevSet
                              ? `${prevSet.weight}×${prevSet.reps}`
                              : "—"}
                          </Text>
                        </TouchableOpacity>

                        {/* Weight Input */}
                        <View style={styles.colInput}>
                          <TextInput
                            style={[
                              styles.numInput,
                              {
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.border,
                                color: theme.text,
                              },
                            ]}
                            keyboardType="decimal-pad"
                            placeholder={prevSet ? String(prevSet.weight) : "0"}
                            placeholderTextColor={theme.textSecondary + "90"}
                            value={setItem.weight}
                            onChangeText={(val) =>
                              handleUpdateSetField(
                                ex.instanceId,
                                setItem.id,
                                "weight",
                                val,
                              )
                            }
                          />
                        </View>

                        {/* Reps Input */}
                        <View style={styles.colInput}>
                          <TextInput
                            style={[
                              styles.numInput,
                              {
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.border,
                                color: theme.text,
                              },
                            ]}
                            keyboardType="number-pad"
                            placeholder={prevSet ? String(prevSet.reps) : "0"}
                            placeholderTextColor={theme.textSecondary + "90"}
                            value={setItem.reps}
                            onChangeText={(val) =>
                              handleUpdateSetField(
                                ex.instanceId,
                                setItem.id,
                                "reps",
                                val,
                              )
                            }
                          />
                        </View>

                        {/* Complete Set Checkmark */}
                        <View style={styles.colCheck}>
                          <TouchableOpacity
                            onPress={() =>
                              handleToggleSetCompleted(
                                ex.instanceId,
                                setItem.id,
                                prevSet,
                              )
                            }
                            style={[
                              styles.checkBtn,
                              {
                                backgroundColor: setItem.completed
                                  ? theme.accent
                                  : theme.inputBackground,
                                borderColor: setItem.completed
                                  ? theme.accent
                                  : theme.border,
                              },
                            ]}
                          >
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color={
                                setItem.completed
                                  ? "#FFFFFF"
                                  : theme.textSecondary
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}

                  {/* Add Set Button */}
                  <TouchableOpacity
                    onPress={() => handleAddSet(ex.instanceId)}
                    style={[
                      styles.addSetBtn,
                      { backgroundColor: theme.inputBackground },
                    ]}
                  >
                    <Text
                      style={[
                        typography.caption,
                        { color: theme.text, fontWeight: "700" },
                      ]}
                    >
                      {t("activeWorkout.addSet")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}

          {/* Add Exercise Button */}
          <TouchableOpacity
            style={[
              styles.addExerciseBtn,
              {
                backgroundColor: theme.primaryMuted,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={theme.primary}
            />
            <Text style={[typography.bodyBold, { color: theme.primary }]}>
              {t("activeWorkout.addExercise")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Exercise Database Modal */}
      <ExercisePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelectExercise={handleAddExercise}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  discardBtn: {
    padding: 6,
  },
  liveMetricsGroup: {
    alignItems: "center",
    gap: 2,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  miniMetric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  finishBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  restInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  restControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  restAdjustBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titleInput: {
    paddingVertical: 8,
    marginBottom: 18,
    borderBottomWidth: 1,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  colSet: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  colPrev: {
    width: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  colInput: {
    flex: 1,
    paddingHorizontal: 4,
  },
  colCheck: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  numInput: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  checkBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addSetBtn: {
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  addExerciseBtn: {
    flexDirection: "row",
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
});
