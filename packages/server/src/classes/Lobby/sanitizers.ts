/* eslint-disable no-param-reassign */
import { ChatChannel, GameRoom } from "../../../../common";
const cloneDeep = require("lodash.clonedeep");

export function sanitizeChatChannel(channel: ChatChannel) {
  if (!channel) return console.log("tried to sanitize a channel but no channel was given or channel no longer exists");
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
  if (!gameRoom) return console.log("tried to sanitize a game room but no game room was provided");
  const gameRoomForClient: GameRoom = cloneDeep(gameRoom);
  gameRoomForClient.countdownInterval = null;
  Object.values(gameRoomForClient.players).forEach((player) => {
    if (player) {
      delete player.socketId;
      delete player.currentChatChannel;
      delete player.previousChatChannelName;
    }
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
