import { useEffect, useState } from "react";
import { createNewContact, fetchAllContacts } from "./net"
import { Contact, ErrorType, ShortContact } from "./types";
import { getLocalContacts, saveLocalContacts } from "./storage";

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
      .catch(exception => setError(exception))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);
  
  return {data, error, isLoading, reload: load};
}

export function useCreateNewContact(): { isLoading: boolean, error?: Error, addNewContact: (contact: ShortContact) => void} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  return {
    isLoading,
    error,
    addNewContact: contact => {
      setError(undefined);
      setIsLoading(true);
      createNewContact(contact)
      .then(() => alert("success"))
      .catch(setError)
      .finally(() => setIsLoading(false));
    }
  }
}