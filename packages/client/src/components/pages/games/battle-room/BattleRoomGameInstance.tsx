import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import draw from "./canvas-functions/canvasMain";
import { createGameInterval } from "./game-functions/createGameInterval";
import GameListener from "../socket-manager/GameListener";
import fitCanvasToScreen from "./canvas-functions/fitCanvasToScreen";
import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { Socket } from "socket.io-client";
import { WidthAndHeight } from "@lucella/common/battleRoomGame/types";
import CanvasWithInputListeners from "./CanvasWithInputListeners";
import { GameStatus } from "@lucella/common/battleRoomGame/enums";
import { RootState } from "../../../../store";

interface Props {
  socket: Socket;
}

const BattleRoomGameInstance = (props: Props) => {
  const { socket } = props;
  const gameUi = useSelector((state: RootState) => state.gameUi);
  const { playerRole, gameStatus } = gameUi;
  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: BattleRoomGame.baseWindowDimensions.width,
    height: BattleRoomGame.baseWindowDimensions.height,
  });
  const gameWidthRatio = useRef(window.innerHeight * 0.6);
  const currentGame = useRef(new BattleRoomGame(gameUi.currentGameName));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<() => void>();

  useEffect(() => {
    fitCanvasToScreen(window, setCanvasSize, gameWidthRatio.current);
    function handleResize() {
      gameWidthRatio.current = window.innerHeight * 0.6;
      fitCanvasToScreen(window, setCanvasSize, gameWidthRatio.current);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCanvasSize, gameWidthRatio]);

  // something to make canvas work in react
  useEffect(() => {
    drawRef.current = function () {
      const canvas = canvasRef.current;
      if (!currentGame.current) return;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      context && draw(context, canvasSize, playerRole, currentGame.current, gameStatus);
    };
  });

  useEffect(() => {
    function currentDrawFunction() {
      drawRef.current ? drawRef.current() : null;
    }
    const gameInterval = createGameInterval(currentDrawFunction, currentGame.current);
    return () => clearInterval(gameInterval);
  }, [socket, currentGame]);

  return (
    <div className="battle-room-canvas-holder" onContextMenu={(e) => e.preventDefault()}>
      <GameListener socket={socket} currentGame={currentGame.current} />
      {gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING ? (
        <CanvasWithInputListeners
          canvasSize={canvasSize}
          canvasRef={canvasRef}
          currentGame={currentGame.current}
          playerRole={playerRole}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default BattleRoomGameInstance;
