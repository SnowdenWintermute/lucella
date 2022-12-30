import React from "react";
import UserList from "./UserList";
import ChannelInfoBox from "./ChannelInfoBox";

function ChannelBar() {
  return (
    <>
      <ChannelInfoBox />
      <UserList />
    </>
  );
}

export default ChannelBar;
