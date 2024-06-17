import { NextResponse } from "next/server";
import { authorizedFetch, safe } from "../misc";

const resourceServerUri = "http://localhost:8080/api/contacts/"

export async function GET(_: Request, { params }: { params: { contactId: string }}) {
  return safe(async () => {
    const fetchRequest = await authorizedFetch(resourceServerUri+params.contactId);
    if (!fetchRequest.ok)
      return new NextResponse(await fetchRequest.text(), { status: fetchRequest.status })
    return NextResponse.json(await fetchRequest.json());
  })
}