/* eslint-disable max-classes-per-file */

export class SocketMetadata {
  currentGameName: string | null;
  associatedUser: {
    username: string;
    isGuest: boolean;
  };
  currentChatChannel: string | null = null;
  previousChatChannelName: string | null = null;
  latency = 0;
  ipAddress: string;
  socketId: string;
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
  }
}

export class SanitizedSocketMetadata {
  currentGameName: string | null;
  associatedUser: {
    username: string;
    isGuest: boolean;
  };
  latency = 0;
  constructor(socketMeta: SocketMetadata) {
    this.currentGameName = socketMeta.currentGameName;
    this.associatedUser = socketMeta.associatedUser;
    this.latency = socketMeta.latency;
  }
}
