import { useEffect, useState } from 'react';
import { subscribeToTodayResults } from '../api/voteApi';
import type { VoteResult } from '../types';

interface UseVoteResults {
  results: VoteResult[];
  totalVotes: number;
  loading: boolean;
  error: string | null;
}

export function useVoteResults(): UseVoteResults {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTodayResults(
      (nextResults) => {
        setResults(nextResults);
        setLoading(false);
      },
      () => {
        setError('Không thể tải kết quả trực tiếp lúc này.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);

  return { results, totalVotes, loading, error };
}
