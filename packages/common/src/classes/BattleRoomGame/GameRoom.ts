import { BattleRoomGame } from "../BattleRoomGame";
import { SocketMetadata } from "../SocketMetadata";
import { GameStatus } from "../../enums";
import { gameRoomCountdownDuration } from "../../consts/game-lobby-config";

export class GameRoom {
  gameName: string;
  players: {
    host: SocketMetadata | null;
    challenger: SocketMetadata | null;
  } = { host: null, challenger: null };
  spectators: [];
  gameStatus: GameStatus = GameStatus.IN_LOBBY;
  countdown = { duration: gameRoomCountdownDuration, current: gameRoomCountdownDuration };
  countdownInterval: NodeJS.Timeout | null = null;
  playersReady: { host: boolean; challenger: boolean } = { host: false, challenger: false };
  score = { host: 0, challenger: 0, neededToWin: BattleRoomGame.initialScoreNeededToWin };
  winner: string | null = null;
  isRanked: boolean;
  constructor(gameName: string, isRanked: boolean | undefined) {
    this.gameName = gameName;
    this.spectators = [];
    this.isRanked = isRanked ? isRanked : false;
  }
  cancelCountdownInterval() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdown.current = this.countdown.duration;
    this.gameStatus = GameStatus.IN_LOBBY;
  }
}
