import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux";
import { BattleRoomGame, SocketEventsFromServer } from "../../../common/dist";
import { setGameWinner, setScoreScreenData } from "../../redux/slices/lobby-ui-slice";
import createClientPhysicsInterval from "../battle-room/client-physics/createClientPhysicsInterval";
import unpackDeltaPacket from "../../protobuf-utils/unpackDeltaPacket";
const replicator = new (require("replicator"))();

interface Props {
  socket: Socket;
  game: BattleRoomGame;
}

const GameListener = (props: Props) => {
  const dispatch = useAppDispatch();
  const { playerRole } = useAppSelector((state) => state.lobbyUi);
  const { socket, game } = props;

  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventsFromServer.GAME_INITIALIZATION, () => {
      console.log("game initialized");
      game.intervals.physics = createClientPhysicsInterval(socket, game, playerRole);
    });
    socket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async (data: Uint8Array) => {
      const newUpdate = unpackDeltaPacket(data);
      // game.netcode.lastUpdateFromServer = {
      //   orbs: decodedPacket.orbsList,
      //   serverLastProcessedInputNumbers: decodedPacket.serverLastProcessedInputNumbers,
      //   timeReceived: +Date.now(),
      // };
      // game.score = decodedPacket.score;
      // if (simulateLag)
      //   setTimeout(() => {
      //     const decodedPacket = replicator.decode(data);
      // game.netcode.lastUpdateFromServer = {
      //   orbs: decodedPacket.orbs,
      //   serverLastProcessedInputNumbers: decodedPacket.netcode.serverLastProcessedInputNumbers,
      //   timeReceived: +Date.now(),
      // };
      // game.score = decodedPacket.score;
      //   }, simulatedLagMs);
      // else {
      //   const decodedPacket = replicator.decode(data);
      //   game.netcode.lastUpdateFromServer = {
      //     orbs: decodedPacket.orbs,
      //     serverLastProcessedInputNumbers: decodedPacket.netcode.serverLastProcessedInputNumbers,
      //     timeReceived: +Date.now(),
      //   };
      //   game.score = decodedPacket.score;
      // }
    });
    socket.on(SocketEventsFromServer.NAME_OF_GAME_WINNER, (data) => {
      dispatch(setGameWinner(data));
      clearInterval(game.intervals.physics);
    });
    socket.on(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, (data) => {
      console.log(data);
      game.gameOverCountdown.current = data;
      clearInterval(game.intervals.physics);
      // if (data === 0) dispatch(gameUiActions.clearGameUiData())
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
