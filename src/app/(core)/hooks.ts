import { useState, useEffect } from 'react';

export function useFetch(url: string) {
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchData() {
    setLoading(true);
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

  useEffect(fetchData, [url]);

  return { data, loading, error, reload: fetchData };
};