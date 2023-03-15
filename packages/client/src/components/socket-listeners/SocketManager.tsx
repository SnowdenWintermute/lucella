/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { GENERIC_SOCKET_EVENTS, SocketEventsFromClient, SocketEventsFromServer, SOCKET_ADDRESS_PRODUCTION } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { DropdownMenus, setAuthenticating, setCurrentGameRoom, setDropdownVisibility } from "../../redux/slices/lobby-ui-slice";
import { INetworkPerformanceMetrics } from "../../types";
import { pingIntervalMs } from "../../consts";
import ChatSocketListener from "./ChatSocketListener";
import UISocketListener from "./UISocketListener";
import handlePong from "./handlePong";

interface Props {
  socket: React.MutableRefObject<Socket | undefined>;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
  defaultChatChannel: string;
}

const socketAddress = process.env.NODE_ENV === "production" ? SOCKET_ADDRESS_PRODUCTION : process.env.NEXT_PUBLIC_SOCKET_API;

function SocketManager({ socket, defaultChatChannel, networkPerformanceMetricsRef }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);

  // setup socket
  useEffect(() => {
    socket.current = io(socketAddress || "", { transports: ["websocket"] });
    console.log("socket address: ", socketAddress);
    return () => {
      if (socket.current) socket.current.disconnect();
      dispatch(setCurrentGameRoom(null));
      dispatch(setDropdownVisibility(DropdownMenus.WELCOME));
    };
  }, [dispatch]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
        dispatch(setAuthenticating(false));
        socket.current!.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, defaultChatChannel);
      });
    }
    return () => {
      if (socket.current) socket.current.off(SocketEventsFromServer.AUTHENTICATION_COMPLETE);
    };
  });

  // calculate latency and with each ping send current latency to the server
  useEffect(() => {
    if (!lobbyUiState.authenticating) {
      pingInterval.current = setInterval(() => {
        if (!socket.current) return;
        networkPerformanceMetricsRef.current.lastPingSentAt = Date.now();
        socket.current.volatile.emit(GENERIC_SOCKET_EVENTS.PING, networkPerformanceMetricsRef.current.latency);
      }, pingIntervalMs);
      if (socket.current)
        socket.current.on(GENERIC_SOCKET_EVENTS.PONG, () => {
          handlePong(networkPerformanceMetricsRef);
        });
    }
    return () => {
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
  }, [lobbyUiState.authenticating]);

  if (!socket.current) return null;
  return (
    <>
      <ChatSocketListener socket={socket.current} />
      <UISocketListener socket={socket.current} />
    </>
  );
}

export default SocketManager;
