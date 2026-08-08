export interface FoodOption {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
}

export interface VoteSubmission {
  foodId: string;
  voterName: string;
}

export interface VoteResult {
  foodId: string;
  votes: number;
  voterNames: string[];
}
