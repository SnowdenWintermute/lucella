export type WidthAndHeight = { width: number; height: number };

export type EloUpdates =
  | {
      hostElo: number;
      challengerElo: number;
      newHostElo: number;
      newChallengerElo: number;
      oldHostRank: number;
      newHostRank: number;
      oldChallengerRank: number;
      newChallengerRank: number;
    }
  | { casualGame: boolean };
