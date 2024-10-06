import { Address, AddressType, Contact, ErrorType, StringType, ViolationError } from "./types";

export function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}

export function sliceContacts(pageSize: number, page: number, contacts: Contact[]): Contact[] {
  const viewStart: number = pageSize * page - pageSize;
  return contacts.slice(viewStart === 0 ? 0 : viewStart, pageSize * page);
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

export function toCamelCase(input: string): string {
  const words: string[] = input.split(" ");
  return words.map((word, index) =>
    index === 0 ?
      word.toLowerCase() :
      word.toLowerCase().replace(/^./, word.charAt(0).toUpperCase())
  ).join("");
}

export function getContactById(contactList: Contact[], contactId: string): Contact | null {
  return contactList.find(c => c.id === contactId) ?? null;
}

export function updateContactInList(contactList: Contact[], contact: Contact): Contact[] | null {
  const contactPosition: number = contactList.findIndex(c => c.id === contact.id);
  if (contactPosition !== -1) return contactList.with(contactPosition, contact);
  return null;
}

export function isEmpty(obj: Object): boolean {
  return toKeys(obj).length === 0;
}

export function isNotTheLastItem(list: any[], index: number): boolean {
  return index !== list.length - 1;
}

export function extractHelperTextFromError(fieldName: string, error: Error | undefined): string | undefined {
  if (error instanceof ViolationError) {
    const violationList = error.toObject().fieldViolations[fieldName]
    return violationList && violationList[0];
  }
}