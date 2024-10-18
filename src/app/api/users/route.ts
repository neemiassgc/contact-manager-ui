import { NextResponse } from "next/server";
import { authorizedFetch, safe } from "../contacts/misc";

const resourceServerUri: string = process.env.RESOURCE_SERVE+"/api/users"

export async function POST(request: Request) {
  return safe(async () => {
    const settings: object = {
      method: "POST",
      body: await request.text(),
      headers: {
        ["Content-Type"]: "application/json"
      }
    }
    const fetchRequest = await authorizedFetch(resourceServerUri, settings);
    return new NextResponse(fetchRequest.body, { status: fetchRequest.status });
  });
}