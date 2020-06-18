import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import UserList from "./UserList";
import ChannelInfoBox from "./ChannelInfoBox";

const ChannelBar = () => {
  const newRoomLoading = useSelector((state) => state.chat.newChatRoomLoading);
  const currentChatRoomName = useSelector(
    (state) => state.chat.currentChatRoomName
  );
  const currentChatRoomUsers = useSelector(
    (state) => state.chat.currentChatRoomUsers
  );

  return (
    <Fragment>
      <ChannelInfoBox
        newRoomLoading={newRoomLoading}
        numUsers={Object.keys(currentChatRoomUsers).length}
        channelName={currentChatRoomName}
      />
      <UserList
        newRoomLoading={newRoomLoading}
        currentChatRoomUsers={currentChatRoomUsers}
      />
    </Fragment>
  );
};

ChannelBar.propTypes = {
  socket: PropTypes.object,
  defaultChatRoom: PropTypes.string.isRequired,
};

export default ChannelBar;
