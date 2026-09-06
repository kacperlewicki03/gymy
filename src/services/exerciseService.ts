import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Exercise } from "../types/exercise";

export type { Exercise };

// Service Functions

export async function fetchAllAvailableExercises(): Promise<Exercise[]> {
  try {
    // Fetch public/global exercises
    const globalSnap = await getDocs(collection(db, "exercises"));
    const globalExercises: Exercise[] = globalSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Exercise, "id">),
      isCustom: false,
    }));

    // Fetch authenticated user's custom exercises
    const currentUser = auth.currentUser;
    let customExercises: Exercise[] = [];

    if (currentUser) {
      const userCol = collection(
        db,
        "users",
        currentUser.uid,
        "customExercises",
      );
      const customSnap = await getDocs(userCol);
      customExercises = customSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Exercise, "id">),
        isCustom: true,
      }));
    }

    // Merge and sort alphabetically by name
    return [...globalExercises, ...customExercises].sort((a, b) =>
      a.name.localeCompare(b.name, "en"),
    );
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
}

// New custom exercise creation

export async function createCustomExercise(data: {
  name: string;
  category: Exercise["category"];
  description: string;
}): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User must be authenticated to create a custom exercise.");
  }

  const userCol = collection(db, "users", currentUser.uid, "customExercises");
  const docRef = await addDoc(userCol, {
    ...data,
    userId: currentUser.uid,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export const exerciseService = {
  getAllExercises: fetchAllAvailableExercises,
  fetchAllAvailableExercises,
  createCustomExercise,
};
