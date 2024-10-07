import { getContactById, updateContactInList } from "./misc";
import { Contact } from "./types"

export function saveLocalContacts(contacts: Contact[]) {
	localStorage.setItem("contacts", JSON.stringify(contacts));
}

export function getLocalContacts(): Contact[] | null {
	const contacts: string | null = localStorage.getItem("contacts");
	if (!contacts) return null;
	return JSON.parse(contacts);
}

export function clearLocalContacts(): void {
	localStorage.removeItem("contacts");
}

export function getSelectedContact(): Contact | null {
	const selectedContactId: string | null = localStorage.getItem("selectedContact");
	const localContacts = getLocalContacts();
	if (selectedContactId && localContacts)
		return getContactById(localContacts, selectedContactId);
	return null;
}

export function setSelectedLocalContact(contactId: string): void {
  localStorage.setItem("selectedContact", contactId);
}

export function addUnseenContactName(contactName: string) {
	const unseenContactNames: string[] = getAllUnseenContactNames();
	unseenContactNames.push(contactName);
	setUnseenContactNames(unseenContactNames);
}

export function getAllUnseenContactNames(): string[] {
	if (!localStorage.getItem("unseenContactNames"))
		setUnseenContactNames([]);
	return JSON.parse(localStorage.getItem("unseenContactNames") as string);
}

export function removeUnseenContactName(contactName: string) {
	const unseenContactNames: string[] = getAllUnseenContactNames();
	setUnseenContactNames(removeItemFromArray(unseenContactNames, contactName));
}

export function removeAllUnseenContactNames() {
	localStorage.removeItem("unseenContactNames");
}

function setUnseenContactNames(unseenContactNames: string[]) {
	localStorage.setItem("unseenContactNames", JSON.stringify(unseenContactNames));
}

function removeItemFromArray(array: string[], item: string) {
	return array.filter(value => value !== item);
}

export function updateLocalContact(contact: Contact): void {
	const localContacts = getLocalContacts();
	if (localContacts) {
		const updatedContactList = updateContactInList(localContacts, contact);
		if (updatedContactList) saveLocalContacts(updatedContactList);
	}
}