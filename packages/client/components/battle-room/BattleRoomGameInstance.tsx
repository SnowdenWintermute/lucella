import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux";
import GameListener from "../socket-listeners/GameListener";
import { BattleRoomGame, WidthAndHeight, GameStatus } from "../../../common";
import { Socket } from "socket.io-client";
import CanvasWithInputListeners from "./CanvasWithInputListeners";

interface Props {
  socket: Socket;
}

const BattleRoomGameInstance = (props: Props) => {
  const { socket } = props;
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { currentGameRoom } = lobbyUiState;
  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: BattleRoomGame.baseWindowDimensions.width,
    height: BattleRoomGame.baseWindowDimensions.height,
  });
  const currentGame = useRef(lobbyUiState.currentGameRoom && new BattleRoomGame(lobbyUiState.currentGameRoom.gameName));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSizeRef = useRef<WidthAndHeight | null>(null);
  const gameWidthRatio = useRef(window.innerHeight * 0.6);

  useEffect(() => {
    setCanvasSize({
      height: window.innerHeight,
      width: gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
    });
    canvasSizeRef.current = {
      height: window.innerHeight,
      width: gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
    };
    function handleResize() {
      gameWidthRatio.current = window.innerHeight * 0.6;
      setCanvasSize({
        height: window.innerHeight,
        width: gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
      });
      canvasSizeRef.current = {
        height: window.innerHeight,
        width: gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
      };
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCanvasSize]);

  return (
    <div className="battle-room-canvas-holder" onContextMenu={(e) => e.preventDefault()}>
      {currentGame.current && <GameListener socket={socket} game={currentGame.current} canvasRef={canvasRef} canvasSizeRef={canvasSizeRef} />}
      {(currentGame.current && currentGameRoom?.gameStatus === GameStatus.IN_PROGRESS) || currentGameRoom?.gameStatus === GameStatus.ENDING ? (
        <CanvasWithInputListeners canvasSize={canvasSize} canvasRef={canvasRef} currentGame={currentGame.current!} socket={socket} />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default BattleRoomGameInstance;
