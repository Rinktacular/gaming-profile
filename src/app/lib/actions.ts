const CLIENT_ID = process.env.BNET_CLIENT_ID;
const CLIENT_SECRET = process.env.BNET_SECRET
// TODO: When this window closes, ideally the user would be navigated back to the original page they left, rather than reloading the app in a new window.
export const OUATH_URI = `https://oauth.battle.net/authorize?client_id=${CLIENT_ID}&scope=wow.profile&redirect_uri=http://localhost:3000/profile&response_type=code&state=''`;
const wowProfileHostName = 'https://na.api.blizzard.com?region=us&locale=en_US';

interface BlizzardAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  sub: string
}

/** Auth Token once User has granted permission to access their profile info. */
let BlizzardOAuthToken: BlizzardAuthResponse;
/** Auth Code associated with WoW Profile Requests */
let WoWProfileCode: string;

/**
 * Gain an OAuth Token for Accessing Blizz APIs. Store this Token in the service to be used/refreshed as needed.
 * https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow
 */
export async function getAuthTokenForBlizzardUser() {
  // Do not get a new token unless we need to. We probably want to check for the expiration timestamp as well.
  if (BlizzardOAuthToken?.access_token) return;

  const headers = {
    'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  try {
    const response = await fetch('https://oauth.battle.net/token?redirect_uri=http://localhost:3000', {
      headers: headers,
      body: `grant_type=authorization_code&code=${WoWProfileCode}`,
      method: 'POST'
    });
    const data: BlizzardAuthResponse = await response.json();
    if (data) {
      BlizzardOAuthToken = data;
    }
  } catch (e) {
    // TODO: Unless there is a true error, this block will never get hit. Fetch errors will handle themselves in the `try` block.
    console.error(e);
  }
}

/**
 *
 * @param code Auth Token received after a User has given us access to their WoW profile info
 * @returns
 */
export async function getWowUserProfileSummary(): Promise<any> {

  const headers = {
    'Authorization': 'Bearer ' + btoa(`${'USZU4R7DI1HMYVXKODNCHJL3JPJJ4RS8LX'}`),
    'Content-Type': 'application/x-www-form-urlencoded',
    'Battlenet-Namespace': 'profile-us'
  }
  try {
    const response = await fetch(wowProfileHostName, {
      headers: headers
    });
    const data = await response.json();
    if (data) {
      return data;
    }
  } catch (e) { console.error(e); }
}
