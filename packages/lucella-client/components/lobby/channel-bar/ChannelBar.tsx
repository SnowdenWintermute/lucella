import React, { Fragment } from "react";
import UserList from "./UserList";
import ChannelInfoBox from "./ChannelInfoBox";

const ChannelBar = () => {
  return (
    <Fragment>
      <ChannelInfoBox />
      <UserList />
    </Fragment>
  );
};

export default ChannelBar;
