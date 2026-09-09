/**
 * Carries the Google user's name across the Cognito redirect.
 *
 * Google returns given_name/family_name to Cognito, but Cognito only writes
 * attributes its IdP AttributeMapping names, and ours maps only {email,
 * username} — so the idToken never carries a name and getFirstAndLastName()
 * resolves to empty strings. (central_v2 has the same mapping, which is why its
 * GoogleSignup screen asks the user to type their name.)
 *
 * Rather than change Cognito, we read the name straight from Google using the
 * access_token the popup already hands us and throws away. That needs no AWS
 * configuration of any kind, so there is nothing here that a rebuild can drop.
 *
 * The popup runs before awsSignInFederated() navigates the page away, so the
 * result has to survive a full-page redirect: sessionStorage is per-tab and
 * per-origin, and returning to this origin restores it.
 *
 * Every access is guarded — sessionStorage throws outright in Safari private
 * mode and wherever site data is blocked, and a name lookup must never be able
 * to stop someone signing up.
 */

const STASH_KEY = 'microcoach_google_profile';

export interface IGoogleProfileStash {
  givenName: string;
  familyName: string;
  email: string;
}

export function stashGoogleProfile(profile: IGoogleProfileStash): void {
  try {
    sessionStorage.setItem(STASH_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Could not stash the Google profile', error);
  }
}

export function readGoogleProfile(): IGoogleProfileStash | null {
  try {
    const raw = sessionStorage.getItem(STASH_KEY);
    return raw ? (JSON.parse(raw) as IGoogleProfileStash) : null;
  } catch (error) {
    console.error('Could not read the stashed Google profile', error);
    return null;
  }
}

export function clearGoogleProfile(): void {
  try {
    sessionStorage.removeItem(STASH_KEY);
  } catch (error) {
    console.error('Could not clear the stashed Google profile', error);
  }
}

/**
 * Reads the signed-in Google account's profile using the popup's access_token.
 * Resolves to null on any failure: the caller proceeds without a name rather
 * than blocking the redirect.
 */
export async function fetchGoogleProfile(
  accessToken: string,
): Promise<IGoogleProfileStash | null> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) {
      console.error('Google userinfo returned', response.status);
      return null;
    }
    const info = await response.json();
    return {
      givenName: info.given_name ?? '',
      familyName: info.family_name ?? '',
      email: info.email ?? '',
    };
  } catch (error) {
    console.error('Could not read the Google profile', error);
    return null;
  }
}
