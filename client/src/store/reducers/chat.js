import {
  NEW_CHAT_MESSAGE,
  SET_CURRENT_CHAT_ROOM_USERS,
  SET_CURRENT_CHAT_ROOM_NAME,
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
    case SET_CURRENT_CHAT_ROOM_NAME:
      return {
        ...state,
        currentChatRoomName: payload,
      };
    case SET_CURRENT_CHAT_ROOM_USERS:
      return {
        ...state,
        currentChatRoomUsers: payload,
      };
    default:
      return state;
  }
}
