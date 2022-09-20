import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { GameStatus } from "../../enums";
export class GameRoom {
  gameName: string;
  players: { host: string | null; challenger: string | null };
  spectators: [];
  gameStatus: GameStatus.IN_LOBBY;
  countdown: 1;
  countdownStartsAt: 1;
  countdownInterval: null;
  playersReady: { host: false; challenger: false };
  score: { host: number; challenger: number; neededToWin: number };
  winner: string | null;
  isRanked: boolean;
  constructor(gameName: string, isRanked: boolean | undefined) {
    this.gameName = gameName;
    this.players = { host: null, challenger: null };
    this.spectators = [];
    this.gameStatus = GameStatus.IN_LOBBY;
    this.countdown = 1;
    this.countdownStartsAt = 1;
    this.countdownInterval = null;
    this.playersReady = { host: false, challenger: false };
    this.score = { host: 0, challenger: 0, neededToWin: BattleRoomGame.initialScoreNeededToWin };
    this.winner = null;
    this.isRanked = isRanked ? isRanked : false;
  }
}
