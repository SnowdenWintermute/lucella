import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as chatActions from "../../../../store/actions/chat";

const ChatSocketListener = ({ socket }) => {
  const dispatch = useDispatch();
  const currentChatRoomName = useSelector(
    (state) => state.chat.currentChatRoomName,
  );

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

  return <div></div>;
};

ChatSocketListener.propTypes = {
  socket: PropTypes.object,
};

export default ChatSocketListener;
