import { BattleRoomGame } from "../BattleRoomGame";
import { SocketMetadata } from "../SocketMetadata";
import { GameStatus } from "../../enums";

export class GameRoom {
  gameName: string;
  players: {
    host: SocketMetadata | null;
    challenger: SocketMetadata | null;
  };
  spectators: [];
  gameStatus: GameStatus;
  countdown: { duration: number; current: number };
  countdownInterval: NodeJS.Timeout | null;
  playersReady: { host: boolean; challenger: boolean };
  score: { host: number; challenger: number; neededToWin: number };
  winner: string | null;
  isRanked: boolean;
  constructor(gameName: string, isRanked: boolean | undefined) {
    this.gameName = gameName;
    this.players = { host: null, challenger: null };
    this.spectators = [];
    this.gameStatus = GameStatus.IN_LOBBY;
    this.countdown = { duration: 1, current: 1 };
    this.countdownInterval = null;
    this.playersReady = { host: false, challenger: false };
    this.score = { host: 0, challenger: 0, neededToWin: BattleRoomGame.initialScoreNeededToWin };
    this.winner = null;
    this.isRanked = isRanked ? isRanked : false;
  }
}