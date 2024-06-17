import { getAccessToken } from "@auth0/nextjs-auth0"

export async function authorizedFetch(url: string, inputHeaders?: object) {
  const token = await getAccessToken();
  if (token.accessToken) {
    const headers = {
      authorization: `Bearer ${token.accessToken}`,
      accept: "*/*",
      ...inputHeaders
    }
    return fetch(url, { headers });
  }
  throw new Error("Unauthorized");
}