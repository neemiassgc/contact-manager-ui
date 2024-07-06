import { useEffect, useState } from "react";
import { fetchAllContacts } from "./net"
import { Contact, ErrorType } from "./types";
import { getLocalContacts, saveLocalContacts } from "./storage";
import { loginIfTokenIsExpired } from "./misc";

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