/* eslint-disable consistent-return */

import { ChatChannel, GameRoom, SanitizedSocketMetadata } from "../../../../common";
const cloneDeep = require("lodash.clonedeep");

export function sanitizeChatChannel(channel: ChatChannel) {
  if (!channel) return;
  const sanitizedChatChannel: { name: string; connectedUsers: { [userKey: string]: {} } } = {
    name: channel.name,
    connectedUsers: {},
  };
  Object.keys(channel.connectedUsers).forEach((username) => {
    const sanitizedUser: { username: string | null; connectedSockets: string[] } = {
      username: null,
      connectedSockets: [],
    };

    Object.keys(channel.connectedUsers[username]).forEach((key) => {
      // @ts-ignore
      if (key !== "connectedSockets") sanitizedUser[key] = channel.connectedUsers[username][key];
    });
    sanitizedChatChannel.connectedUsers[username] = sanitizedUser;
  });
  return sanitizedChatChannel;
}

export function sanitizeGameRoom(gameRoom: GameRoom): GameRoom | void {
  if (!gameRoom) return;
  const gameRoomForClient: GameRoom = cloneDeep(gameRoom);
  gameRoomForClient.countdownInterval = null;
  Object.entries(gameRoomForClient.players).forEach(([role, socketMeta]) => {
    // @ts-ignore
    if (socketMeta) gameRoomForClient.players[role] = new SanitizedSocketMetadata(socketMeta);
  });
  return gameRoomForClient;
}

export function sanitizeAllGameRooms(gameRooms: { [gameName: string]: GameRoom }) {
  const gamesForClient: { [gameName: string]: GameRoom } = {};
  Object.keys(gameRooms).forEach((gameName) => {
    const sanitizedGameRoom = sanitizeGameRoom(gameRooms[gameName]);
    if (sanitizedGameRoom) gamesForClient[gameName] = sanitizedGameRoom;
  });
  return gamesForClient;
}
