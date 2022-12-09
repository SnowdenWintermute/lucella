import { SocketMetadata, ChatChannel, GameRoom, BattleRoomGame } from "../../../common";
import { IBattleRoomRecord } from "../models/BattleRoomRecord";
import { SocketMetadataList } from "../types";

export interface RankedQueueUser {
  userId: string;
  record: IBattleRoomRecord;
  socketId: string;
  username: string;
}

// old - delete
export interface RankedQueue {
  users: {
    [socketId: string]: RankedQueueUser;
  };
  matchmakingInterval: NodeJS.Timeout | null;
  currentEloDiffThreshold: number;
  rankedGameCurrentNumber: number;
}
// old - delete
export default interface ServerState {
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  games: { [gameName: string]: BattleRoomGame };
  connectedSockets: SocketMetadataList;
  rankedQueue: RankedQueue;
}
