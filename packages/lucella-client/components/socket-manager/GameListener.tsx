import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux";
import { BattleRoomGame, SocketEventsFromServer, randBetween } from "../../../common";
import { setGameWinner } from "../../redux/slices/lobby-ui-slice";
import createClientPhysicsInterval from "../battle-room/client-physics/createClientPhysicsInterval";
import createClientBroadcastInterval from "../battle-room/game-functions/createClientBroadcastInterval";
const replicator = new (require("replicator"))();

interface Props {
  socket: Socket;
  currentGame: BattleRoomGame;
}

const GameListener = (props: Props) => {
  const dispatch = useAppDispatch();
  const { playerRole } = useAppSelector((state) => state.lobbyUi);
  const { socket, currentGame } = props;

  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.GAME_INITIALIZATION, () => {
      console.log("game initialized");
      currentGame.intervals.physics = createClientPhysicsInterval(socket, currentGame, playerRole);
      // currentGame.intervals.broadcast = createClientBroadcastInterval(socket, currentGame, playerRole);
    });
    socket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async (data) => {
      setTimeout(() => {
        const decodedPacket = replicator.decode(data);
        currentGame.lastUpdateFromServer = {
          orbs: decodedPacket.orbs,
          tick: decodedPacket.currentTick,
          serverLastKnownClientTicks: decodedPacket.serverLastKnownClientTicks,
          serverLastProcessedInputNumbers: decodedPacket.serverLastProcessedInputNumbers,
          timeReceived: +Date.now(),
        };
        currentGame.score = decodedPacket.score;
      }, 500);
    });
    socket.on(SocketEventsFromServer.NAME_OF_GAME_WINNER, (data) => {
      dispatch(setGameWinner(data));
      clearInterval(currentGame.intervals.physics);
      // clearInterval(currentGame.intervals.broadcast);
    });
    socket.on(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, (data) => {
      currentGame.gameOverCountdown.current = data;
      clearInterval(currentGame.intervals.physics);
      // clearInterval(currentGame.intervals.broadcast);
      // if (data === 0) dispatch(gameUiActions.clearGameUiData())
    });
    return () => {
      clearInterval(currentGame.intervals.physics);
      clearInterval(currentGame.intervals.broadcast);
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
