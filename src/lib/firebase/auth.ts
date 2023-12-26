'use client'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

export function onAuthStateChanged(cb: any) {
  return _onAuthStateChanged(auth, cb);
}

/**
 * Attempt to sign in with Google.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
}

/**
 * Attempt to sign out with Google.
 */
export async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}