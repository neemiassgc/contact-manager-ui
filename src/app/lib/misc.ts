import { Contact, ErrorType, ViolationError } from "./types";

export function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}

export function getPaginatedData(size: number, page: number, contacts: Contact[]): Contact[] {
  const viewStart: number = size * page - size;
  return contacts.slice(viewStart === 0 ? 0 : viewStart, size * page);
}

export function filterByName(contacts: Contact[], text: string) {
  if (text === "") return contacts;
  return contacts.filter(contact => contact.name.toLocaleLowerCase().startsWith(text.toLowerCase()));
}

export function isUserNotFound(error: any): boolean {
  return error instanceof ErrorType && error.statusCode === 404 && error.message === "User not found";
}

export function isApplicationJson(contentType: string): boolean {
  return contentType.includes("application/json");
}

export function isNotUndefined(obj?: any): boolean {
  return !!obj;
}

export function isViolationError(error: Error): boolean {
  return error instanceof ViolationError;
}

export function isNotViolationError(error: Error): boolean {
  return !isViolationError(error);
}

export function iterator(size: number): any[] {
  const array: any[] = [];
  for (let i = 0; i < size; i++) array.push(null);
  return array;
}

export function loginIfTokenIsExpired(error: ErrorType) {
  if (error && error.message === "The access token expired and a refresh token is not available. The user will need to sign in again.")
    window.location.assign("/api/auth/login");
}