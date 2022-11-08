import { SocketEventsFromServer } from "../../../common/dist";
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
    socket.on(SocketEventsFromServer.CHAT_ROOM_UPDATE, (data) => {
      dispatch(setNewChatRoomLoading(false));
      dispatch(updateCurrentChatRoom(data));
    });
    socket.on(SocketEventsFromServer.NEW_CHAT_MESSAGE, (message) => {
      dispatch(newChatMessage(message));
    });
    return () => {
      socket.off(SocketEventsFromServer.CHAT_ROOM_UPDATE);
      socket.off(SocketEventsFromServer.NEW_CHAT_MESSAGE);
    };
  }, [socket, currentChatRoomName, dispatch]);

  return <div id="socket-listener-for-chat" />;
};

export default ChatSocketListener;
