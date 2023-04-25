import { BattleRoomGame } from "../BattleRoomGame";
import { SocketMetadata } from "../SocketMetadata";
import { GameStatus } from "../../enums";
import { gameChannelNamePrefix, baseGameStartCountdownDuration } from "../../consts/game-lobby-config";
import { BattleRoomGameConfigOptionIndices } from "./BattleRoomGameConfigOptionIndices";
import { IBattleRoomConfigSettings } from "../../types/BattleRoomGameRecords";

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
  roundsWon = { host: 0, challenger: 0 };
  isRanked: boolean;
  chatChannel: string;
  battleRoomGameConfigOptionIndices = new BattleRoomGameConfigOptionIndices({});
  static gameScreenActive(gameRoom: GameRoom) {
    return (
      gameRoom.gameStatus === GameStatus.IN_PROGRESS || gameRoom.gameStatus === GameStatus.ENDING || gameRoom.gameStatus === GameStatus.STARTING_NEXT_ROUND
    );
  }
  constructor(gameName: string, isRanked: boolean | undefined, options?: BattleRoomGameConfigOptionIndices | IBattleRoomConfigSettings) {
    this.gameName = gameName;
    this.chatChannel = gameChannelNamePrefix + this.gameName;
    this.spectators = [];
    this.isRanked = isRanked || false;
    if (options) {
      Object.keys(this.battleRoomGameConfigOptionIndices).forEach((key) => {
        // @ts-ignore
        if (typeof options[key] === "number") this.battleRoomGameConfigOptionIndices[key] = options[key];
      });
    }
  }
}
