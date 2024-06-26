import { isApplicationJson } from "./misc";
import { Contact, ErrorType } from "./types";

function getUrl(path: string): string {
  return window.location.origin + path;
}

export function createNewUser(username: string) {
  const body: string = JSON.stringify({ username });
  const header = {
    ["Content-Type"]: "application/json"
  }
  return poster(getUrl("/api/users"), header, body);
}

async function poster(url: string, headers: HeadersInit, body: string): Promise<null> {
  const response = await fetch(url, { method: "POST", headers, body });

  await checkForError(response);

  return null;
}

export function fetchAllContacts() {
  return getter(getUrl("/api/contacts"));
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