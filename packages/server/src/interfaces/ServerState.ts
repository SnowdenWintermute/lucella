import { BattleRoomGame } from "../common/src/classes/BattleRoomGame";
import { GameRoom } from "../common/src/classes/BattleRoomGame/GameRoom";
import ChatChannel from "../classes/ChatChannel";
import SocketMetadata from "../classes/SocketMetadata";
import { IBattleRoomRecord } from "../models/BattleRoomRecord";

export interface RankedQueueUser {
  userId: string;
  record: IBattleRoomRecord;
  socketId: string;
  username: string;
}

export interface RankedQueue {
  users: {
    [socketId: string]: RankedQueueUser;
  };
  matchmakingInterval: NodeJS.Timeout | null;
  currentEloDiffThreshold: number;
  rankedGameCurrentNumber: number;
}

export default interface ServerState {
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  games: { [gameName: string]: BattleRoomGame };
  connectedSockets: {
    [socketId: string]: SocketMetadata;
  };
  rankedQueue: RankedQueue;
}
