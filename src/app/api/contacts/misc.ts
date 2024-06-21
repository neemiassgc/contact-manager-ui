import { getAccessToken, AccessTokenError } from "@auth0/nextjs-auth0"
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

export async function authorizedFetch(url: string, settings?: RequestInit) {
  const token = await getAccessToken();
  const { headers = { } } = settings ?? {}
  if (token.accessToken) {
    const essentialHeaders = {
      ...headers,
      authorization: `Bearer ${token.accessToken}`,
      accept: "*/*"
    }
    return fetch(url, { ...settings, headers: essentialHeaders });
  }
  throw new Error("Unauthorized");
}

export async function safe(run: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await run();
  }
  catch(error) {
    console.error(error)
    if (error instanceof Error && error.message === "Unauthorized")
      return new NextResponse(error.message, { status: 401 });
    if (error instanceof AccessTokenError) {
      return new NextResponse(error.message, { status: 400 });
    }
    if (error instanceof TypeError) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse((error as { message: string}).message, { status: 500 });
  }
}