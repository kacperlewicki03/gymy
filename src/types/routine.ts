import { LocalizedText } from "./exercise";

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: LocalizedText;
  targetSets: number;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  exercises: RoutineExercise[];
  createdAt?: any;
}
