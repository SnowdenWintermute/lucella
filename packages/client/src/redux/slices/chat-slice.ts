/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ChatMessage, ChatChannel } from "../../../../common";

export interface IChatState {
  currentChatChannelName: string;
  currentChatChannelUsers: { [username: string]: { username: string; isGuest: boolean } };
  messages: ChatMessage[];
  newChatChannelLoading: boolean;
}
// roomName: {connectedUsers: username: {userName:String, connectedSockets: [socketId]}}
const initialState: IChatState = {
  currentChatChannelName: "",
  currentChatChannelUsers: {},
  messages: [],
  newChatChannelLoading: true,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNewChatChannelLoading(state, action: PayloadAction<boolean>) {
      state.newChatChannelLoading = action.payload;
    },
    newChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    updateCurrentChatChannel(state, action: PayloadAction<ChatChannel>) {
      state.currentChatChannelName = action.payload.name;
      state.currentChatChannelUsers = action.payload.connectedUsers;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log("HYDRATE", state, action.payload);
      return {
        ...state,
        ...action.payload.subject,
      };
    },
  },
});

export const { setNewChatChannelLoading, newChatMessage, updateCurrentChatChannel } = chatSlice.actions;
export default chatSlice.reducer;
