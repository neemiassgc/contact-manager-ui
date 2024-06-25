import { Contact } from "./types"


export function saveLocalContacts(contacts: Contact[]) {
	localStorage.setItem("contacts", JSON.stringify(contacts));
}

export function getSelectedContact(): Contact | null {
	const selectedContact: string | null = localStorage.getItem("selectedContact");
	if (selectedContact) return JSON.parse(selectedContact);
	return null;
}

export function setSelectedContact(contact: Contact) {
  localStorage.setItem("selectedContact", JSON.stringify(contact));
}