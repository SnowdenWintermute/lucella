import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux";
import { setAlert } from "../../redux/slices/alerts-slice";
import {
  clearLobbyUi,
  setCurrentGameRoom,
  setMatchmakingData,
  setMatchmakingWindowVisible,
  setPreGameScreenDisplayed,
  setScoreScreenData,
  updateGameCountdown,
  updateGameList,
  updateGameStatus,
  updatePlayerRole,
  updatePlayersReady,
} from "../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
}

const UISocketListener = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const { currentGameRoom } = useAppSelector((state) => state.lobbyUi);
  const gameName = currentGameRoom && currentGameRoom.gameName ? currentGameRoom.gameName : null;

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      dispatch(clearLobbyUi());
    });
    socket.on("gameListUpdate", (data) => {
      dispatch(updateGameList(data));
    });
    socket.on("currentGameRoomUpdate", (data) => {
      dispatch(setCurrentGameRoom(data));
    });
    socket.on("gameClosedByHost", () => {
      dispatch(setPreGameScreenDisplayed(false));
    });
    socket.on("updateOfcurrentChatChannelPlayerReadyStatus", (playersReady) => {
      dispatch(updatePlayersReady(playersReady));
    });
    socket.on("serverSendsPlayerRole", (data) => {
      dispatch(updatePlayerRole(data));
    });
    socket.on("currentGameStatusUpdate", (gameStatus) => {
      console.log("new game status: ", gameStatus);
      dispatch(updateGameStatus(gameStatus));
    });
    socket.on("currentGameCountdownUpdate", (countdown) => {
      if (!gameName) return;
      dispatch(updateGameCountdown(countdown));
    });
    socket.on("showEndScreen", (data) => {
      dispatch(setScoreScreenData(data));
    });
    socket.on("matchmakningQueueJoined", () => {
      dispatch(setMatchmakingWindowVisible(true));
    });
    socket.on("serverSendsMatchmakingQueueData", (data) => {
      dispatch(setMatchmakingData(data));
    });
    socket.on("matchFound", () => {
      dispatch(setMatchmakingWindowVisible(false));
    });
    return () => {
      socket.off("gameListUpdate");
      socket.off("currentGameRoomUpdate");
      socket.off("gameClosedByHost");
      socket.off("updateOfcurrentChatChannelPlayerReadyStatus");
      socket.off("serverSendsPlayerRole");
      socket.off("currentGameStatusUpdate");
      socket.off("currentGameCountdownUpdate");
      socket.off("showEndScreen");
      socket.off("matchmakingQueueJoined");
      socket.off("serverSendsMatchmakingQueueData");
      socket.off("matchFound");
    };
  }, [socket, dispatch, gameName]);

  // errors
  useEffect(() => {
    if (!socket) return;
    socket.on("errorMessage", (data) => {
      console.log("error from server: " + data);
      dispatch(setAlert(new Alert(data, AlertType.DANGER)));
    });
    return () => {
      socket.off("errorMessage");
    };
  }, [socket, dispatch]);
  //
  return <div id="socket-listener-for-ui" />;
};

export default UISocketListener;
