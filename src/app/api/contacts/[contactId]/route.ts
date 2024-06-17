import { getAccessToken, AccessTokenError } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server";

const resourceServerUri = "http://localhost:8080/api/contacts/"

export async function GET(_: Request, { params }: { params: { contactId: string }}) {
  try {
    const fetchRequest = await authorizedFetch(resourceServerUri+params.contactId);
    if (!fetchRequest.ok)
      return new NextResponse(await fetchRequest.text(), { status: fetchRequest.status })
    return NextResponse.json(await fetchRequest.json());
  }
  catch(error) {
    console.error(error)
    if (error instanceof AccessTokenError) {
      return new NextResponse(error.message, { status: 400 });
    }
    else if (error instanceof Error && error.message === "Unauthorized")
      return new NextResponse(error.message, { status: 401 });
    return new NextResponse("Something went wrong with the server", { status: 400 });
  }
}

async function authorizedFetch(url: string, inputHeaders?: object) {
  const token = await getAccessToken();
  const headers = {
    authorization: `Bearer ${token}`,
    accept: "*/*",
    ...inputHeaders
  }
  if (token.accessToken) return fetch(url, { headers });
  throw new Error("Unauthorized");
}