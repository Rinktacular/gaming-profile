'use client'

import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithGoogle,
  signOut
} from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/firebase";

function useUserSession(initialUser: User | null | undefined): User | null | undefined {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      setUser(authUser)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onAuthStateChanged((authUser: any) => {
      if (user === undefined) return

      // refresh when user changed to ease testing
      // TODO: Some weird tpying here to satisfy the compiler... might not always be a `User` here.
      if ((user as User)?.email !== authUser?.email) {
        router.refresh()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return user;
}

export default function Header({ initialUser }: { initialUser: any }) {

  const user = useUserSession(initialUser);

  const handleSignOut = (event: any) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event: any) => {
    event.preventDefault();
    console.log('signin in', firebaseConfig);
    signInWithGoogle();
  };

  return (
    <header>
      <Link href="/">Game Profile Home</Link>
      <div>
        <span>{user?.displayName ? (
          <>
            <span>{user?.displayName}</span><a href="#" onClick={handleSignOut}>Sign Out</a><span></span>
          </>
        ) : (
          <a href="#" onClick={handleSignIn}>Sign In with Google</a>
        )}
        </span>
      </div>
    </header>
  )
}