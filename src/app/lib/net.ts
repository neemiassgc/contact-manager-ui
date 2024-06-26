import { isApplicationJson } from "./misc";
import { Contact, ErrorType } from "./types";

function getOrigin(): string {
  return window.location.origin;
}

export function createNewUser(username: string) {
  const body: string = JSON.stringify({ username });
  const settings: object = {
    method: "POST",
    body: body,
    headers: {
      contentType: "application/json"
    }
  }
  return poster(getOrigin()+"/api/users", settings);
}

async function poster(url: string, options?: object): Promise<null> {
  const response = await fetch(url, options);

  await checkForError(response);

  return null;
}

export function fetchAllContacts() {
  return getter(getOrigin()+"/api/contacts");
}

async function getter(url: string, options?: object): Promise<Contact[]> {
  const response = await fetch(url, options);

  await checkForError(response);

  return response.json();
}

async function checkForError(response: Response) {
  if (!response.ok) {
    if (
      response.headers.has("Content-Type") &&
      isApplicationJson(response.headers.get("Content-Type") as string)
    ) {
      throw new ErrorType(await response.json(), response.status);
    }
    else throw new ErrorType(await response.text(), response.status);
  }
}