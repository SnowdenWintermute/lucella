import React, { Fragment } from "react";
import { Socket } from "socket.io-client";
import ChatSocketListener from "./ChatSocketListener";
import UISocketListener from "./UISocketListener";

interface Props {
  socket: Socket;
}

const SocketManager = ({ socket }: Props) => {
  return (
    <Fragment>
      <ChatSocketListener socket={socket} />
      <UISocketListener socket={socket} />
    </Fragment>
  );
};

export default SocketManager;
