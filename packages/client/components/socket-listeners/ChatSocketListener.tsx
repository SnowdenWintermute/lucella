/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage, ChatMessageStyles, SocketEventsFromServer } from "../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { newChatMessage, setNewChatChannelLoading, updateCurrentChatChannel } from "../../redux/slices/chat-slice";

interface Props {
  socket: Socket;
}

function ChatSocketListener({ socket }: Props) {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const { currentChatChannelName } = chatState;
  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, (data) => {
      dispatch(setNewChatChannelLoading(false));
      dispatch(updateCurrentChatChannel(data));
    });
    socket.on(SocketEventsFromServer.NEW_CHAT_MESSAGE, (message) => {
      dispatch(newChatMessage(message));
    });
    socket.on("disconnect", () => {
      dispatch(newChatMessage(new ChatMessage("Server disconnected", "server", ChatMessageStyles.PRIVATE)));
    });
    return () => {
      socket.off(SocketEventsFromServer.CHAT_CHANNEL_UPDATE);
      socket.off(SocketEventsFromServer.NEW_CHAT_MESSAGE);
      socket.off("disconnect");
    };
  }, [socket, currentChatChannelName, dispatch]);

  return <div id="socket-listener-for-chat" />;
}

export default ChatSocketListener;
