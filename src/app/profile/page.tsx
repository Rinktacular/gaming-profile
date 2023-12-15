'use client'

import { BlizzardWowProfileSummary, OUATH_URI, getAuthorizationCodeForWowProfileScope, getWowUserProfileSummary } from "@/app/lib/actions";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<BlizzardWowProfileSummary | null>(null);

  // const params = useSearchParams();
  let code = 'USKVNIXAP6W8QYLJQUZWFJXTVDMRATHULN';

  const fetchData = useCallback(async () => {
    await getAuthorizationCodeForWowProfileScope(code).then(() => {
      getWowUserProfileSummary().then((response) => {
        console.log(response);
        setData(response);
      });
    });
  }, [code]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // TODO: Request WoW User Profile Info on click event
  return (
    <>
      <p>Welcome to profile page <a href="/">Back to dashboard</a></p>
      <button><a target="_blank" href={OUATH_URI}>I want to allow game profile to see my wow characters</a></button>
      <hr />
      {
        data?.wow_accounts && (data?.wow_accounts[0]?.characters)?.map(character => {
          <p>{character.name}</p>
        })
      }
    </>
  )
}