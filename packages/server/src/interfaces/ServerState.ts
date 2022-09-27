import { BattleRoomGame } from "../../../common";
import { GameRoom } from "../../../common";
import { ChatChannel } from "../../../common";
import { SocketMetadata } from "../../../common";
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
