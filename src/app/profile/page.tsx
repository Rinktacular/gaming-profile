'use client'

import { BlizzardWowProfileSummary, OUATH_URI, getAuthorizationCodeForWowProfileScope, getWowUserProfileSummary } from "@/app/lib/actions";
import { useCallback, useEffect, useState } from "react";
import WowProfile from "../ui/wow-profile";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [data, setData] = useState<BlizzardWowProfileSummary | null>(null);

  const params = useSearchParams();
  let code = params.get('code') || '';

  const fetchData = useCallback(async () => {
    // If a User have yet to authorize the app to battle.net, we will not have a code.
    if (!code) return;
    await getAuthorizationCodeForWowProfileScope(code).then((authCode) => {
      console.log(authCode);
      getWowUserProfileSummary().then((response) => {
        // Check to ensure response is not `null` before setting the data.
        if (response?.wow_accounts.length) {
          console.log('response', response);
          setData(response);
        }
      });
    });
  }, [code]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <p>Welcome to profile page <a href="/">Back to dashboard</a></p>
      <button><a target="_blank" href={OUATH_URI}>I want to allow game profile to see my wow characters</a></button>
      <hr />
      <div className="flex justify-evenly w-full flex-wrap">
        {
          data?.wow_accounts[0]?.characters.length && data.wow_accounts[0].characters.map((character, i) => <WowProfile key={i} character={character} />)
        }
      </div>
    </>
  )
}