import { NextResponse } from "next/server";
import { authorizedFetch, safe } from "./misc";

const resourceServerUri = "http://localhost:8080/api"

export async function GET() {
  return safe(async () => {
    const fetchRequest = await authorizedFetch(resourceServerUri+"/contacts");
    if (!fetchRequest.ok)
      return new NextResponse(await fetchRequest.text(), { status: fetchRequest.status })
    return NextResponse.json(await fetchRequest.json());
  });
}