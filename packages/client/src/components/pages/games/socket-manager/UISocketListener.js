import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as alertActions from "../../../../store/actions/alert";
import * as gameUiActions from "../../../../store/actions/game-ui";
import * as lobbyUiActions from "../../../../store/actions/lobby-ui";

const UISocketListener = ({ socket }) => {
  const dispatch = useDispatch();
  const currentGameName = useSelector((state) => state.gameUi.currentGameName);

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
    socket.on("updateOfCurrentRoomPlayerReadyStatus", (playersReady) => {
      dispatch(gameUiActions.updatePlayersReady(playersReady));
    });
    socket.on("serverSendsPlayerRole", (data) => {
      dispatch(gameUiActions.updatePlayerRole(data));
    });
    socket.on("currentGameStatusUpdate", (gameStatus) => {
      console.log("new game status: ", gameStatus)
      dispatch(gameUiActions.setCurrentGameStatus(gameStatus));
    });
    socket.on("currentGameCountdownUpdate", (countdown) => {
      if (!currentGameName) return;
      dispatch(gameUiActions.setCurrentGameCountdown(countdown));
    });
    socket.on("showEndScreen", (data) => {
      dispatch(lobbyUiActions.setScoreScreenData(data));
      dispatch(gameUiActions.clearGameUiData())
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
      socket.off("updateOfCurrentRoomPlayerReadyStatus");
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
      dispatch(alertActions.setAlert(data, "danger"));
    });
    return () => {
      socket.off("errorMessage");
    };
  }, [socket, dispatch]);
  //
  return <div></div>;
};

UISocketListener.propTypes = {
  socket: PropTypes.object,
};

export default UISocketListener;
