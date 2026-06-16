// src/services/exerciseService.ts
import { db } from "../config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export interface Exercise {
  id?: string;
  name: string;
  category: string;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { name: "Wyciskanie sztangi leżąc", category: "Klatka piersiowa" },
  { name: "Przysiad ze sztangą", category: "Nogi" },
  { name: "Martwy ciąg", category: "Plecy" },
  { name: "Żołnierskie wyciskanie (OHP)", category: "Barki" },
  { name: "Uginanie ramion z hantlami", category: "Biceps" },
];

export const exerciseService = {
  async getAllExercises(): Promise<Exercise[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const exercises: Exercise[] = [];

      querySnapshot.forEach((doc) => {
        exercises.push({ id: doc.id, ...doc.data() } as Exercise);
      });

      if (exercises.length === 0) {
        await this.seedExercises();
        return DEFAULT_EXERCISES;
      }

      return exercises;
    } catch (error) {
      console.error("Błąd podczas pobierania ćwiczeń:", error);
      return DEFAULT_EXERCISES;
    }
  },

  async seedExercises() {
    const exercisesRef = collection(db, "exercises");
    for (const ex of DEFAULT_EXERCISES) {
      await addDoc(exercisesRef, ex);
    }
    console.log("Pomyślnie dodano domyślne ćwiczenia do Firebase!");
  },
};
