import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import UserList from "./UserList";
import ChannelInfoBox from "./ChannelInfoBox";
import { RootState } from "../../../../../store";

const ChannelBar = () => {
  return (
    <Fragment>
      <ChannelInfoBox />
      <UserList />
    </Fragment>
  );
};

export default ChannelBar;
