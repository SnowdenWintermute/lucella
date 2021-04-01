import {
  NEW_CHAT_MESSAGE,
  UPDATE_CURRENT_CHAT_ROOM,
  SET_NEW_CHAT_ROOM_LOADING,
} from "./types";

export const setNewChatRoomLoading = (payload) => (dispatch) => {
  dispatch({ type: SET_NEW_CHAT_ROOM_LOADING, payload });
};

export const updateCurrentChatRoom = (payload) => dispatch => {
  dispatch({ type: UPDATE_CURRENT_CHAT_ROOM, payload })
}

export const newChatMessage = (messageData) => async (dispatch) => {
  dispatch({
    type: NEW_CHAT_MESSAGE,
    payload: messageData,
  });
};
