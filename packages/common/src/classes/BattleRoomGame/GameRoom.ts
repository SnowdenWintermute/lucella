import { BattleRoomGame } from "../BattleRoomGame";
import { SocketMetadata } from "../SocketMetadata";
import { GameStatus } from "../../enums";
import { gameChannelNamePrefix, baseGameStartCountdownDuration } from "../../consts/game-lobby-config";

export class GameRoom {
  gameName: string;
  players: {
    host: SocketMetadata | null;
    challenger: SocketMetadata | null;
  } = { host: null, challenger: null };
  spectators: [];
  gameStatus: GameStatus = GameStatus.IN_LOBBY;
  countdown = { current: baseGameStartCountdownDuration };
  countdownInterval: NodeJS.Timeout | null = null;
  playersReady: { host: boolean; challenger: boolean } = { host: false, challenger: false };
  score = { host: 0, challenger: 0, neededToWin: BattleRoomGame.initialScoreNeededToWin };
  winner: string | null = null;
  isRanked: boolean;
  chatChannel: string;
  constructor(gameName: string, isRanked: boolean | undefined) {
    this.gameName = gameName;
    this.chatChannel = gameChannelNamePrefix + this.gameName;
    this.spectators = [];
    this.isRanked = isRanked || false;
  }
}
