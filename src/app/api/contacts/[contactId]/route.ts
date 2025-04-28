import { NextResponse } from "next/server";
import { authorizedFetch, safe } from "../misc";

const urlPath = process.env.RESOURCE_SERVER+"/api/contacts/"

export async function GET(_: Request, { params }: { params: { contactId: string }}) {
  return safe(async () => {
    const fetchRequest = await authorizedFetch(urlPath+params.contactId);
    if (!fetchRequest.ok)
      return new NextResponse(await fetchRequest.text(), { status: fetchRequest.status })
    return NextResponse.json(await fetchRequest.json());
  })
}

export async function PUT(request: Request, { params }: { params: { contactId: string }}) {
  return safe(async () => {
    const settings: object = {
      method: "PUT",
      headers: {
        ["Content-Type"]: "application/json"
      },
      body: request.body,
      duplex: "half"
    }
    const fetchRequest = await authorizedFetch(urlPath + params.contactId, settings);
    return new NextResponse(fetchRequest.body, { status: fetchRequest.status, headers: fetchRequest.headers });
  });
}

export async function DELETE(_: Request, { params }: { params: { contactId: string }}) {
  return safe(async () => {
    const settings: object = {
      method: "DELETE"
    }
    const fetchRequest = await authorizedFetch(urlPath+params.contactId, settings);
    return new NextResponse(fetchRequest.body, { status: fetchRequest.status });
  });
}