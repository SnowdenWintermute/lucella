import {
  NEW_CHAT_MESSAGE,
  UPDATE_CURRENT_CHAT_ROOM,
  SET_NEW_CHAT_ROOM_LOADING,
} from "../actions/types";

const initialState = {
  currentChatRoomName: "",
  currentChatRoomUsers: {},
  messages: [],
  newChatRoomLoading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_NEW_CHAT_ROOM_LOADING:
      return {
        ...state,
        newChatRoomLoading: payload,
      };
    case NEW_CHAT_MESSAGE:
      const { message } = payload;
      if (!state.messages) {
        return {
          ...state,
          messages: [message],
        };
      } else {
        return {
          ...state,
          messages: [...state.messages, message],
        };
      }
    case UPDATE_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoomName: payload.roomName,
        currentChatRoomUsers: payload.connectedUsers,
      };
    default:
      return state;
  }
}
