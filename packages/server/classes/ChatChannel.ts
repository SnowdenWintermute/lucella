import { ChatMessage } from "../../common/classes/ChatMessage";

export default class ChatChannel {
  name: string;
  parentGameRoom: string | null;
  messageHistory: ChatMessage[];
  connectedUsers: { [username: string]: { username: string; connectedSockets: string[] } };
  constructor(name: string, parentGameRoom?: string) {
    this.name = name;
    this.parentGameRoom = parentGameRoom || null;
    this.messageHistory = [];
    this.connectedUsers = {};
  }
}
