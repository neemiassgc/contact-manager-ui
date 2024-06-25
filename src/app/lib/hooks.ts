import { useEffect, useState } from "react";
import { fetchAllContacts } from "./net"
import { Contact, ErrorType } from "./types";

export function useAllContacts(): { data: Contact[], error?: ErrorType, isLoading: boolean } {
  const [data, setData] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType | undefined>(undefined);

  useEffect(() => {
    fetchAllContacts()
      .then(requestData => setData(requestData as Contact[]))
      .catch(exception => setError(exception))
      .finally(() => setIsLoading(false));
  }, []);
  
  return {data, error, isLoading};
}