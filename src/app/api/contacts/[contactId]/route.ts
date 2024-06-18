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

export async function PATCH(request: Request, { params }: { params: { contactId: string }}) {
  return safe(async () => {
    const settings: object = {
      method: "PATCH",
      headers: {
        contentType: "application/json"
      },
      body: request.body
    }
    const fetchRequest = await authorizedFetch(resourceServerUri+params.contactId, settings);
    return new NextResponse(request.body, { status: fetchRequest.status });
  });
}

export async function DELETE(_: Request, { params }: { params: { contactId: string }}) {
  return safe(async () => {
    const settings: object = {
      method: "DELETE"
    }
    const fetchRequest = await authorizedFetch(resourceServerUri+params.contactId, settings);
    return new NextResponse(fetchRequest.body, { status: fetchRequest.status });
  });
}