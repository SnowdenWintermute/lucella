import React, { useEffect } from "react";
const cloneDeep = require("lodash.clonedeep");
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux";
import { BattleRoomGame, SocketEventsFromServer } from "../../../common";
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
    socket.on(SocketEventsFromServer.GAME_INITIALIZATION, () => {
      console.log("game initialized");
    });
    socket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async (data) => {
      const decodedPacket = JSON.parse(data);
      console.log(decodedPacket);
    });
    socket.on(SocketEventsFromServer.NAME_OF_GAME_WINNER, (data) => {
      dispatch(setGameWinner(data));
    });
    socket.on(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, (data) => {
      currentGame.gameOverCountdown.current = data;
      // if (data === 0) dispatch(gameUiActions.clearGameUiData())
    });
    return () => {
      socket.off(SocketEventsFromServer.GAME_INITIALIZATION);
      socket.off(SocketEventsFromServer.GAME_PACKET);
      socket.off(SocketEventsFromServer.COMPRESSED_GAME_PACKET);
      socket.off(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE);
      socket.off(SocketEventsFromServer.NAME_OF_GAME_WINNER);
    };
  }, [socket, dispatch]);

  return <div id="socket-listener-for-battle-room-game" />;
};

export default GameListener;
