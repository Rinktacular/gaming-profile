import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase'
import { User } from 'firebase/auth'
import { Providers } from './providers'
import Script from 'next/script'
import Link from 'next/link'

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
    <html lang="en" className="h-full bg-gray-50 bg-gradient-to-r from-[#541c1f] from-10% via-[#471437] via-30% to-[#03033c] to-90%">
      <head>
        <Script src="https://kit.fontawesome.com/0ac4b28902.js" strategy="beforeInteractive" />
        <Link href="/dist/output.css" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialisased h-full bg-gradient-to-r from-[#541c1f] from-10% via-[#471437] via-30% to-[#03033c] to-90%`}>
        <Providers>
          <Header initialUser={(initialUser?.user as User)?.toJSON()} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
