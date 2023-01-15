import React from "react";
import { Socket } from "socket.io-client";
import ChatSocketListener from "./ChatSocketListener";
import UISocketListener from "./UISocketListener";

interface Props {
  socket: Socket;
}

function SocketManager({ socket }: Props) {
  return (
    <>
      <ChatSocketListener socket={socket} />
      <UISocketListener socket={socket} />
    </>
  );
}

export default SocketManager;
