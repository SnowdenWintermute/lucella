import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BattleRoomGame, endScreenCountdownDelay, simulatedLagMs, simulateLag, SocketEventsFromServer, WidthAndHeight } from "../../../common";
import { setGameWinner, setScoreScreenData } from "../../redux/slices/lobby-ui-slice";
import createClientPhysicsInterval from "../battle-room/client-physics/createClientPhysicsInterval";
import unpackDeltaPacket from "../../protobuf-utils/unpackDeltaPacket";
import mapUnpackedPacketToUpdateObject from "../../protobuf-utils/mapUnpackedPacketToUpdateObject";

interface Props {
  socket: Socket;
  game: BattleRoomGame;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasSizeRef: React.RefObject<WidthAndHeight | null>;
}

const GameListener = (props: Props) => {
  const dispatch = useAppDispatch();
  const { playerRole } = useAppSelector((state) => state.lobbyUi);
  const { socket, game, canvasRef, canvasSizeRef } = props;

  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.GAME_INITIALIZATION, () => {
      game.intervals.physics = createClientPhysicsInterval(socket, game, playerRole, canvasRef, canvasSizeRef);
    });
    socket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async (data: Uint8Array) => {
      if (!playerRole) return console.log("failed to accept a delta update from server because no player role was assigned");
      const unpacked = unpackDeltaPacket(data, playerRole);
      if (simulateLag)
        setTimeout(() => {
          const prevGameStateWithDeltas = mapUnpackedPacketToUpdateObject(game, unpacked);
          game.netcode.lastUpdateFromServer = prevGameStateWithDeltas;
          game.netcode.timeLastUpdateReceived = +Date.now();
        }, simulatedLagMs);
      else {
        const prevGameStateWithDeltas = mapUnpackedPacketToUpdateObject(game, unpacked);
        game.netcode.lastUpdateFromServer = prevGameStateWithDeltas;
        game.netcode.timeLastUpdateReceived = +Date.now();
      }
    });
    socket.on(SocketEventsFromServer.NAME_OF_GAME_WINNER, (data) => {
      dispatch(setGameWinner(data));
      game.winner = data;
    });
    socket.on(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, (data) => {
      game.gameOverCountdown.current = data;
      if (data === 0) setTimeout(() => clearInterval(game.intervals.physics), endScreenCountdownDelay);
    });
    return () => {
      clearInterval(game.intervals.physics);
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
