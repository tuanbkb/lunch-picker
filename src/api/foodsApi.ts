import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { FoodOption } from '../types';

const FOODS_COLLECTION = 'foods';

/**
 * Subscribes to the live list of food options (the lunch menu), ordered by their `order` field.
 * Calls `onUpdate` immediately and again whenever the menu changes in Firestore.
 * Returns an unsubscribe function — call it on cleanup (e.g. in a useEffect return).
 */
export function subscribeToFoods(
  onUpdate: (foods: FoodOption[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const foodsQuery = query(collection(db, FOODS_COLLECTION), orderBy('order'));

  return onSnapshot(
    foodsQuery,
    (snapshot) => {
      const foods: FoodOption[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name as string,
          description: data.description as string,
          category: data.category as string,
          emoji: data.emoji as string,
        };
      });
      onUpdate(foods);
    },
    (error) => {
      console.error('[foodsApi] subscription failed', error);
      onError?.(error);
    },
  );
}
