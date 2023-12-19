const CLIENT_ID = process.env.NEXT_PUBLIC_BNET_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_BNET_SECRET

// TODO: When this window closes, ideally the user would be navigated back to the original page they left, rather than reloading the app in a new window.
export const OUATH_URI = `https://oauth.battle.net/authorize?client_id=2d86ce13f34444569a3ec19c98e86ef4&scope=wow.profile&redirect_uri=http://localhost:3000/profile&response_type=code&state=''`;
const wowProfileHostName = 'https://us.api.blizzard.com/profile/user/wow';
const wowCharacterSummaryHostName = 'https://us.api.blizzard.com/profile/user/wow/protected-character/';
// Does not require wow.profile scope, public info
const wowCharacterMediaHostName = 'https://us.api.blizzard.com/profile/wow/character/';

/**
 * Expected response from `getAuthorizationCodeForWowProfileScope`
 */
interface BlizzardAuthCodeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  sub: string
}

/**
 * Expected response from `getWowUserProfileSummary`
 */
export interface BlizzardWowProfileSummary {
  collections: { href: string };
  id: number;
  wow_accounts: Account[]
}

export interface Account {
  characters: Character[];
  id: number;
}

export interface Character {
  character: { href: string };
  faction: { type: string; name: string };
  gender: { type: string; name: string };
  id: number;
  level: number;
  name: string;
  playable_class: { type: string; name: string };
  protected_character: { href: string };
  realm: { key: { href: string }; name: string; id: number; slug: string };
}

/**
 * Expected response from `getWowCharacterMedia`
 */
export interface WowCharacterMediaAssetReponse {
  achievement_points: number;
  achievements: { href: string };
  achievement_statistics: { href: string };
  active_spec: { key: { href: string }; name: string; id: number };
  active_title: { display_string: string, key: { href: string }; name: string; id: number };
  appearance: { href: string };
  average_item_level: number;
  character_class: { key: { href: string }; name: string; id: number };
  collections: { href: string };
  encounters: { href: string };
  equipment: { href: string };
  equipped_item_level: number;
  experience: number;
  faction: { type: string; name: string };
  gender: { type: string; name: string };
  id: number;
  last_login_timestamp: number;
  level: number;
  media: { href: string };
  mythic_keystone_profile: { href: string };
  name: string;
  professions: { href: string };
  pvp_summary: { href: string };
  quests: { href: string };
  race: { key: { href: string }; name: string; id: number };
  realm: { key: { href: string }; name: string; id: number; slug: string };
  reputations: { href: string };
  specializations: { href: string };
  titles: { href: string };
}

// Auth info containing the API key to use once we have gotten wow.profile access
let wowProfileAuthInfo: BlizzardAuthCodeResponse;

/**
 * Once a User has granted us access to their scope, we need to retireve an access token to hit APIs moving forward, now that we have the User's approval code.
 * @param code Auth Code received after a User has given us access to their WoW profile info. Use this code to request a proper Auth key for the `wow.profile` scope.
 */
export async function getAuthorizationCodeForWowProfileScope(code: string): Promise<void> {
  try {
    if (wowProfileAuthInfo?.access_token) { console.error('Already have an access token'); return; }
    if (!code) { console.error('Code not provided', code); return; }
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
    return data;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Using the access token we received from the `getAuthorizationCodeForWowProfileScope` function, we can now hit the WoW Profile API to get the User's profile info.
 *
 * @param code Auth Token received after a User has given us access to their WoW profile info
 * @returns
 */
export async function getWowUserProfileSummary(): Promise<BlizzardWowProfileSummary | void> {
  if (!wowProfileAuthInfo?.access_token) { console.error('No access token'); return; }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const response = await fetch(wowProfileHostName + `?access_token=${wowProfileAuthInfo.access_token}&namespace=profile-us&:region=us&locale=en_US`, {
    headers: headers
  })
  const data = await response.json();
  return data;
}

/**
 * Get a summary of a specific character info such as character/euiptment gold and level gain/loss over time.
 *
 * NOT CURRENT IN USE ATM
 *
 * @param character Character to be queried, requires character.id and character.realm.id
 * @returns In-game location and `protected_stats` which contain gold/items gained/lost over time.
 */
export async function getWowCharacterSummary(character: Character): Promise<any> {
  if (!wowProfileAuthInfo?.access_token) { console.error('No access token'); return; }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const response = await fetch(wowCharacterSummaryHostName + `${character.realm.id}-${character.id}?access_token=${wowProfileAuthInfo.access_token}&namespace=profile-us&:region=us&locale=en_US`, {
    headers: headers
  })
  const data = await response.json();
  return data;
}

/**
 * Get a media request for a given character, such as their avatar and in-game avatar render. Generally, the model returned contains a bunch of `href` links to other API endpoints to request more info.
 *
 * @param character Character to be queried, requires character.name and character.realm.name
 * @returns CharacterMeiaResponse
 */
export async function getWowCharacterMedia(character: Character): Promise<WowCharacterMediaAssetReponse | void> {
  if (!wowProfileAuthInfo?.access_token) { console.error('No access token'); return; }
  console.log(character);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const response = await fetch(wowCharacterMediaHostName + `${character.realm.slug}/${character.name.toLocaleLowerCase()}?access_token=${wowProfileAuthInfo.access_token}&namespace=profile-us&:region=us&locale=en_US`, {
    headers: headers
  })
  const data = await response.json();
  return data;
}
