export interface IBattleRoomScoreCard {
  id: number;
  userId: number;
  createdAt: number | Date;
  updatedAt: number | Date;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface IBattleRoomGameRecord {
  id: number;
  createdAt: number | Date;
  firstPlayerId: number;
  secondPlayerId: number;
  firstPlayerScore: number;
  secondPlayerScore: number;
  firstPlayerPreGameElo: number;
  firstPlayerPostGameElo: number;
  secondPlayerPreGameElo: number;
  secondPlayerPostGameElo: number;
}

export type BattleRoomLadderEntry = { name: string; elo: number; wins: number; losses: number };
