import React, { useEffect } from "react";
const cloneDeep = require("lodash.clonedeep");
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux";
import { BattleRoomGame } from "@lucella/common";
import { setGameWinner } from "../../redux/slices/lobby-ui-slice";

interface Props {
  socket: Socket;
  currentGame: BattleRoomGame;
}

const GameListener = (props: Props) => {
  const { socket, currentGame } = props;
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!socket) return;
    socket.on("serverInitsGame", () => {
      // setLastServerGameUpdate(cloneDeep(currentGame));
    });
    socket.on("bufferTickFromServer", async (data) => {
      const decodedPacket = JSON.parse(data);
      // let newUpdate = lastServerGameUpdate;
      // Object.keys(decodedPacket).forEach((key) => {
      //   newUpdate[key] = cloneDeep(decodedPacket[key]);
      // });
    });
    socket.on("serverSendsWinnerInfo", (data) => {
      dispatch(setGameWinner(data));
    });
    socket.on("gameEndingCountdown", (data) => {
      currentGame.gameOverCountdown.current = data;
      // if (data === 0) dispatch(gameUiActions.clearGameUiData())
    });
    return () => {
      socket.off("serverInitsGame");
      socket.off("tickFromServer");
      socket.off("bufferTickFromServer");
      socket.off("gameEndingCountdown");
      socket.off("serverSendsWinnerInfo");
    };
  }, [socket, dispatch]);

  return <div id="socket-listener-for-battle-room-game" />;
};

export default GameListener;
