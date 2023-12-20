import { Button } from "@nextui-org/react"

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Gaming Profile Woo</p>
      <Button color="primary"><a href="/profile">Go to profile</a></Button>
    </main>
  )
}
