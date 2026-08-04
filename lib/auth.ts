import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export async function signInAdmin(email: string, password: string) {
  if (!firebaseAuth) throw new Error("FIREBASE_NOT_CONFIGURED");
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function signOutAdmin() {
  if (!firebaseAuth) return;
  await signOut(firebaseAuth);
}

export function observeAdmin(
  onUser: (user: User | null) => void,
): () => void {
  if (!firebaseAuth) {
    onUser(null);
    return () => undefined;
  }
  return onAuthStateChanged(firebaseAuth, onUser);
}

