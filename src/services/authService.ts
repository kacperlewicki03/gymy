import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserProfile, UpdateUserProfilePayload } from "../types/user";

// User Authentication with Email or Username support

export async function loginUser(
  identifier: string,
  password: string,
): Promise<UserCredential> {
  const cleanIdentifier = identifier.trim().toLowerCase();

  // If identifier does not look like an email, resolve username to email via Firestore
  if (!cleanIdentifier.includes("@")) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", cleanIdentifier));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Throw standard Firebase auth code so the error mapper shows "Invalid email or password"
      const error: any = new Error("User not found");
      error.code = "auth/invalid-credential";
      throw error;
    }

    const userData = querySnapshot.docs[0].data() as UserProfile;
    return await signInWithEmailAndPassword(auth, userData.email, password);
  }

  // Standard email login
  return await signInWithEmailAndPassword(auth, cleanIdentifier, password);
}

// Check if email already exists in users collection

export async function isEmailAvailable(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return false;

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", cleanEmail));
  const snap = await getDocs(q);

  return snap.empty;
}

// Check if username is already taken

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) return false;

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", cleanUsername));
  const snap = await getDocs(q);

  return snap.empty;
}

// User Registration with Profile Creation

export async function registerUserWithProfile(data: {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
}): Promise<UserProfile> {
  const cleanEmail = data.email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    data.password,
  );
  const user = credential.user;

  const profileData: UserProfile = {
    uid: user.uid,
    email: cleanEmail,
    username: data.username.trim().toLowerCase(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    birthDate: data.birthDate.trim(),
    heightCm: data.heightCm,
    weightKg: data.weightKg,
  };

  await setDoc(doc(db, "users", user.uid), {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return profileData;
}

// User Profile Operations

export async function fetchUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return docSnap.data() as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  payload: UpdateUserProfilePayload,
): Promise<void> {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

// Session Management

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
