import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { GameRoom } from "@lucella/common/battleRoomGame/classes/BattleRoomGame/GameRoom";
import ChatChannel from "../classes/ChatChannel";
import SocketMetadata from "../classes/SocketMetadata";

export default interface ServerState {
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  games: { [gameName: string]: BattleRoomGame };
  connectedSockets: {
    [socketId: string]: SocketMetadata;
  };
  rankedQueue: {
    users: {
      [socketId: string]: {
        // record: BattleRoomRecord;
        matchmakingInterval: NodeJS.Timer;
        currentEloDiffThreshold: number;
      };
    };
    matchmakingInterval: number | null;
    currentEloDiffThreshold: number;
    rankedGameCurrentNumber: number;
  };
}
