import { ChatChannel, GameRoom } from "../../../../common";
const cloneDeep = require("lodash.clonedeep");

export function sanitizeChatChannel(channel: ChatChannel) {
  if (!channel) return console.error("tried to sanitize a channel but no channel was given");
  let sanitizedChatChannel: { name: string; connectedUsers: { [userKey: string]: {} } } = {
    name: channel.name,
    connectedUsers: {},
  };
  Object.keys(channel.connectedUsers).forEach((userKey) => {
    let sanitizedUser: { username: string | null; connectedSockets: string[] } = {
      username: null,
      connectedSockets: [],
    };
    let userPropKey: keyof typeof channel.connectedUsers.userId;
    for (userPropKey in channel.connectedUsers[userKey])
      if (userPropKey !== "connectedSockets") sanitizedUser[userPropKey] = channel.connectedUsers[userKey][userPropKey];
    sanitizedChatChannel.connectedUsers[userKey] = sanitizedUser;
  });
  return sanitizedChatChannel;
}

export function sanitizeGameRoom(gameRoom: GameRoom): GameRoom | void {
  if (!gameRoom) return console.log("tried to sanitize a game room but no game room was provided");
  let gameRoomForClient = cloneDeep(gameRoom);
  gameRoomForClient.countdownInterval = null;
  Object.keys(gameRoomForClient.players).forEach((player) => {
    if (gameRoomForClient.players[player]) {
      delete gameRoomForClient.players[player].socketId;
      delete gameRoomForClient.players[player].currentChatChannel;
      delete gameRoomForClient.players[player].previousChatChannelName;
    }
  });
  return gameRoomForClient;
}

export function sanitizeAllGameRooms(gameRooms: { [gameName: string]: GameRoom }) {
  let gamesForClient: { [gameName: string]: GameRoom } = {};
  Object.keys(gameRooms).forEach((gameName) => {
    const sanitizedGameRoom = sanitizeGameRoom(gameRooms[gameName]);
    if (sanitizedGameRoom) gamesForClient[gameName] = sanitizedGameRoom;
  });
  return gamesForClient;
}
