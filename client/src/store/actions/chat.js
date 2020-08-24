import {
  NEW_CHAT_MESSAGE,
  SET_CURRENT_CHAT_ROOM_NAME,
  SET_CURRENT_CHAT_ROOM_USERS,
  SET_NEW_CHAT_ROOM_LOADING,
} from "./types";

// chat room loading
export const setNewChatRoomLoading = (payload) => (dispatch) => {
  dispatch({ type: SET_NEW_CHAT_ROOM_LOADING, payload });
};

// update chat room name
export const setCurrentChatRoomName = (roomName) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_CHAT_ROOM_NAME,
    payload: roomName,
  });
};
// update chat room users
export const setCurrentChatRoomUsers = (usersObject) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_CHAT_ROOM_USERS,
    payload: usersObject,
  });
};
// add message to store
export const newChatMessage = (messageData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_CHAT_MESSAGE,
      payload: messageData,
    });
  } catch (error) {
    console.log("new message error");
    console.log(error);
  }
};