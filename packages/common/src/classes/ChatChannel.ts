import { ChatMessage } from "./ChatMessage";

export type ChatChannelUsersList = { [username: string]: { username: string; isGuest: boolean; connectedSockets: string[] } };

export class ChatChannel {
  name: string;
  parentGameRoom: string | null;
  messageHistory: ChatMessage[] = [];
  connectedUsers: ChatChannelUsersList = {};
  constructor(name: string, parentGameRoom?: string) {
    this.name = name;
    this.parentGameRoom = parentGameRoom || null;
  }
}
