import { SocketEventsFromServer } from "../../../common/dist";
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
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
const replicator = new (require("replicator"))();

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
    socket.on(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, (data) => {
      console.log("new list of games: ", data);
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
      console.log("game status updated: ", gameStatus);
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE, (countdown) => {
      if (!gameName) return;
      dispatch(updateGameCountdown(countdown));
    });
    socket.on(SocketEventsFromServer.SHOW_END_SCREEN, (data) => {
      data.game = replicator.decode(data.game);
      dispatch(setScoreScreenData(data));
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
      socket.off(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE);
      socket.off(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE);
      socket.off(SocketEventsFromServer.GAME_CLOSED_BY_HOST);
      socket.off(SocketEventsFromServer.PLAYER_READINESS_UPDATE);
      socket.off(SocketEventsFromServer.PLAYER_ROLE_ASSIGNMENT);
      socket.off(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE);
      socket.off(SocketEventsFromServer.CURRENT_GAME_COUNTDOWN_UPDATE);
      socket.off(SocketEventsFromServer.SHOW_END_SCREEN);
      socket.off(SocketEventsFromServer.MATCHMAKING_QUEUE_ENTERED);
      socket.off(SocketEventsFromServer.MATCHMAKING_QUEUE_UPDATE);
      socket.off(SocketEventsFromServer.MATCH_FOUND);
    };
  }, [socket, dispatch, gameName]);

  // errors
  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => {
      console.log("error from server: " + data);
      dispatch(setAlert(new Alert(data, AlertType.DANGER)));
    });
    return () => {
      socket.off(SocketEventsFromServer.ERROR_MESSAGE);
    };
  }, [socket, dispatch]);
  //
  return <div id="socket-listener-for-ui" />;
};

export default UISocketListener;
