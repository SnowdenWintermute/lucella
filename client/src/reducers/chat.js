import { NEW_CHAT_MESSAGE } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case NEW_CHAT_MESSAGE:
      const { room, message, style, author } = payload;
      const messageToAdd = {
        author,
        message,
        style
      };
      if (state[room]) {
        const updatedRoom = [...state[room], messageToAdd];
        return [...state, room[updatedRoom]];
      } else {
        return [...state, room[messageToAdd]];
      }
    default:
      return state;
  }
}
