import { Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import GameListener from "../SocketManager/GameListener";
import { BattleRoomGame, WidthAndHeight, GameStatus, GameRoom } from "../../../../common";
import CanvasWithInputListeners from "./CanvasWithInputListeners";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { INetworkPerformanceMetrics } from "../../types";

interface Props {
  socket: Socket;
  networkPerformanceMetricsRef: React.MutableRefObject<INetworkPerformanceMetrics>;
}

function BattleRoomGameInstance({ socket, networkPerformanceMetricsRef }: Props) {
  const windowDimensions = useWindowDimensions();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { currentGameRoom } = lobbyUiState;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: BattleRoomGame.baseWindowDimensions.width,
    height: BattleRoomGame.baseWindowDimensions.height,
  });
  if (!currentGameRoom) return <p>Loading game room...</p>;
  const { gameName, battleRoomGameConfig, players } = currentGameRoom;
  if (!players.host || !players.challenger) return <p>Error - tried to start a game but one of the players was not found</p>;
  const currentGame = useRef(
    lobbyUiState.currentGameRoom &&
      new BattleRoomGame(
        gameName,
        {
          host: players.host.associatedUser.username,
          challenger: players.challenger.associatedUser.username,
        },
        battleRoomGameConfig
      )
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSizeRef = useRef<WidthAndHeight | null>(null);
  const gameWidthRatio = useRef(window.innerHeight * 0.6);

  useEffect(() => {
    if (!windowDimensions) return;
    gameWidthRatio.current = window.innerHeight * 0.6;
    // even though we don't use this value for anything, the fact that we set state forces a react refresh which actually makes the
    // canvas resize, so its needed for now
    setCanvasSize({
      height: windowDimensions.height,
      width: gameWidthRatio.current > windowDimensions.width ? windowDimensions.width : gameWidthRatio.current,
    });
    canvasSizeRef.current = {
      height: windowDimensions.height,
      width: gameWidthRatio.current > windowDimensions.width ? windowDimensions.width : gameWidthRatio.current,
    };
  }, [setCanvasSize, windowDimensions]);

  return (
    <div className="battle-room-game__backdrop" onContextMenu={(e) => e.preventDefault()}>
      <div className="battle-room-game__canvas-container" onContextMenu={(e) => e.preventDefault()}>
        {currentGame.current && (
          <GameListener
            socket={socket}
            game={currentGame.current}
            canvasRef={canvasRef}
            canvasSizeRef={canvasSizeRef}
            networkPerformanceMetrics={networkPerformanceMetricsRef.current}
          />
        )}
        {currentGame.current && currentGameRoom && GameRoom.gameScreenActive(currentGameRoom) ? (
          <CanvasWithInputListeners canvasSizeRef={canvasSizeRef} canvasRef={canvasRef} currentGame={currentGame.current!} socket={socket} />
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

export default BattleRoomGameInstance;
