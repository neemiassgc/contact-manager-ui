import { AccessTokenError } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server";
import { authorizedFetch } from "./misc";

const resourceServerUri = "http://localhost:8080/api"

export async function GET() {
  try {
    const fetchRequest = await authorizedFetch(resourceServerUri+"/contacts");
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