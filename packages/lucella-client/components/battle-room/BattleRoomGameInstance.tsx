import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux";
import draw from "./canvas-functions/canvasMain";
import { createGameInterval } from "./game-functions/createGameInterval";
import GameListener from "../socket-manager/GameListener";
import { BattleRoomGame } from "../../../common";
import { Socket } from "socket.io-client";
import { WidthAndHeight } from "../../../common";
import CanvasWithInputListeners from "./CanvasWithInputListeners";
import { GameStatus } from "../../../common";

interface Props {
  socket: Socket;
}

const BattleRoomGameInstance = (props: Props) => {
  const { socket } = props;
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { playerRole, currentGameRoom } = lobbyUiState;
  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: BattleRoomGame.baseWindowDimensions.width,
    height: BattleRoomGame.baseWindowDimensions.height,
  });
  const currentGame = useRef(lobbyUiState.currentGameRoom && new BattleRoomGame(lobbyUiState.currentGameRoom.gameName));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<() => void>();
  const gameWidthRatio = useRef(window.innerHeight * 0.6);

  useEffect(() => {
    setCanvasSize({
      height: window.innerHeight,
      width: gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
    });
    function handleResize() {
      gameWidthRatio.current = window.innerHeight * 0.6;
      setCanvasSize({
        height: window.innerHeight,
        width: gameWidthRatio.current > window.innerWidth ? window.innerWidth : gameWidthRatio.current,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCanvasSize]);

  // something to make canvas work in react
  useEffect(() => {
    drawRef.current = function () {
      const canvas = canvasRef.current;
      if (!currentGame.current) return;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      context && draw(context, canvasSize, playerRole, currentGame.current, currentGameRoom!.gameStatus);
    };
  });

  useEffect(() => {
    function currentDrawFunction() {
      drawRef.current ? drawRef.current() : null;
    }
    if (!currentGame.current) return;
    const gameInterval = createGameInterval(currentDrawFunction, currentGame.current);
    return () => clearInterval(gameInterval);
  }, [socket, currentGame]);

  return (
    <div className="battle-room-canvas-holder" onContextMenu={(e) => e.preventDefault()}>
      {currentGame.current && <GameListener socket={socket} currentGame={currentGame.current} />}
      {(currentGame.current && currentGameRoom?.gameStatus === GameStatus.IN_PROGRESS) ||
      currentGameRoom?.gameStatus === GameStatus.ENDING ? (
        <CanvasWithInputListeners
          canvasSize={canvasSize}
          canvasRef={canvasRef}
          currentGame={currentGame.current!}
          playerRole={playerRole}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default BattleRoomGameInstance;
