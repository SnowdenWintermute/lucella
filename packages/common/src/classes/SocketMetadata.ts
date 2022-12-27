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
  socketId?: string; // optional so it can be omitted when sent to client
  constructor(
    socketId: string,
    associatedUser: {
      username: string;
      isGuest: boolean;
    },
    currentChatChannel?: string,
    currentGameName?: string
  ) {
    this.socketId = socketId;
    this.associatedUser = associatedUser;
    this.currentGameName = currentGameName || null;
    this.currentChatChannel = currentChatChannel || null;
    this.previousChatChannelName = null;
    this.uuid = v4();
  }
}
