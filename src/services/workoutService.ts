import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { WorkoutSession } from "../types/workout";

export interface CompletedSetPayload {
  weight: number;
  reps: number;
}

export interface CompletedExercisePayload {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSetPayload[];
}

export interface SaveWorkoutPayload {
  title: string;
  durationMinutes: number;
  exercises: CompletedExercisePayload[];
  caloriesBurned?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
}

/**
 * Fetches all logged workouts for the current user (newest first).
 */
export async function fetchUserWorkouts(): Promise<WorkoutSession[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const workoutsRef = collection(db, "users", user.uid, "workouts");
    const q = query(workoutsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<WorkoutSession, "id">),
    }));
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    return [];
  }
}

/**
 * Fetches a single workout session by its document ID.
 */
export async function fetchWorkoutById(
  workoutId: string,
): Promise<WorkoutSession | null> {
  const user = auth.currentUser;
  if (!user || !workoutId) return null;

  try {
    const docRef = doc(db, "users", user.uid, "workouts", workoutId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as Omit<WorkoutSession, "id">),
    };
  } catch (error) {
    console.error("Error fetching workout by ID:", error);
    return null;
  }
}

/**
 * Saves a completed workout session to Firestore.
 */
export async function saveCompletedWorkout(
  payload: SaveWorkoutPayload,
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const workoutsRef = collection(db, "users", user.uid, "workouts");
  const now = new Date();

  const formattedExercises = payload.exercises.map((ex) => ({
    exerciseId: ex.exerciseId,
    exerciseName: ex.exerciseName,
    sets: ex.sets.map((s, idx) => ({
      setNumber: idx + 1,
      weightKg: s.weight,
      reps: s.reps,
    })),
  }));

  const docData: Record<string, any> = {
    title: payload.title.trim(),
    durationMinutes: Math.max(1, payload.durationMinutes),
    date: now.toISOString(),
    createdAt: serverTimestamp(),
    exercises: formattedExercises,
  };

  if (payload.caloriesBurned !== undefined) {
    docData.caloriesBurned = payload.caloriesBurned;
  }
  if (payload.avgHeartRate !== undefined) {
    docData.avgHeartRate = payload.avgHeartRate;
  }
  if (payload.maxHeartRate !== undefined) {
    docData.maxHeartRate = payload.maxHeartRate;
  }

  const docRef = await addDoc(workoutsRef, docData);
  return docRef.id;
}

/**
 * Fetches the most recent recorded sets for a list of exercise IDs.
 */
export async function fetchLastExercisePerformances(
  exerciseIds: string[],
): Promise<Record<string, CompletedSetPayload[]>> {
  const user = auth.currentUser;
  const result: Record<string, CompletedSetPayload[]> = {};
  if (!user || exerciseIds.length === 0) return result;

  const targetSet = new Set(exerciseIds);

  try {
    const workoutsRef = collection(db, "users", user.uid, "workouts");
    const q = query(workoutsRef, orderBy("date", "desc"), limit(30));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      if (Object.keys(result).length === targetSet.size) break;

      const data = docSnap.data();
      const exercises = data.exercises || [];

      for (const ex of exercises) {
        if (
          targetSet.has(ex.exerciseId) &&
          !result[ex.exerciseId] &&
          Array.isArray(ex.sets) &&
          ex.sets.length > 0
        ) {
          result[ex.exerciseId] = ex.sets.map((s: any) => ({
            weight: s.weightKg ?? s.weight ?? 0,
            reps: s.reps ?? 0,
          }));
        }
      }
    }
  } catch (error) {
    console.error("Error fetching previous exercise performances:", error);
  }

  return result;
}
