'use client'
import React, { useState, useEffect, use } from "react";
import {
  onAuthStateChanged,
  signInWithGoogle,
  signOut
} from "@/lib/firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User } from "firebase/auth";

function useUserSession(initialUser: User | null | undefined): User | null | undefined {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser);
  const router = useRouter()
  const pathName = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      setUser(authUser);
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onAuthStateChanged((authUser: any) => {
      if (user === undefined) { router.push('/login'); return; }

      // refresh when user changed to ease testing
      // TODO: Some weird tpying here to satisfy the compiler... might not always be a `User` here.
      else if ((user as User)?.email !== authUser?.email) {
        router.refresh()
      }

      // In this case, we are on the login page and the user is logged in, so we should redirect to the home page.
      else if (pathName === '/login') {
        router.push('/')
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

  return (
    user &&
    <header>
      <Link href="/">Game Profile Home</Link>
      <div>
        <span>{user?.email}</span>
        <a href="#" onClick={handleSignOut}>Sign Out</a>
      </div>
    </header>
  )
}