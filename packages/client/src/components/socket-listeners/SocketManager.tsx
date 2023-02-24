/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { GENERIC_SOCKET_EVENTS, SocketEventsFromServer, SOCKET_ADDRESS_PRODUCTION } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setAuthenticating, setCurrentGameRoom, setPreGameScreenDisplayed } from "../../redux/slices/lobby-ui-slice";
import { INetworkPerformanceMetrics } from "../../types";
import { pingIntervalMs } from "../../consts";
import ChatSocketListener from "./ChatSocketListener";
import UISocketListener from "./UISocketListener";
import handlePong from "./handlePong";

interface Props {
  socket: React.MutableRefObject<Socket | undefined>;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
}

const socketAddress = process.env.NODE_ENV === "production" ? SOCKET_ADDRESS_PRODUCTION : process.env.NEXT_PUBLIC_SOCKET_API;

function SocketManager({ socket, networkPerformanceMetricsRef }: Props) {
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
      dispatch(setPreGameScreenDisplayed(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
        dispatch(setAuthenticating(false));
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
        console.log("set last ping sent at");
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
