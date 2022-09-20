import { ChatMessage } from "@lucella/common/battleRoomGame/classes/ChatMessage";

export default class ChatChannel {
  name: string;
  parentGameRoom: string;
  messageHistory: ChatMessage[];
  connectedUsers: { [username: string]: { username: string; connectedSockets: string[] } };
  constructor(name: string, parentGameRoom: string) {
    this.name = name;
    this.parentGameRoom = parentGameRoom;
    this.messageHistory = [];
    this.connectedUsers = {};
  }
}
