import {
  collection,
  doc,
  getDocs,
  writeBatch,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Exercise, ExerciseCategory } from "../types/exercise";
import { DEFAULT_EXERCISES } from "../data/defaultExercises";

const EXERCISES_COLLECTION = "exercises";

/**
 * Seeds default exercises into Firestore if the collection is empty.
 * Uses writeBatch for fast atomic writes.
 */
export async function seedDefaultExercisesIfNeeded(): Promise<void> {
  try {
    const exercisesRef = collection(db, EXERCISES_COLLECTION);
    const defaultQuery = query(exercisesRef, where("isCustom", "==", false));
    const snapshot = await getDocs(defaultQuery);

    // If default exercises already exist in Firestore, skip seeding
    if (!snapshot.empty && snapshot.size >= DEFAULT_EXERCISES.length) {
      return;
    }

    const batch = writeBatch(db);

    DEFAULT_EXERCISES.forEach((exercise) => {
      const docRef = doc(db, EXERCISES_COLLECTION, exercise.id);
      batch.set(
        docRef,
        {
          ...exercise,
          isCustom: false,
        },
        { merge: true },
      );
    });

    await batch.commit();
  } catch (error) {
    console.error("Error seeding default exercises:", error);
  }
}

/**
 * Fetches all default exercises plus custom exercises created by the current user.
 */
export async function fetchAllExercises(): Promise<Exercise[]> {
  try {
    await seedDefaultExercisesIfNeeded();

    const user = auth.currentUser;
    const exercisesRef = collection(db, EXERCISES_COLLECTION);

    // Fetch default exercises
    const defaultQuery = query(exercisesRef, where("isCustom", "==", false));
    const defaultSnap = await getDocs(defaultQuery);

    const exercises: Exercise[] = defaultSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Exercise, "id">),
    }));

    // Fetch user's custom exercises if logged in
    if (user) {
      const customQuery = query(
        exercisesRef,
        where("isCustom", "==", true),
        where("createdBy", "==", user.uid),
      );
      const customSnap = await getDocs(customQuery);

      customSnap.docs.forEach((docSnap) => {
        exercises.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Exercise, "id">),
        });
      });
    }

    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return DEFAULT_EXERCISES.map((ex) => ({ ...ex, isCustom: false }));
  }
}

/**
 * Creates a new custom exercise for the currently logged-in user.
 */
export async function createCustomExercise(data: {
  name: string;
  description: string;
  category: ExerciseCategory;
}): Promise<Exercise> {
  const user = auth.currentUser;
  if (!user)
    throw new Error("User must be logged in to create custom exercises.");

  const exercisesRef = collection(db, EXERCISES_COLLECTION);
  const newExercisePayload = {
    name: {
      en: data.name.trim(),
      pl: data.name.trim(),
    },
    description: {
      en: data.description.trim(),
      pl: data.description.trim(),
    },
    category: data.category,
    isCustom: true,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(exercisesRef, newExercisePayload);

  return {
    id: docRef.id,
    name: newExercisePayload.name,
    description: newExercisePayload.description,
    category: data.category,
    isCustom: true,
    createdBy: user.uid,
  };
}
