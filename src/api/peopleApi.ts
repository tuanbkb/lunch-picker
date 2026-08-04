import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const PEOPLE_COLLECTION = 'people';

/**
 * Subscribes to the live team roster, ordered by their `order` field.
 * Calls `onUpdate` immediately and again whenever the roster changes in Firestore.
 * Returns an unsubscribe function — call it on cleanup (e.g. in a useEffect return).
 */
export function subscribeToPeople(
  onUpdate: (people: string[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const peopleQuery = query(collection(db, PEOPLE_COLLECTION), orderBy('order'));

  return onSnapshot(
    peopleQuery,
    (snapshot) => {
      const people = snapshot.docs.map((docSnap) => docSnap.data().name as string);
      onUpdate(people);
    },
    (error) => {
      console.error('[peopleApi] subscription failed', error);
      onError?.(error);
    },
  );
}
