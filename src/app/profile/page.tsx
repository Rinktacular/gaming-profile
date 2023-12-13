import { getWowUserProfileSummary, OUATH_URI } from "@/app/lib/actions";

export default async function Page() {
  let data;

  // TODO: Request WoW User Profile Info on click event
  return (
    <>
      <p>Welcome to profile page <a href="/">Back to dashboard</a></p>
      <button><a target="_blank" href={OUATH_URI}>I want to allow game profile to see my wow characters</a></button>
      <hr />
      <button>Get my WoW Profile Summary</button>
      {
        data && <code>{data}</code>
      }
    </>
  )
}