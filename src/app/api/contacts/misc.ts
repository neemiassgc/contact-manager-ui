import { getAccessToken, AccessTokenError } from "@auth0/nextjs-auth0"

export async function authorizedFetch(url: string, inputHeaders?: object) {
  const token = await getAccessToken();
  const headers = {
    authorization: `Bearer ${token}`,
    accept: "*/*",
    ...inputHeaders
  }
  if (token.accessToken) return fetch(url, { headers });
  throw new Error("Unauthorized");
}