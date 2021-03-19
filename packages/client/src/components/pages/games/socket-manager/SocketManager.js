import React, { Fragment } from "react";
import PropTypes from "prop-types";

import ChatSocketListener from "./ChatSocketListener";
import UISocketListener from "./UISocketListener";

const SocketManager = ({ socket }) => {
  return (
    <Fragment>
      <ChatSocketListener socket={socket} />
      <UISocketListener socket={socket} />
    </Fragment>
  );
};

SocketManager.propTypes = {
  socket: PropTypes.object,
};

export default SocketManager;
