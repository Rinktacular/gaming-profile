import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase'
import { FirebaseApp } from 'firebase/app'
import { User } from 'firebase/auth'
import { app } from 'firebase-admin'

const inter = Inter({ subsets: ['latin'] })

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Game Profile App',
  description: 'Game Profile App allows you to show off all your achievements across all available platforms.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialUser = await getAuthenticatedAppForUser();

  return (
    <html lang="en">
      <body className={`${inter.className} antialisased`}>
        <Header initialUser={(initialUser?.user as User)?.toJSON()} />
        {children}
      </body>
    </html>
  )
}
