import { useContext, useEffect, useState } from "react";
import { fetchAllContacts, patcher } from "./net"
import { Contact, ErrorType, Run } from "./types";
import { getLocalContacts, getSelectedContact, saveLocalContacts, setSelectedContact, updateLocalContact } from "./storage";
import { convertNetworkErrorMessage, loginIfTokenIsExpired } from "./misc";
import AlertContext from "./AlertContext";

export function useAllContacts(): { data: Contact[], error?: ErrorType, isLoading: boolean, reload: () => void } {
  const [data, setData] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType | undefined>(undefined);

  const load = () => {
    setError(undefined);
    setIsLoading(true);

    const localContacts: Contact[] | null = getLocalContacts();
    if (localContacts) {
      setData(localContacts)
      setIsLoading(false);
      return;
    }

    fetchAllContacts()
      .then(responseBody => {
        setData(responseBody)
        saveLocalContacts(responseBody)
      })
      .catch(exception => {
        setError(exception);
        loginIfTokenIsExpired(exception);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);
  
  return {data, error, isLoading, reload: load};
}

export function useSelectedContact() {
  const [contact, setContact] = useState<Contact | null>(null);

  const load = (newContact?: Contact) => {
    if (newContact) {
      setContact(newContact);
      updateLocalContact(newContact);
      return;
    }

    setContact(getSelectedContact());
  }

  useEffect(load, []);

  return { contact, reload: load };
}

export function useContactModifier(reload: (newContact: Contact) => void, onClose: Run) {
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = useContext(AlertContext);
  
  const modify: (contactId: string, body: object, successMsg: string) => Run =
  (contactId, body, successMsg) => {
    return () => {
      setIsLoading(true);
      patcher(contactId, body)
      .then(updatedContact => {
        showAlert(successMsg);
        reload(updatedContact);
      })
      .catch(reason => showAlert(convertNetworkErrorMessage(reason.message), "error"))
      .finally(onClose)
    }
  }

  return {isLoading, stopLoading: () => setIsLoading(false), modify};
}