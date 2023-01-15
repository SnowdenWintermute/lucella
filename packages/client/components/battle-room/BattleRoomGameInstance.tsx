import { Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import GameListener from "../socket-listeners/GameListener";
import { BattleRoomGame, WidthAndHeight, GameStatus } from "../../../common";
import CanvasWithInputListeners from "./CanvasWithInputListeners";
import useWindowDimensions from "../../hooks/useWindowDimensions";

interface Props {
  socket: Socket;
}

function BattleRoomGameInstance(props: Props) {
  const { socket } = props;
  const windowDimensions = useWindowDimensions();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { currentGameRoom } = lobbyUiState;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: BattleRoomGame.baseWindowDimensions.width,
    height: BattleRoomGame.baseWindowDimensions.height,
  });
  const currentGame = useRef(lobbyUiState.currentGameRoom && new BattleRoomGame(lobbyUiState.currentGameRoom.gameName));
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
    <div className="battle-room-canvas-holder" onContextMenu={(e) => e.preventDefault()}>
      {currentGame.current && <GameListener socket={socket} game={currentGame.current} canvasRef={canvasRef} canvasSizeRef={canvasSizeRef} />}
      {(currentGame.current && currentGameRoom?.gameStatus === GameStatus.IN_PROGRESS) || currentGameRoom?.gameStatus === GameStatus.ENDING ? (
        <CanvasWithInputListeners canvasSizeRef={canvasSizeRef} canvasRef={canvasRef} currentGame={currentGame.current!} socket={socket} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default BattleRoomGameInstance;
