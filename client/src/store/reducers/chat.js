import {
  NEW_CHAT_MESSAGE,
  SET_CURRENT_CHAT_ROOM_USERS,
} from "../actions/types";
import { SET_CURRENT_CHAT_ROOM_NAME } from "../actions/types";

const initialState = {
  currentChatRoomName: "",
  currentChatRoomUsers: {},
  messageListsByRoom: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case NEW_CHAT_MESSAGE:
      const { room, message } = payload;
      if (!state[room]) {
        state.messageListsByRoom[room] = [message];
      } else {
        state.messageListsByRoom[room] = [
          ...state.messageListsByRoom[room],
          message,
        ];
      }
      return state;
    case SET_CURRENT_CHAT_ROOM_NAME:
      const roomName = payload;
      state.currentChatRoomName = roomName;
      return state;
    case SET_CURRENT_CHAT_ROOM_USERS:
      state.currentChatRoomUsers = payload;
      return state;
    default:
      return state;
  }
}
