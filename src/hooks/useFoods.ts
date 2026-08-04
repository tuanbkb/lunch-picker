import { useEffect, useState } from 'react';
import { subscribeToFoods } from '../api/foodsApi';
import type { FoodOption } from '../types';

interface UseFoods {
  foods: FoodOption[];
  loading: boolean;
  error: string | null;
}

export function useFoods(): UseFoods {
  const [foods, setFoods] = useState<FoodOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToFoods(
      (nextFoods) => {
        setFoods(nextFoods);
        setLoading(false);
      },
      () => {
        setError('Không thể tải danh sách món ăn.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { foods, loading, error };
}
