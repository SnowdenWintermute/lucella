/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { ErrorMessages, SocketEventsFromServer, GENERIC_SOCKET_EVENTS, ChatMessage, ChatMessageStyles } from "../../../../common";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";
import { newChatMessage, setNewChatChannelLoading } from "../../redux/slices/chat-slice";
import {
  clearLobbyUi,
  setAuthenticating,
  setCurrentGameRoom,
  setMatchmakingData,
  setMatchmakingLoading,
  setScoreScreenData,
  updateGameCountdown,
  updateGameList,
  updateGameStatus,
  updatePlayerRole,
  updatePlayersReady,
  setGameCreationWaitingListPosition,
  setDropdownVisibility,
  DropdownMenus,
} from "../../redux/slices/lobby-ui-slice";
import { setShowScoreScreenModal } from "../../redux/slices/ui-slice";

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
      dispatch(newChatMessage(new ChatMessage(ErrorMessages.LOBBY.ERROR_CONNECTING, "Error", ChatMessageStyles.ERROR)));
    });
    socket.on(GENERIC_SOCKET_EVENTS.DISCONNECT, () => {
      dispatch(newChatMessage(new ChatMessage("Server disconnected", "Server", ChatMessageStyles.PRIVATE)));
      dispatch(setAuthenticating(false));
      dispatch(setNewChatChannelLoading(true));
    });
    socket.on(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, (data) => {
      dispatch(updateGameList(data));
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
      dispatch(setCurrentGameRoom(data));
      if (data) dispatch(setDropdownVisibility(DropdownMenus.GAME_ROOM));
      else dispatch(setDropdownVisibility(DropdownMenus.WELCOME));
    });
    socket.on(SocketEventsFromServer.GAME_CLOSED_BY_HOST, () => {
      dispatch(setDropdownVisibility(DropdownMenus.WELCOME));
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
      dispatch(setDropdownVisibility(DropdownMenus.MATCHMAKING_QUEUE));
      dispatch(setMatchmakingLoading(false));
    });
    socket.on(SocketEventsFromServer.MATCHMAKING_QUEUE_UPDATE, (data) => {
      dispatch(setMatchmakingData(data));
    });
    socket.on(SocketEventsFromServer.REMOVED_FROM_MATCHMAKING, () => {
      dispatch(clearLobbyUi());
    });
    socket.on(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, (data) => {
      dispatch(setGameCreationWaitingListPosition(data));
    });
    return () => {
      socket.off(GENERIC_SOCKET_EVENTS.CONNECT);
      socket.off(GENERIC_SOCKET_EVENTS.CONNECT_ERROR);
      socket.off(GENERIC_SOCKET_EVENTS.DISCONNECT);
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
      socket.off(SocketEventsFromServer.REMOVED_FROM_MATCHMAKING);
      socket.off(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION);
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
