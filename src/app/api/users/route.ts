import { NextResponse } from "next/server";
import { authorizedFetch, safe } from "../contacts/misc";

const resourceServerUri: string = "/api/users"

export async function POST(request: Request) {
  return safe(async () => {
    const settings: object = {
      method: "POST",
      body: request.body,
      headers: {
        contentType: "application/json"
      }
    }
    const fetchRequest = await authorizedFetch(resourceServerUri, settings);
    return new NextResponse(fetchRequest.body, { status: fetchRequest.status });
  });
}