import {
  NEW_CHAT_MESSAGE,
  SET_CURRENT_CHAT_ROOM_USERS,
  SET_CURRENT_CHAT_ROOM_NAME,
  SET_NEW_CHAT_ROOM_LOADING,
} from "../actions/types";

const initialState = {
  currentChatRoomName: "",
  currentChatRoomUsers: {},
  messageListsByRoom: {},
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
      const { room, message } = payload;
      if (!state.messageListsByRoom[room]) {
        state.messageListsByRoom[room] = [message];
      } else {
        console.log("adding msg to store");
        console.log(state.messageListsByRoom[room]);
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
