import { Server } from "socket.io";
import { ChatChannel, GameRoom } from "../../../../common";
import ServerState from "../../interfaces/ServerState";
import sanitizeGameRoomsForClient from "../../utils/sanitizeGameRoomsForClient";

export class LobbyManager {
  io: Server;
  serverState: ServerState;
  chatChannels: { [name: string]: ChatChannel };
  gameRooms: { [roomName: string]: GameRoom };
  constructor(io: Server, serverState: ServerState) {
    this.chatChannels = {};
    this.gameRooms = {};
    this.io = io;
    this.serverState = serverState;
  }
  getSanitizedGameRooms() {
    return sanitizeGameRoomsForClient(this.gameRooms);
  }
  handleRequestToJoinChatChannel() {
    // leave socket from any previous channel
    // remove socketMetaData from that channel
    // join socket to new channel
    // update socket metadata for that channel
  }
}
