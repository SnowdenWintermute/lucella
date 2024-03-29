/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BattleRoomGame, endScreenCountdownDelay, GameStatus, SocketEventsFromServer, WidthAndHeight } from "../../../../common";
import { setGameWinner } from "../../redux/slices/lobby-ui-slice";
import createClientPhysicsInterval from "../battle-room/client-physics/createClientPhysicsInterval";
import unpackDeltaPacket from "../../protobuf-utils/unpackDeltaPacket";
import mapUnpackedPacketToUpdateObject from "../../protobuf-utils/mapUnpackedPacketToUpdateObject";
import { INetworkPerformanceMetrics } from "../../types";

interface Props {
  socket: Socket;
  game: BattleRoomGame;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasSizeRef: React.RefObject<WidthAndHeight | null>;
  networkPerformanceMetrics: INetworkPerformanceMetrics;
}

function GameListener(props: Props) {
  const dispatch = useAppDispatch();
  const { playerRole } = useAppSelector((state) => state.lobbyUi);
  const { theme } = useAppSelector((state) => state.UI);
  const { socket, game, canvasRef, canvasSizeRef, networkPerformanceMetrics } = props;

  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.GAME_INITIALIZATION, () => {
      createClientPhysicsInterval(socket, game, playerRole, canvasRef, canvasSizeRef, networkPerformanceMetrics, theme);
    });
    socket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async (data: Uint8Array) => {
      if (!playerRole) return console.log("failed to accept a delta update from server because no player role was assigned");
      const unpacked = unpackDeltaPacket(data, playerRole);
      const prevGameStateWithDeltas = mapUnpackedPacketToUpdateObject(game, unpacked);
      game.netcode.lastUpdateFromServer = prevGameStateWithDeltas;
      game.netcode.timeLastUpdateReceived = +Date.now();
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_NUMBER_OF_ROUNDS_WON, (data: { host: number; challenger: number }) => {
      game.roundsWon = data;
    });
    socket.on(SocketEventsFromServer.NAME_OF_GAME_WINNER, (data) => {
      dispatch(setGameWinner(data));
      game.winner = data;
    });
    socket.on(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, (data) => {
      if (!game) return;
      if (data === GameStatus.STARTING_NEXT_ROUND) game.newRoundStarting = true;
      else game.newRoundStarting = false;
    });
    socket.on(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE, (countdown) => {
      game.newRoundCountdown.current = countdown;
    });
    socket.on(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, (data) => {
      game.gameOverCountdown.current = data;
      if (data === 0) setTimeout(() => clearInterval(game.intervals.physics), endScreenCountdownDelay);
    });
    return () => {
      clearInterval(game.intervals.physics);
      socket.off(SocketEventsFromServer.GAME_INITIALIZATION);
      socket.off(SocketEventsFromServer.COMPRESSED_GAME_PACKET);
      socket.off(SocketEventsFromServer.CURRENT_GAME_NUMBER_OF_ROUNDS_WON);
      socket.off(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE);
      socket.off(SocketEventsFromServer.NEW_ROUND_STARTING_COUNTDOWN_UPDATE);
      socket.off(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE);
      socket.off(SocketEventsFromServer.NAME_OF_GAME_WINNER);
    };
  }, [socket, dispatch]);

  return <div id="socket-listener-for-battle-room-game" />;
}

export default GameListener;
