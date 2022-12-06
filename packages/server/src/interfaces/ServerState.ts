import { SocketMetadata, ChatChannel, GameRoom, BattleRoomGame } from "../../../common";
import { IBattleRoomRecord } from "../models/BattleRoomRecord";
import { SocketMetadataList } from "../types";

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
  connectedSockets: SocketMetadataList;
  rankedQueue: RankedQueue;
}
