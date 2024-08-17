import { isApplicationJson, validateContact } from "./misc";
import { Contact, CountryCode, ErrorType, ShortContact } from "./types";

export function createNewUser(username: string) {
  return poster(getUrl("/api/users"), { username });
}

export async function createNewContact(contact: ShortContact) {
  validateContact(contact);

  const body: object = {
    name: contact.name,
    phoneNumbers: {
      [contact.phoneLabel]: contact.phoneValue
    }
  }

  return poster(getUrl("/api/contacts"), body);
}

async function poster(url: string, body: object): Promise<void> {
  requester(url, "POST", body);
}

export function fetchAllContacts() {
  return getter<Contact[]>(getUrl("/api/contacts"));
}

export function getCountryCodes() {
  return getter<CountryCode[]>("/country-codes.json");
}

async function getter<T>(url: string): Promise<T> {
  return (await requester(url, "GET")).json();
}

export async function deleteContact(contactId: string): Promise<void> {
  await requester(getUrl("/api/contacts/"+contactId), "DELETE");
}

export async function patcher(contactId: string, body: object): Promise<Contact> {
  return await (await requester(getUrl("/api/contacts/"+contactId), "PATCH", body)).json();
}

async function requester(url: string, method: "POST" | "PATCH" | "DELETE" | "GET", body?: object): Promise<Response> {
  const options: RequestInit = { method }

  if (["PATCH", "POST"].includes(method)) {
    options.headers = { ["Content-Type"]: "application/json" };
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);

  await checkForError(response);

  return response;
}

async function checkForError(response: Response): Promise<void> {
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

function getUrl(path: string): string {
  return window.location.origin + path;
}