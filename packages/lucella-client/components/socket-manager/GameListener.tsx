import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch } from "../../redux";
import { BattleRoomGame, SocketEventsFromServer } from "../../../common";
import { setGameWinner } from "../../redux/slices/lobby-ui-slice";
import createClientPhysicsInterval from "../battle-room/client-physics/createClientPhysicsInterval";
const replicator = new (require("replicator"))();

interface Props {
  socket: Socket;
  currentGame: BattleRoomGame;
}

const GameListener = (props: Props) => {
  const { socket, currentGame } = props;

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.GAME_INITIALIZATION, () => {
      console.log("game initialized");
      currentGame.intervals.physics = createClientPhysicsInterval(currentGame);
    });
    socket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async (data) => {
      const decodedPacket = replicator.decode(data);
      currentGame.orbs = decodedPacket.orbs;
    });
    socket.on(SocketEventsFromServer.NAME_OF_GAME_WINNER, (data) => {
      dispatch(setGameWinner(data));
      currentGame.intervals.physics && clearInterval(currentGame.intervals.physics);
    });
    socket.on(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, (data) => {
      currentGame.gameOverCountdown.current = data;
      currentGame.intervals.physics && clearInterval(currentGame.intervals.physics);
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
