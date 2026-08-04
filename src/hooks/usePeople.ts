import { useEffect, useState } from 'react';
import { subscribeToPeople } from '../api/peopleApi';

interface UsePeople {
  people: string[];
  loading: boolean;
  error: string | null;
}

export function usePeople(): UsePeople {
  const [people, setPeople] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPeople(
      (nextPeople) => {
        setPeople(nextPeople);
        setLoading(false);
      },
      () => {
        setError('Không thể tải danh sách tên.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { people, loading, error };
}
