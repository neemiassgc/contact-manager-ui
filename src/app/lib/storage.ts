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
	const selectedContact: string | null = localStorage.getItem("selectedContact");
	if (selectedContact) return JSON.parse(selectedContact);
	return null;
}

export function setSelectedContact(contact: Contact) {
  localStorage.setItem("selectedContact", JSON.stringify(contact));
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