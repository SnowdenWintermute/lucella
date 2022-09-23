import { Dispatch } from "redux";
import { ChatMessage } from "../../../common/classes/ChatMessage";

import { ActionType } from "./types";

export const setNewChatRoomLoading = (payload: boolean) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.SET_NEW_CHAT_ROOM_LOADING, payload });
};

export const updateCurrentChatRoom = (payload: { roomName: string; connectedUsers: {} }) => (dispatch: Dispatch) => {
  dispatch({ type: ActionType.UPDATE_CURRENT_CHAT_ROOM, payload });
};

export const newChatMessage = (payload: ChatMessage) => async (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.NEW_CHAT_MESSAGE,
    payload,
  });
};
