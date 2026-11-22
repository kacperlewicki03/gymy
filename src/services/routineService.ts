import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { WorkoutRoutine, RoutineExercise } from "../types/routine";

export async function fetchUserRoutines(): Promise<WorkoutRoutine[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const routinesRef = collection(db, "users", user.uid, "routines");
    const q = query(routinesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<WorkoutRoutine, "id">),
    }));
  } catch (error) {
    console.error("Error fetching routines:", error);
    return [];
  }
}

export async function fetchRoutineById(
  routineId: string,
): Promise<WorkoutRoutine | null> {
  const user = auth.currentUser;
  if (!user || !routineId) return null;

  try {
    const docRef = doc(db, "users", user.uid, "routines", routineId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as Omit<WorkoutRoutine, "id">),
    };
  } catch (error) {
    console.error("Error fetching routine by ID:", error);
    return null;
  }
}

export async function createWorkoutRoutine(
  title: string,
  exercises: RoutineExercise[],
): Promise<WorkoutRoutine> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const routinesRef = collection(db, "users", user.uid, "routines");
  const payload = {
    title: title.trim(),
    exercises,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(routinesRef, payload);

  return {
    id: docRef.id,
    title: payload.title,
    exercises: payload.exercises,
  };
}

export async function deleteWorkoutRoutine(routineId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "routines", routineId));
}
