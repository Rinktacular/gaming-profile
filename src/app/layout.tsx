import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase'
import { User } from 'firebase/auth'
import { Providers } from './providers'
import Script from 'next/script'
import Head from 'next/head'

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
    <html lang="en" className="dark">
      <head>
        <Script src="https://kit.fontawesome.com/0ac4b28902.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} antialisased`}>
        <Providers>
          <Header initialUser={(initialUser?.user as User)?.toJSON()} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
