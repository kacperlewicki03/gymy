// User Profile Data Models

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string; // Format: YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  createdAt?: any;
  updatedAt?: any;
}

export type UpdateUserProfilePayload = Partial<
  Omit<UserProfile, "uid" | "email" | "createdAt" | "updatedAt">
>;
