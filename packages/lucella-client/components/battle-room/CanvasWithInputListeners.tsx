import { eventLimiterRate, WidthAndHeight, BattleRoomGame, PlayerRole } from "../../../common";
import React, { useCallback, useEffect } from "react";
import mouseDownHandler from "./user-input-handlers/mouseDownHandler";
import mouseEnterHandler from "./user-input-handlers/mouseEnterHandler";
import mouseLeaveHandler from "./user-input-handlers/mouseLeaveHandler";
import mouseMoveHandler from "./user-input-handlers/mouseMoveHandler";
import mouseUpHandler from "./user-input-handlers/mouseUpHandler";
import touchMoveHandler from "./user-input-handlers/touchMoveHandler";
import touchStartHandler from "./user-input-handlers/touchStartHandler";
import touchEndHandler from "./user-input-handlers/touchEndHandler";
import keyPressHandler from "./user-input-handlers/keyPressHandler";
import throttle from "../../utils/throttle";
import { Socket } from "socket.io-client";

interface Props {
  canvasSize: WidthAndHeight;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentGame: BattleRoomGame;
  socket: Socket;
}

const Canvas = (props: Props) => {
  const { canvasSize, canvasRef, currentGame, socket } = props;

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    throttle(eventLimiterRate, keyPressHandler(e, currentGame, socket));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [onKeyPress]);

  return (
    <canvas
      height={canvasSize.height}
      width={canvasSize.width}
      className="battle-room-canvas"
      ref={canvasRef}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={(e) => {
        touchStartHandler(e, canvasSize, currentGame);
      }}
      onTouchMove={(e) => {
        throttle(eventLimiterRate, touchMoveHandler(e, currentGame, canvasSize));
      }}
      onTouchEnd={(e) => {
        touchEndHandler(e, currentGame, canvasSize);
      }}
      onMouseDown={(e) => {
        mouseDownHandler(e, currentGame, socket);
      }}
      onMouseUp={(e) => {
        mouseUpHandler(e, currentGame, socket);
      }}
      onMouseMove={(e) => {
        throttle(eventLimiterRate, mouseMoveHandler(e, currentGame, canvasSize));
      }}
      onMouseLeave={() => {
        mouseLeaveHandler(currentGame, socket);
      }}
      onMouseEnter={() => {
        mouseEnterHandler(currentGame.mouseData);
      }}
    />
  );
};

export default Canvas;
