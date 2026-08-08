import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { VoteResult, VoteSubmission } from '../types';
import { getTodayKey, getVoteExpireAt } from '../utils/date';
import { slugify } from '../utils/slug';

const VOTES_COLLECTION = 'votes';

/**
 * Submits (or updates) a lunch vote for today.
 *
 * Each person gets at most one vote document per day, keyed deterministically by
 * `{day}_{slugified voter name}`. Voting again — whether by clicking "change my vote" or by
 * reloading the page and voting again — overwrites that same document instead of creating a
 * duplicate, so the live tally always reflects one vote per person per day.
 *
 * `expireAt` marks the document for automatic deletion by Firestore's TTL policy once today
 * is over (see firestore.rules and the TTL setup instructions) — old votes clean themselves up
 * without any Cloud Function or cron job.
 */
export async function submitVote(submission: VoteSubmission): Promise<void> {
  const day = getTodayKey();
  const voteId = `${day}_${slugify(submission.voterName)}`;

  await setDoc(doc(db, VOTES_COLLECTION, voteId), {
    foodId: submission.foodId,
    voterName: submission.voterName,
    day,
    createdAt: serverTimestamp(),
    expireAt: getVoteExpireAt(),
  });
}

/**
 * Subscribes to live vote tallies for today, aggregated by food.
 * Calls `onUpdate` immediately and again whenever votes change.
 * Returns an unsubscribe function — call it on cleanup (e.g. in a useEffect return).
 */
export function subscribeToTodayResults(
  onUpdate: (results: VoteResult[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const todayVotesQuery = query(
    collection(db, VOTES_COLLECTION),
    where('day', '==', getTodayKey()),
  );

  return onSnapshot(
    todayVotesQuery,
    (snapshot) => {
      const voterNamesByFood = new Map<string, string[]>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        const foodId = data.foodId as string;
        const voterName = data.voterName as string;
        const voterNames = voterNamesByFood.get(foodId) ?? [];
        voterNames.push(voterName);
        voterNamesByFood.set(foodId, voterNames);
      });
      const results: VoteResult[] = Array.from(voterNamesByFood.entries()).map(
        ([foodId, voterNames]) => ({
          foodId,
          votes: voterNames.length,
          voterNames,
        }),
      );
      onUpdate(results);
    },
    (error) => {
      console.error('[voteApi] results subscription failed', error);
      onError?.(error);
    },
  );
}

/**
 * Manual fallback for environments where a Firestore TTL policy isn't set up (e.g. it requires
 * a billing account on the Google Cloud console). Deletes every vote document that isn't from
 * today. Returns the number of documents deleted.
 */
export async function deleteOldVotes(): Promise<number> {
  const oldVotesQuery = query(collection(db, VOTES_COLLECTION), where('day', '!=', getTodayKey()));
  const snapshot = await getDocs(oldVotesQuery);
  await Promise.all(snapshot.docs.map((voteDoc) => deleteDoc(voteDoc.ref)));
  return snapshot.size;
}
