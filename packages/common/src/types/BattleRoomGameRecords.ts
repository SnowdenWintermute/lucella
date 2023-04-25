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
  firstPlayerScore: number;
  firstPlayerPreGameElo: number;
  firstPlayerPostGameElo: number;
  firstPlayerPreGameRank: number;
  firstPlayerPostGameRank: number;
  secondPlayerId: number;
  secondPlayerScore: number;
  secondPlayerPreGameElo: number;
  secondPlayerPostGameElo: number;
  secondPlayerPreGameRank: number;
  secondPlayerPostGameRank: number;
}

export type BattleRoomLadderEntry = { name: string; rank?: number; elo: number; wins: number; losses: number };
export type BattleRoomLadderEntryWithUserId = { name: string; rank?: number; elo: number; wins: number; losses: number; userId: number };

export interface IBattleRoomConfigSettings {
  id: number;
  userId: number;
  createdAt: number | Date;
  updatedAt: number | Date;
  acceleration: number;
  topSpeed: number;
  turningSpeedModifier: number;
  hardBrakingSpeed: number;
  speedIncrementRate: number;
  numberOfRoundsRequiredToWin: number;
}
