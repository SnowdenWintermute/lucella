import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as alertActions from "../../../../store/actions/alert";
import * as gameUiActions from "../../../../store/actions/game-ui";

const UISocketListener = ({ socket }) => {
  const dispatch = useDispatch();
  const currentGameName = useSelector((state) => state.gameUi.currentGameName);

  useEffect(() => {
    if (!socket) return;
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
      if (!currentGameName) return null;
      dispatch(gameUiActions.updatePlayersReady(playersReady));
    });
    socket.on("serverSendsPlayerDesignation", (data) => {
      dispatch(gameUiActions.updatePlayerDesignation(data));
    });
    socket.on("currentGameStatusUpdate", (gameStatus) => {
      if (!currentGameName) return;
      dispatch(gameUiActions.setCurrentGameStatus(gameStatus));
    });
    socket.on("currentGameCountdownUpdate", (countdown) => {
      if (!currentGameName) return;
      dispatch(gameUiActions.setCurrentGameCountdown(countdown));
    });
    return () => {
      socket.off("currentGameRoomUpdate");
      socket.off("gameClosedByHost");
      socket.off("updateOfCurrentRoomPlayerReadyStatus");
      socket.off("currentGameStatusUpdate");
      socket.off("currentGameCountdownUpdate");
      socket.off("gameListUpdate");
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
