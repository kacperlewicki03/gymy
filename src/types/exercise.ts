export interface Exercise {
  id: string;
  name: string;
  category: "chest" | "back" | "legs" | "shoulders" | "arms" | "abs" | "other";
  equipment?:
    | "barbell"
    | "dumbbell"
    | "machine"
    | "cable"
    | "bodyweight"
    | "other";
  description: string;
  gifUrl?: string;
  isCustom?: boolean;
  userId?: string;
}
