import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as chatActions from "../../../../store/actions/chat";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../store";
import { ChatState } from "../../../../store/reducers/chat";

interface Props {
  socket: Socket;
}

const ChatSocketListener = ({ socket }: Props) => {
  const dispatch = useDispatch();
  const chatState: ChatState = useSelector((state: RootState) => state.chat);
  const { currentChatRoomName } = chatState;
  useEffect(() => {
    if (!socket) return;
    socket.on("updateChatRoom", (data) => {
      dispatch(chatActions.setNewChatRoomLoading(false));
      dispatch(chatActions.updateCurrentChatRoom(data));
    });
    return () => {
      socket.off("updateChatRoom");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", async (message) => {
      const msgForReduxStore = { message, room: currentChatRoomName };
      dispatch(chatActions.newChatMessage(msgForReduxStore));
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, currentChatRoomName, dispatch]);

  return <div id="socket-listener-for-chat" />;
};

export default ChatSocketListener;
