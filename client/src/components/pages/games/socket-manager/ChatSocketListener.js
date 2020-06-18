import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as chatActions from "../../../../store/actions/chat";

const ChatSocketListener = ({ socket }) => {
  const dispatch = useDispatch();
  const currentChatRoomName = useSelector(
    (state) => state.chat.currentChatRoomName
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("updateChatRoom", (data) => {
      console.log(data);
      dispatch(chatActions.setNewChatRoomLoading(false));
      const { roomName, currentUsers } = data;
      dispatch(chatActions.setCurrentChatRoomUsers(currentUsers));
      dispatch(chatActions.setCurrentChatRoomName(roomName));
    });
    return () => {
      socket.off("updateChatRoom");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", async (message) => {
      console.log(message);
      const msgForReduxStore = { message, room: currentChatRoomName };
      dispatch(chatActions.newChatMessage(msgForReduxStore));
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, currentChatRoomName, dispatch]);

  return <div></div>;
};

ChatSocketListener.propTypes = {
  socket: PropTypes.object,
};

export default ChatSocketListener;
