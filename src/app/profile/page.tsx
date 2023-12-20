'use client'

import { BlizzardWowProfileSummary, Character, OUATH_URI, getAuthorizationCodeForWowProfileScope, getWowCharacterMedia, getWowUserProfileSummary } from "@/lib/actions";
import { useCallback, useEffect, useState } from "react";
import WowProfile from "../ui/wow-profile";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

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
      {!data?.wow_accounts[0]?.characters.length && <button><a target="_blank" href={OUATH_URI}>I want to allow game profile to see my wow characters</a></button>}
      <hr />
      <div className="flex justify-center w-full flex-wrap">
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {
            data?.wow_accounts[0]?.characters.length && data.wow_accounts[0].characters.map((character, i) =>
              <li key={i} className={`col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow hover:cursor-pointer ${character.faction.type === 'HORDE' ? 'bg-red-300 hover:bg-red-400' : 'bg-sky-300 hover:bg-sky-400'}`}>
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">{character.name}</h3>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {character.playable_class.name}
                      </span>
                    </div>
                    <p className={`mt-1 truncate text-sm ${character.faction.type === 'HORDE' ? 'text-[#991b1b]' : 'text-[#075985]'}`}>{character.realm.name}</p>
                  </div>
                  <Image className="flex-shrink-0 rounded-full bg-gray-300" src={character.character.href} alt="" width={10} height={10} />
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <a
                        href={`mailto:${character.id}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                      >
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        Email
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <a
                        href={`tel:${character.id}`}
                        className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                      >
                        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            )
          }
        </ul>
      </div>
    </>
  )

}