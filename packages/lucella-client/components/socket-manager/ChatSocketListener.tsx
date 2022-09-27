import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux";
import { newChatMessage, setNewChatRoomLoading, updateCurrentChatRoom } from "../../redux/slices/chat-slice";

interface Props {
  socket: Socket;
}

const ChatSocketListener = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const { currentChatRoomName } = chatState;
  useEffect(() => {
    if (!socket) return;
    socket.on("updateChatRoom", (data) => {
      dispatch(setNewChatRoomLoading(false));
      dispatch(updateCurrentChatRoom(data));
    });
    return () => {
      socket.off("updateChatRoom");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", async (message) => {
      const msgForReduxStore = message;
      dispatch(newChatMessage(msgForReduxStore));
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, currentChatRoomName, dispatch]);

  return <div id="socket-listener-for-chat" />;
};

export default ChatSocketListener;
