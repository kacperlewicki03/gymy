export type ExerciseCategory =
  | "chest"
  | "shoulder"
  | "bicep"
  | "triceps"
  | "leg"
  | "back"
  | "glute"
  | "ab";

export interface LocalizedText {
  en: string;
  pl: string;
}

export interface Exercise {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: ExerciseCategory;
  secondaryCategories?: ExerciseCategory[];
  isCustom: boolean;
  createdBy?: string;
}
