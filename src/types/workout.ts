export interface WorkoutSet {
  setNumber: number;
  weightKg: number;
  reps: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  exercises: WorkoutExercise[];
  caloriesBurned?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
}
