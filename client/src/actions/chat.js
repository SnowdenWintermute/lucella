import { NEW_CHAT_MESSAGE } from "./types";

// add message to store
export const newChatMessage = messageData => async dispatch => {
  try {
    dispatch({
      type: NEW_CHAT_MESSAGE,
      payload: messageData
    });
  } catch (error) {
    console.log("new message error");
    console.log(error);
  }
};
