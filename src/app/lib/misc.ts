import { Address, AddressType, Contact, ErrorType, ShortContact, StringType, ViolationError } from "./types";

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

export function validateContact({ name, phoneLabel, phoneValue }: ShortContact): void {
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
  if (!/^\+[0-9]{10,15}$/.test(phoneValue)) violations.phoneValue.push("phone number is not valid");
  
  for (let key in violations)
    if (violations[key].length > 0)
      throw new ViolationError(JSON.stringify(violations));
}

export function convertNetworkErrorMessage(msg: string): string {
  return msg === "fetch failed" ? "It wasn't possible to communicate with the server!" : msg;
}

export function formatAddress({city, country, street, zipcode, state}: Address): string {
  return `${street}; ${city}, ${state}, ${zipcode}; ${country}`;
}

export function locateCountryFlag(countryName: string): string {
  if (countryName.toLowerCase() === "eua") return "/flag/usa.svg";
  if (countryName.toLowerCase() === "brasil") return "/flag/brazil.svg";
  return `/flag/${countryName.toLowerCase()}.svg`;
}

export function isTheLastElement(index: number, list: string[]): boolean {
  return index !== list.length - 1;
}

export function getFlagEmoji(countryCode: string): string {
  return countryCode.toUpperCase().replace(/./g, char => 
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
}

export function formatPhoneValue(oldValue: string, newValue: string): string {
  return /\D+/.test(newValue) ? oldValue : newValue;
}

export function removeProperty(object: StringType | AddressType, propertyName: string): object {
  const outputObject: StringType | AddressType = {};
  for (const key of toKeys(object))
    if (key !== propertyName) outputObject[key] = object[key];
  return outputObject;
}
}