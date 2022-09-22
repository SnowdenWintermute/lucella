const uuid = require("uuid");

export default class SocketMetadata {
  currentChatChannel: string | null;
  previousChatChannelName: string | null;
  currentGameName: string | null;
  associatedUser: {
    username: string;
    isGuest: boolean;
  };
  socketId: string;
  uuid: string;
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
    this.uuid = uuid.v4();
  }
}
