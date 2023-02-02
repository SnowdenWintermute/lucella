import { v4 } from "uuid";

export class SocketMetadata {
  currentGameName: string | null;
  associatedUser: {
    username: string;
    isGuest: boolean;
  };
  uuid: string;
  currentChatChannel?: string | null;
  previousChatChannelName?: string | null;
  latency = 0;
  ipAddress?: string; // optional so it can be omitted when sent to client
  socketId?: string; // optional so it can be omitted when sent to client
  constructor(
    socketId: string,
    ipAddress: string,
    associatedUser: {
      username: string;
      isGuest: boolean;
    },
    currentChatChannel?: string,
    currentGameName?: string
  ) {
    this.socketId = socketId;
    this.ipAddress = ipAddress;
    this.associatedUser = associatedUser;
    this.currentGameName = currentGameName || null;
    this.currentChatChannel = currentChatChannel || null;
    this.previousChatChannelName = null;
    this.uuid = v4();
  }
}
