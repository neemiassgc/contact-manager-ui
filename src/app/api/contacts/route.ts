import { getAccessToken, AccessTokenError } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server";

const resourceServerUri = "http://localhost:8080/api"

export async function GET({ params }: { params: { contactId: string }}) {
  try {
    const token = await getAccessToken();
    if (token.accessToken) {
      const fetchRequest = await authorizedFetch(resourceServerUri+"/contacts", { token: token.accessToken });
      if (!fetchRequest.ok)
        return new NextResponse(await fetchRequest.text(), { status: fetchRequest.status })
      return await fetchRequest.json();
    }
    return new NextResponse("Unauthorized", { status: 401 });
  }
  catch(error) {
    console.error(error)
    if (error instanceof AccessTokenError) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Something went wrong with the server", { status: 400 });
  }
}

function authorizedFetch(url: string, options: { token: string }): Promise<Response> {
  const { token, ...rest } = options;
  const headers = {
    authorization: `Bearer ${token}`,
    accept: "*/*",
  }
  return fetch(url, { headers, ...rest });
}