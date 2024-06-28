import { isApplicationJson } from "./misc";
import { Contact, ErrorType, ShortContact, ViolationError } from "./types";

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

function validateContact({ name, phoneLabel, phoneValue }: ShortContact): void {
  const violations: {
    [index: string]: string[],
    name: string[],
    phoneLabel: string[],
    phoneValue: string[]
  } = {
    name: [],
    phoneLabel: [],
    phoneValue: [],
  };

  if (name.length < 3) violations.name.push("name must be at least 3 characters long");
  if (name.length > 54) violations.name.push("name must be a maximum of 54 characters long");
  if (phoneLabel.length < 3) violations.phoneLabel.push("label must be at least 3 characters long");
  if (phoneLabel.length > 10) violations.phoneLabel.push("label must be a maximum of 10 characters long");
  if (phoneLabel.includes(" ")) violations.phoneLabel.push("label must not have blank spaces");
  if (phoneValue.length < 13) violations.phoneValue.push("phone number is too short");
  
  for (let key in violations)
    if (violations[key].length > 0)
      throw new ViolationError(JSON.stringify(violations));
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