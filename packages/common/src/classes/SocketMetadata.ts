import uuid from "uuid";

export class SocketMetadata {
  currentChatChannel: string | null;
  previousChatChannelName: string | null;
  currentGameName: string | null;
  associatedUser: {
    username: string;
    isGuest: boolean;
  };
  uuid: string;
  socketId?: string | null;
  constructor(
    socketId: string,
    associatedUser: {
      username: string;
      isGuest: boolean;
    },
    currentChatChannel?: string,
    currentGameName?: string
  ) {
    this.socketId = socketId || null;
    this.associatedUser = associatedUser;
    this.currentGameName = currentGameName || null;
    this.currentChatChannel = currentChatChannel || null;
    this.previousChatChannelName = null;
    this.uuid = uuid.v4();
  }
}
