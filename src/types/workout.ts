// Workout Data Models

export interface WorkoutSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  title: string;
  date: string;
  createdAt?: any;
  durationMinutes: number;
  exercises: WorkoutExerciseItem[];
}
