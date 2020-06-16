import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import UserList from "./UserList";
import ChannelInfoBox from "./ChannelInfoBox";

import * as chatActions from "../../../../../store/actions/chat";

const ChannelBar = ({ socket, defaultChatRoom }) => {
  const dispatch = useDispatch();
  const [newRoomLoading, setNewRoomLoading] = useState(true);
  const currentChatRoomName = useSelector(
    (state) => state.chat.currentChatRoomName
  );
  const currentChatRoomUsers = useSelector(
    (state) => state.chat.currentChatRoomUsers
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("updateChatRoom", (data) => {
      console.log(data);
      setNewRoomLoading(false);
      const { roomName, currentUsers } = data;
      dispatch(chatActions.setCurrentChatRoomUsers(currentUsers));
      dispatch(chatActions.setCurrentChatRoomName(roomName));
    });
    return () => {
      socket.off("updateChatRoom");
    };
  }, [socket, dispatch]);

  return (
    <Fragment>
      <ChannelInfoBox
        newRoomLoading={newRoomLoading}
        numUsers={Object.keys(currentChatRoomUsers).length}
        channelName={currentChatRoomName}
      />
      <UserList currentChatRoomUsers={currentChatRoomUsers} />
    </Fragment>
  );
};

ChannelBar.propTypes = {
  socket: PropTypes.object,
  defaultChatRoom: PropTypes.string.isRequired,
};

export default ChannelBar;
