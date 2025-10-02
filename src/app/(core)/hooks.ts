import { useState, useEffect } from 'react';

export function useGetContacts() {
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url = "/api/contacts";

  const dataRetrieval = (withLoading: boolean = true) =>
    fetchData(url, withLoading, setLoading, setError, setData);

  useEffect(dataRetrieval, [url]);

  return { data, loading, error, reload: dataRetrieval };
}

export function useAIFetch(onComplete: (data: any) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    loading, error,
    fetch: () =>
      fetchData("api/ai", true, setLoading, setError, onComplete)
  };
}

function fetchData(
  url: string,
  withLoading: boolean = true,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setData: (data: any) => void,
) {
  setLoading(withLoading);
  setError(null);
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      setData(result);
    })
    .catch(error => {
      setError(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
}