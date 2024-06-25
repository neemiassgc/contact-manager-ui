import { Contact, ErrorType } from "./types";

function getOrigin(): string {
  return window.location.origin;
}

async function requester(url: string, options?: object): Promise<Contact[] | string> {
  console.log(url)
  const request = await fetch(url, options);

  if (!request.ok) {
    throw new ErrorType(await request.text(), request.status);
  }

  return await request.json();
}