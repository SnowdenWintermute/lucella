/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { ErrorMessages, SocketEventsFromServer, GENERIC_SOCKET_EVENTS } from "../../../common";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";
import {
  clearLobbyUi,
  setCurrentGameRoom,
  setMatchmakingData,
  setMatchmakingWindowVisible,
  setPreGameScreenDisplayed,
  setScoreScreenData,
  setViewingGamesList,
  updateGameCountdown,
  updateGameList,
  updateGameStatus,
  updatePlayerRole,
  updatePlayersReady,
} from "../../redux/slices/lobby-ui-slice";
import { setShowScoreScreenModal } from "../../redux/slices/ui-slice";
// eslint-disable-next-line global-require
const replicator = new (require("replicator"))();

interface Props {
  socket: Socket;
}

function UISocketListener({ socket }: Props) {
  const dispatch = useAppDispatch();
  const { currentGameRoom } = useAppSelector((state) => state.lobbyUi);
  const gameName = currentGameRoom && currentGameRoom.gameName ? currentGameRoom.gameName : null;

  useEffect(() => {
    if (!socket) return;
    socket.on(GENERIC_SOCKET_EVENTS.CONNECT, () => {
      dispatch(clearLobbyUi());
    });
    socket.on(GENERIC_SOCKET_EVENTS.CONNECT_ERROR, () => {
      dispatch(setAlert(new Alert(ErrorMessages.LOBBY.ERROR_CONNECTING, AlertType.DANGER)));
    });
    socket.on(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, (data) => {
      dispatch(updateGameList(data));
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
      dispatch(setCurrentGameRoom(data));
      if (data) {
        dispatch(setViewingGamesList(false));
        dispatch(setPreGameScreenDisplayed(true));
      } else {
        dispatch(setPreGameScreenDisplayed(false));
      }
    });
    socket.on(SocketEventsFromServer.GAME_CLOSED_BY_HOST, () => {
      dispatch(setPreGameScreenDisplayed(false));
    });
    socket.on(SocketEventsFromServer.PLAYER_READINESS_UPDATE, (playersReady) => {
      dispatch(updatePlayersReady(playersReady));
    });
    socket.on(SocketEventsFromServer.PLAYER_ROLE_ASSIGNMENT, (data) => {
      dispatch(updatePlayerRole(data));
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, (gameStatus) => {
      dispatch(updateGameStatus(gameStatus));
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, (countdown) => {
      if (!gameName) return;
      dispatch(updateGameCountdown(countdown));
    });
    socket.on(SocketEventsFromServer.SHOW_SCORE_SCREEN, (data) => {
      dispatch(setScoreScreenData(data));
      dispatch(setShowScoreScreenModal(true));
    });
    socket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED, () => {
      dispatch(setMatchmakingWindowVisible(true));
    });
    socket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_UPDATE, (data) => {
      dispatch(setMatchmakingData(data));
    });
    socket.on(SocketEventsFromServer.MATCH_FOUND, () => {
      dispatch(setMatchmakingWindowVisible(false));
    });
    return () => {
      socket.off(GENERIC_SOCKET_EVENTS.CONNECT);
      socket.off(GENERIC_SOCKET_EVENTS.CONNECT_ERROR);
      socket.off(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE);
      socket.off(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE);
      socket.off(SocketEventsFromServer.GAME_CLOSED_BY_HOST);
      socket.off(SocketEventsFromServer.PLAYER_READINESS_UPDATE);
      socket.off(SocketEventsFromServer.PLAYER_ROLE_ASSIGNMENT);
      socket.off(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE);
      socket.off(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE);
      socket.off(SocketEventsFromServer.SHOW_SCORE_SCREEN);
      socket.off(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED);
      socket.off(SocketEventsFromServer.MATCHMAKING_QUEUE_UPDATE);
      socket.off(SocketEventsFromServer.MATCH_FOUND);
    };
  }, [socket, dispatch, gameName]);

  // errors
  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
      console.log(`error from server: ${data}`);
      dispatch(setAlert(new Alert(data, AlertType.DANGER)));
    });
    return () => {
      socket.off(SocketEventsFromServer.ERROR_MESSAGE);
    };
  }, [socket, dispatch]);
  //
  return <div id="socket-listener-for-ui" />;
}

export default UISocketListener;
