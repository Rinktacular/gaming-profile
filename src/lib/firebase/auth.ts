'use server'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  EmailAuthProvider, signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

export async function onAuthStateChanged(cb: any) {
  return _onAuthStateChanged(auth, cb);
}

/**
 * Attempt to sign in with Google.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  return await signInWithPopup(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    console.log(token, user);
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email, credential);
    return errorMessage;
  });
}

export async function signInWithEmailAndPass(email: string, password: string) {
  const provider = new EmailAuthProvider();

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email and password', error);
    return error;
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
    return error;
  }
}