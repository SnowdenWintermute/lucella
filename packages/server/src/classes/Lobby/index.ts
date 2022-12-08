import { Socket } from "socket.io";
import { ChatChannel, GameRoom, SocketEventsFromServer, SocketMetadata, ErrorMessages } from "@lucella/common";
import { sanitizeChatChannel, sanitizeAllGameRooms, sanitizeGameRoom } from "./sanitizers";
import updateChatChannelUsernameLists from "./updateChatChannelUsernameLists";
import validateGameName from "./validateGameName";

export class Lobby {
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  constructor() {
    this.chatChannels = {};
    this.gameRooms = {};
  }
  getSanitizedGameRoom(gameRoom: GameRoom) {
    return sanitizeGameRoom(gameRoom);
  }
  getSanitizedGameRooms() {
    return sanitizeAllGameRooms(this.gameRooms);
  }
  getSanitizedChatChannel(channelName: string) {
    return sanitizeChatChannel(this.chatChannels[channelName]);
  }
  updateChatChannelUsernameLists(socketMeta: SocketMetadata, channelNameLeaving: string | null, channelNameJoining: string | null) {
    updateChatChannelUsernameLists(this.chatChannels, socketMeta, channelNameLeaving, channelNameJoining);
  }
  createGameRoom(socket: Socket, gameName: string, isRanked: boolean) {
    if (this.gameRooms[gameName]) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, ErrorMessages.GAME_EXISTS);
    const gameNameValidationError = validateGameName(gameName);
    if (gameNameValidationError) return socket.emit(SocketEventsFromServer.ERROR_MESSAGE, gameNameValidationError);
    this.gameRooms[gameName] = new GameRoom(gameName, isRanked);
  }
}
