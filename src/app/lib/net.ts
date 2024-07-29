import { isApplicationJson, validateContact } from "./misc";
import { Contact, ErrorType, ShortContact } from "./types";

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

export async function createNewContact(contact: ShortContact) {
  validateContact(contact);

  const body: string = JSON.stringify({
    name: contact.name,
    phoneNumbers: {
      [contact.phoneLabel]: contact.phoneValue
    }
  })

  const header = {
    ["Content-Type"]: "application/json"
  }

  return poster(getUrl("/api/contacts"), header, body);
}

async function poster(url: string, headers: HeadersInit, body: string): Promise<null> {
  const response = await fetch(url, { method: "POST", headers, body });

  await checkForError(response);

  return null;
}

export function fetchAllContacts() {
  return getter<Contact[]>(getUrl("/api/contacts"));
}

async function getter<T>(url: string, options?: object): Promise<T> {
  const response = await fetch(url, options);

  await checkForError(response);

  return response.json();
}

export async function deleteContact(contactId: string): Promise<null> {
  const response = await fetch(getUrl("/api/contacts/"+contactId), { method: "DELETE" });

  await checkForError(response);

  return null;
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