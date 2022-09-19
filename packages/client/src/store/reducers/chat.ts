import { ChatMessage } from "../../classes/ChatMessage";
import { Action, ActionType } from "../actions/types";

export interface ChatState {
  currentChatRoomName: string;
  currentChatRoomUsers: { [id: string]: {} };
  messages: ChatMessage[];
  newChatRoomLoading: boolean;
}
// roomName: {connectedUsers: username: {userName:String, connectedSockets: [socketId]}}
const initialState = {
  currentChatRoomName: "",
  currentChatRoomUsers: {},
  messages: [],
  newChatRoomLoading: true,
};

export default function (state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case ActionType.SET_NEW_CHAT_ROOM_LOADING:
      return {
        ...state,
        newChatRoomLoading: payload,
      };
    case ActionType.NEW_CHAT_MESSAGE:
      if (!state.messages) {
        return {
          ...state,
          messages: [payload],
        };
      } else {
        return {
          ...state,
          messages: [...state.messages, payload],
        };
      }
    case ActionType.UPDATE_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoomName: payload.roomName,
        currentChatRoomUsers: payload.connectedUsers,
      };
    default:
      return state;
  }
}
