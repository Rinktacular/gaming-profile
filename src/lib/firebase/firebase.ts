

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  User,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase app instance that should initialize on app startup within the top level layout.tsx file.
 */
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export async function getAuthenticatedAppForUser(session: string | undefined = undefined): Promise<{ app: FirebaseApp | null, user: User | object | null | undefined }> {

  // TODO: Do not force the USer to login if there is a session we can take advantage of and assume they have auth.  This function has issues where it
  // attempts to run client code in that is meant for server and will cause runtimer issues when executed.
  return { app: null, user: null };
  // if (typeof window !== "undefined") {
  //   // client
  //   console.log("client: ", app);

  //   return { app: app, user: auth.currentUser?.toJSON() };
  // }

  // const { initializeApp: initializeAdminApp, getApps: getAdminApps } = await import("firebase-admin/app");

  // const { getAuth: getAdminAuth } = await import("firebase-admin/auth");

  // const { credential } = await import("firebase-admin");

  // const ADMIN_APP_NAME = "firebase-frameworks";
  // const adminApp =
  //   getAdminApps().find((it: any) => it.name === ADMIN_APP_NAME) ||
  //   initializeAdminApp({
  //     credential: credential.applicationDefault(),
  //   }, ADMIN_APP_NAME);

  // const adminAuth = getAdminAuth(adminApp);
  // const noSessionReturn = { app: null, user: null };


  // if (!session) {
  //   // if no session cookie was passed, try to get from next/headers for app router
  //   session = await getAppRouterSession();

  //   if (!session) return noSessionReturn;
  // }

  // const decodedIdToken = await adminAuth.verifySessionCookie(session);

  // const authenticatedApp = initializeAuthenticatedApp(decodedIdToken.uid)
  // const authenticatedAuth = getAuth(authenticatedApp)

  // // handle revoked tokens
  // const isRevoked = !(await adminAuth
  //   .verifySessionCookie(session, true)
  //   .catch((e: any) => console.error(e.message)));
  // if (isRevoked) return noSessionReturn;

  // // authenticate with custom token
  // if (authenticatedAuth.currentUser?.uid !== decodedIdToken.uid) {
  //   // TODO(jamesdaniels) get custom claims
  //   const customToken = await adminAuth
  //     .createCustomToken(decodedIdToken.uid)
  //     .catch((e) => console.error(e.message));

  //   if (!customToken) return noSessionReturn;

  //   await signInWithCustomToken(authenticatedAuth, customToken);
  // }
  // return { app: authenticatedApp, user: authenticatedAuth.currentUser };
}

async function getAppRouterSession() {
  // dynamically import to prevent import errors in pages router
  const { cookies } = await import("next/headers");

  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    // cookies() throws when called from pages router
    return undefined;
  }
}

function initializeAuthenticatedApp(uid: string) {
  const random = Math.random().toString(36).split(".")[1];
  const appName = `authenticated-context:${uid}:${random}`;

  const app = initializeApp(firebaseConfig, appName);

  return app;
}