/** Returns a stable YYYY-MM-DD key for the voter's local date, used to scope votes to "today". */
export function getTodayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayLabel(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

/**
 * Returns local midnight of the day right after `date` — used as a Firestore TTL marker so
 * a vote automatically becomes eligible for deletion once its day is over. Firestore's TTL
 * background job deletes expired documents within ~24h of this timestamp passing, so votes
 * are cleaned up shortly after "today" ends, not kept around indefinitely.
 */
export function getVoteExpireAt(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}
