import { isApplicationJson } from "./misc";
import { Contact, CountryCode, ErrorType, ShortContact, ViolationError } from "./types";

export function createNewUser(username: string) {
  return poster(getUrl("/api/users"), { username });
}

export async function createNewContact(contact: ShortContact) {
  const body: object = {
    name: contact.name,
    phoneNumbers: {
      [contact.phoneLabel]: contact.phoneValue
    }
  }

  return poster(getUrl("/api/contacts"), body);
}

async function poster(url: string, body: object) {
  await requester(url, "POST", body);
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

export async function getAddressByCEP(cep: string) {
  return (await requester(`https://viacep.com.br/ws/${cep}/json`, "GET")).json();
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
      response.headers.has("content-type") &&
      isApplicationJson(response.headers.get("content-type") as string)
    ) {
      const responseBody: object = await response.json();
      if ("fieldViolations" in responseBody) {
        throw new ViolationError(JSON.stringify(responseBody));
      }
      throw new ErrorType(JSON.stringify(responseBody), response.status);
    }
    else throw new ErrorType(await response.text(), response.status);
  }
}

function getUrl(path: string): string {
  return window.location.origin + path;
}