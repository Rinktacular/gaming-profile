'use client'

import { BlizzardWowProfileSummary, Character, OUATH_URI, getAuthorizationCodeForWowProfileScope, getWowCharacterMedia, getWowUserProfileSummary } from "@/lib/actions";
import { useCallback, useEffect, useState } from "react";
import WowProfile from "../ui/wow-profile";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const [data, setData] = useState<BlizzardWowProfileSummary | null>(null);

  const params = useSearchParams();
  let code = params.get('code') || '';
  let imageTag;

  const fetchData = useCallback(async () => {
    // If a User have yet to authorize the app to battle.net, we will not have a code.
    if (!code) return;
    await getAuthorizationCodeForWowProfileScope(code).then((authCode) => {
      getWowUserProfileSummary().then((response) => {
        // Check to ensure response is not `null` before setting the data.
        if (response?.wow_accounts.length) {
          setData(response);
        }
      });
    });
  }, [code]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWowProfileClick = (character: Character) => {
    getWowCharacterMedia(character).then((response: any) => {
      if (response?.appearance?.href) {
        imageTag = <Image src={response.appearance.href + '&:region=us&:locale=en_US'} alt="profile" className="w-12 h-12" />;
      }
    });
  }

  return (
    <>
      <p>Welcome to profile page <a href="/">Back to dashboard</a></p>
      <button><a target="_blank" href={OUATH_URI}>I want to allow game profile to see my wow characters</a></button>
      <hr />
      <div className="flex justify-evenly">
        <div>
          <label>Faction</label>
          <select className="text-sky-500">
            {data?.wow_accounts[0]?.characters.length && data.wow_accounts[0].characters.map((character, i) => <option className="text-amber-500" key={i}>{character.faction.name}</option>)}
          </select>
        </div>
        <div>
          <label>Realm</label>
          <select className="text-sky-500">
            {data?.wow_accounts[0]?.characters.length && data.wow_accounts[0].characters.map((character, i) => <option className="text-amber-500" key={i}>{character.realm.name}</option>)}
          </select>
        </div>
        <div>
          <label>Level</label>
          <select className="text-sky-500">
            {data?.wow_accounts[0]?.characters.length && data.wow_accounts[0].characters.map((character, i) => <option className="text-amber-500" key={i}>{character.level}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-center w-full flex-wrap">
        {
          data?.wow_accounts[0]?.characters.length && data.wow_accounts[0].characters.map((character, i) => <span className="flex justify-center w-5/12" key={i} onClick={() => handleWowProfileClick(character)}><WowProfile character={character} /></span>)
        }
      </div>
    </>
  )

}