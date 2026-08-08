import type { FoodOption, VoteResult } from '../types';

export type DecideMode = 'topVoted' | 'weighted' | 'allFoods';

export type DecideOutcome =
  | { ok: true; food: FoodOption; candidates: FoodOption[] }
  | { ok: false; reason: string };

function pickUniform<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function pickWeighted(items: { food: FoodOption; weight: number }[]): FoodOption | null {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return null;

  let ticket = Math.random() * totalWeight;
  for (const item of items) {
    ticket -= item.weight;
    if (ticket < 0) return item.food;
  }

  return items[items.length - 1]?.food ?? null;
}

function getVotedEntries(foods: FoodOption[], results: VoteResult[]) {
  const votesByFoodId = new Map(results.map((result) => [result.foodId, result.votes]));
  return foods
    .map((food) => ({ food, votes: votesByFoodId.get(food.id) ?? 0 }))
    .filter((entry) => entry.votes > 0);
}

export function decideFood(
  mode: DecideMode,
  foods: FoodOption[],
  results: VoteResult[],
): DecideOutcome {
  if (foods.length === 0) {
    return { ok: false, reason: 'Chưa có món ăn nào trong danh sách.' };
  }

  if (mode === 'allFoods') {
    const food = pickUniform(foods);
    if (!food) return { ok: false, reason: 'Chưa có món ăn nào trong danh sách.' };
    return { ok: true, food, candidates: foods };
  }

  const votedFoods = getVotedEntries(foods, results);

  if (votedFoods.length === 0) {
    return {
      ok: false,
      reason: 'Chưa có lượt bình chọn nào hôm nay — hãy bình chọn trước khi quyết định.',
    };
  }

  if (mode === 'topVoted') {
    const maxVotes = Math.max(...votedFoods.map((entry) => entry.votes));
    const leaders = votedFoods.filter((entry) => entry.votes === maxVotes).map((entry) => entry.food);
    const food = pickUniform(leaders);
    if (!food) return { ok: false, reason: 'Không tìm thấy món dẫn đầu.' };
    return { ok: true, food, candidates: leaders };
  }

  const candidates = votedFoods.map((entry) => entry.food);
  const food = pickWeighted(votedFoods.map((entry) => ({ food: entry.food, weight: entry.votes })));
  if (!food) return { ok: false, reason: 'Không thể chọn món theo trọng số phiếu.' };
  return { ok: true, food, candidates };
}

/** Builds a highlight path that wanders the candidate pool and ends on `winner`. */
export function buildSpinSequence(
  candidates: FoodOption[],
  winner: FoodOption,
  steps = 18,
): FoodOption[] {
  if (candidates.length === 0) return [winner];
  if (candidates.length === 1) return [winner, winner, winner];

  const sequence: FoodOption[] = [];
  let previousId: string | null = null;

  for (let i = 0; i < steps - 1; i += 1) {
    const pool = candidates.filter((food) => food.id !== previousId);
    const next = pickUniform(pool.length > 0 ? pool : candidates);
    if (!next) break;
    sequence.push(next);
    previousId = next.id;
  }

  if (sequence.length > 0 && sequence[sequence.length - 1]?.id === winner.id) {
    const alternate = candidates.find((food) => food.id !== winner.id);
    if (alternate) sequence[sequence.length - 1] = alternate;
  }

  sequence.push(winner);
  return sequence;
}

export function spinStepDelay(stepIndex: number, totalSteps: number): number {
  const progress = totalSteps <= 1 ? 1 : stepIndex / (totalSteps - 1);
  // Ease-out: start snappy, finish slow so the landing feels intentional.
  return Math.round(55 + progress * progress * 320);
}
