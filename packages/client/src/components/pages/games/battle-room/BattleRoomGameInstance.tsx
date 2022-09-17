import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import mouseEnterHandler from "./user-input-handlers/mouseEnterHandler";
import mouseLeaveHandler from "./user-input-handlers/mouseLeaveHandler";
import mouseMoveHandler from "./user-input-handlers/mouseMoveHandler";
import mouseDownHandler from "./user-input-handlers/mouseDownHandler";
import mouseUpHandler from "./user-input-handlers/mouseUpHandler";
import keyPressHandler from "./user-input-handlers/keyPressHandler";
import touchMoveHandler from "./user-input-handlers/touchMoveHandler";
import touchStartHandler from "./user-input-handlers/touchStartHandler";
import touchEndHandler from "./user-input-handlers/touchEndHandler";
import draw from "./canvas-functions/canvasMain";
import { createGameInterval } from "./game-functions/createGameInterval";
import GameListener from "../socket-manager/GameListener";
import fitCanvasToScreen from "./canvas-functions/fitCanvasToScreen";
import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { Socket } from "socket.io-client";
import { WidthAndHeight } from "@lucella/common/battleRoomGame/types";

interface Props {
  socket: Socket;
}

const BattleRoomGameInstance = (props: Props) => {
  const { socket } = props;
  const gameUi = useSelector((state) => state.gameUi);
  const { playerRole, playersInGame, gameStatus, winner } = gameUi;
  const [canvasSize, setCanvasSize] = useState<WidthAndHeight>({
    width: BattleRoomGame.baseWindowDimensions.width,
    height: BattleRoomGame.baseWindowDimensions.height,
  });
  const gameWidthRatio = useRef(window.innerHeight * 0.6);
  const currentGame = useRef(new BattleRoomGame(gameUi.currentGameName));
  const canvasRef = useRef<HTMLCanvasElement>();
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
    const gameInterval = createGameInterval(currentDrawFunction, currentGame);
    return () => clearInterval(gameInterval);
  }, [socket, currentGame]);

  const onKeyPress = useCallback(
    (e) => {
      keyPressHandler({ e, commonEventHandlerProps });
    },
    [commonEventHandlerProps]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [onKeyPress]);

  return (
    <div className="battle-room-canvas-holder" onContextMenu={(e) => e.preventDefault()}>
      <GameListener socket={socket} gameUi={gameUi} currentGame={currentGame.current} />
      {gameStatus === "inProgress" || gameStatus === "ending" ? (
        <canvas
          height={canvasSize.height}
          width={canvasSize.width}
          className="battle-room-canvas"
          ref={canvasRef}
          onTouchStart={(e) => {
            touchStartHandler({ e, commonEventHandlerProps });
          }}
          onTouchMove={(e) => {
            touchMoveHandler({ e, commonEventHandlerProps });
          }}
          onTouchEnd={(e) => {
            touchEndHandler({ e, commonEventHandlerProps });
          }}
          onMouseDown={(e) => {
            mouseDownHandler({ e, mouseData });
          }}
          onMouseUp={(e) => {
            mouseUpHandler({ e, commonEventHandlerProps });
          }}
          onContextMenu={(e) => e.preventDefault()}
          onMouseMove={(e) => {
            mouseMoveHandler({ e, commonEventHandlerProps });
          }}
          onMouseLeave={() => {
            mouseLeaveHandler({ commonEventHandlerProps });
          }}
          onMouseEnter={() => {
            mouseEnterHandler({ mouseData });
          }}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

BattleRoomGameInstance.propTypes = {
  socket: PropTypes.object,
};

export default BattleRoomGameInstance;
