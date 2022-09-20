import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../store";
import * as alertActions from "../../../../store/actions/alert";
import * as gameUiActions from "../../../../store/actions/game-ui";
import * as lobbyUiActions from "../../../../store/actions/lobby-ui";
import { GameUI } from "../../../../store/reducers/game-ui";

interface Props {
  socket: Socket;
}

const UISocketListener = ({ socket }: Props) => {
  const dispatch = useDispatch();
  const gameUi: GameUI = useSelector((state: RootState) => state.gameUi);
  const { currentGameName } = gameUi;

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      dispatch(gameUiActions.clearGameUiData());
    });
    socket.on("gameListUpdate", (data) => {
      dispatch(gameUiActions.updateGamesList(data));
    });
    socket.on("currentGameRoomUpdate", (data) => {
      dispatch(gameUiActions.setCurrentGame(data));
    });
    socket.on("gameClosedByHost", () => {
      dispatch(gameUiActions.closePreGameScreen());
    });
    socket.on("updateOfcurrentChatChannelPlayerReadyStatus", (playersReady) => {
      dispatch(gameUiActions.updatePlayersReady(playersReady));
    });
    socket.on("serverSendsPlayerRole", (data) => {
      dispatch(gameUiActions.updatePlayerRole(data));
    });
    socket.on("currentGameStatusUpdate", (gameStatus) => {
      console.log("new game status: ", gameStatus);
      dispatch(gameUiActions.setCurrentGameStatus(gameStatus));
    });
    socket.on("currentGameCountdownUpdate", (countdown) => {
      if (!currentGameName) return;
      dispatch(gameUiActions.setCurrentGameCountdown(countdown));
    });
    socket.on("showEndScreen", (data) => {
      dispatch(lobbyUiActions.setScoreScreenData(data));
      dispatch(gameUiActions.clearGameUiData());
    });
    socket.on("matchmakningQueueJoined", () => {
      dispatch(gameUiActions.setMatchmakingWindowVisible(true));
    });
    socket.on("serverSendsMatchmakingQueueData", (data) => {
      dispatch(gameUiActions.setMatchmakingData(data));
    });
    socket.on("matchFound", () => {
      dispatch(gameUiActions.setMatchmakingWindowVisible(false));
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
  }, [socket, dispatch, currentGameName]);

  // errors
  useEffect(() => {
    if (!socket) return;
    socket.on("errorMessage", (data) => {
      console.log("error from server: " + data);
      dispatch(alertActions.setAlert(data, AlertType.DANGER));
    });
    return () => {
      socket.off("errorMessage");
    };
  }, [socket, dispatch]);
  //
  return <div id="socket-listener-for-ui" />;
};

export default UISocketListener;
