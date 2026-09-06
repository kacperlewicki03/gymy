import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { WorkoutSession } from "../types/workout";

// Fetch user workouts history

export async function fetchUserWorkouts(): Promise<WorkoutSession[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const workoutsRef = collection(db, "users", currentUser.uid, "workouts");
    const q = query(workoutsRef, orderBy("createdAt", "desc"));
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

// Fetch single workout session by ID

export async function fetchWorkoutById(
  workoutId: string,
): Promise<WorkoutSession | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const workoutDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "workouts",
      workoutId,
    );
    const docSnap = await getDoc(workoutDocRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<WorkoutSession, "id">),
    };
  } catch (error) {
    console.error("Error fetching workout session details:", error);
    return null;
  }
}
