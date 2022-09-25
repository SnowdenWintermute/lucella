import { ChatMessage } from "../../../common/classes/ChatMessage";
import ChatChannel from "../../../server/classes/ChatChannel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IChatState {
  currentChatRoomName: string;
  currentChatRoomUsers: { [id: string]: {} };
  messages: ChatMessage[];
  newChatRoomLoading: boolean;
}
// roomName: {connectedUsers: username: {userName:String, connectedSockets: [socketId]}}
const initialState: IChatState = {
  currentChatRoomName: "",
  currentChatRoomUsers: {},
  messages: [],
  newChatRoomLoading: true,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNewChatRoomLoading(state) {
      state.newChatRoomLoading = true;
    },
    newChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    updateCurrentChatRoom(state, action: PayloadAction<ChatChannel>) {
      state.currentChatRoomName = action.payload.name;
      state.currentChatRoomUsers = action.payload.connectedUsers;
    },
  },
});

export const { setNewChatRoomLoading, newChatMessage, updateCurrentChatRoom } = chatSlice.actions;
export default chatSlice.reducer;
