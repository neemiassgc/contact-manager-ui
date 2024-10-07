import { NextResponse } from "next/server";
import { authorizedFetch, safe } from "./misc";

const urlPath = process.env.RESOURCE_SERVER+"/api/contacts"

export async function GET() {
  return safe(async () => {
    const fetchRequest = await authorizedFetch(urlPath);
    if (!fetchRequest.ok)
      return new NextResponse(await fetchRequest.text(), { status: fetchRequest.status })
    return NextResponse.json(await fetchRequest.json());
  });
}

export async function POST(request: Request) {
  return safe(async () => {
    const settings: object = {
      method: "POST",
      body: request.body,
      duplex: "half",
      headers: {
        ["Content-Type"]: "application/json"
      }
    }
    const fetchRequest = await authorizedFetch(urlPath, settings);
    return new NextResponse(fetchRequest.body, { status: fetchRequest.status, headers: fetchRequest.headers });
  });
}