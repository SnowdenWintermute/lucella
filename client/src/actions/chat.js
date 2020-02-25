import { NEW_CHAT_MESSAGE } from "./types";

// get current user profile
export const newChatMessage = messageData => async dispatch => {
  try {
    dispatch({
      type: NEW_CHAT_MESSAGE,
      payload: messageData
    });
  } catch (error) {
    console.log("new message error");
  }
};
