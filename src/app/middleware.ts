import { onAuthStateChanged } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(request: NextRequest, event: NextFetchEvent) {

  let user: any;
  const unsubscribe = onAuthStateChanged(async (authUser: any) => {

    event.waitUntil(auth.authStateReady());

    console.log(auth);
    user = auth?.currentUser;
    console.log(auth);
    // TODO: Force user to login page if no auth, but only after the first render
    if (user === undefined) {
      console.log('user is undefined', user);
      return;
    }

    console.log('user is not undefined', user);
    return request;
  });

}