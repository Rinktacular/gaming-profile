const CLIENT_ID = process.env.NEXT_PUBLIC_BNET_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_BNET_SECRET

// TODO: When this window closes, ideally the user would be navigated back to the original page they left, rather than reloading the app in a new window.
export const OUATH_URI = `https://oauth.battle.net/authorize?client_id=2d86ce13f34444569a3ec19c98e86ef4&scope=wow.profile&redirect_uri=http://localhost:3000/profile&response_type=code&state=''`;
const wowProfileHostName = 'https://us.api.blizzard.com/profile/user/wow';

interface BlizzardAuthCodeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  sub: string
}

export interface BlizzardWowProfileSummary {
  collections: { href: string };
  id: number;
  wow_accounts: Account[]
}

interface Account {
  characters: Character[];
  id: number;
}

interface Character {
  character: { href: string };
  faction: { type: string; name: string };
  gender: { type: string; name: string };
  id: number;
  level: number;
  name: string;
  playable_class: { type: string; name: string };
  protected_character: { href: string };
  realm: { key: { href: string }; name: string; id: number };
}


let wowProfileAuthInfo: BlizzardAuthCodeResponse;

/**
 * Once a User has granted us access to their scope, we need to retireve an access token to hit APIs moving forward, now that we have the User's approval code.
 * @param code Auth Code received after a User has given us access to their WoW profile info. Use this code to request a proper Auth key for the `wow.profile` scope.
 */
export async function getAuthorizationCodeForWowProfileScope(code: string): Promise<void> {
  try {
    const response = await fetch('https://oauth.battle.net/token', {
      method: 'POST',
      headers: {
        authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=authorization_code&code=${code}&scope=wow.profile&redirect_uri=http://localhost:3000/profile`
    });
    const data = await response.json();
    if (data.error) { console.error(data.error, data); return; }
    wowProfileAuthInfo = data;
    console.log('we got data', wowProfileAuthInfo);
    return;
  } catch (e) {
    console.error(e);
  }
}

/**
 *
 * @param code Auth Token received after a User has given us access to their WoW profile info
 * @returns
 */
export async function getWowUserProfileSummary(): Promise<BlizzardWowProfileSummary> {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (!wowProfileAuthInfo?.access_token) { console.error('No access token found'); }
  const response = await fetch(wowProfileHostName + `?access_token=${wowProfileAuthInfo.access_token}&namespace=profile-us&:region=us&locale=en_US`, {
    headers: headers
  })
  const data = await response.json();
  return data;
}
