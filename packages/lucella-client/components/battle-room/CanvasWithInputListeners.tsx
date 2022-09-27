import { WidthAndHeight } from "../../../common/src/types";
import React, { useCallback, useEffect } from "react";
import mouseDownHandler from "./user-input-handlers/mouseDownHandler";
import mouseEnterHandler from "./user-input-handlers/mouseEnterHandler";
import mouseLeaveHandler from "./user-input-handlers/mouseLeaveHandler";
import mouseMoveHandler from "./user-input-handlers/mouseMoveHandler";
import mouseUpHandler from "./user-input-handlers/mouseUpHandler";
import touchMoveHandler from "./user-input-handlers/touchMoveHandler";
import touchStartHandler from "./user-input-handlers/touchStartHandler";
import touchEndHandler from "./user-input-handlers/touchEndHandler";
import { BattleRoomGame } from "../../../common/src/classes/BattleRoomGame";
import { PlayerRole } from "../../../common/src/enums";
import keyPressHandler from "./user-input-handlers/keyPressHandler";

interface Props {
  canvasSize: WidthAndHeight;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentGame: BattleRoomGame;
  playerRole: PlayerRole | null;
}

const Canvas = (props: Props) => {
  const { canvasSize, canvasRef, currentGame, playerRole } = props;

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    keyPressHandler(e, currentGame, playerRole);
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
        touchMoveHandler(e, currentGame);
      }}
      onTouchEnd={(e) => {
        touchEndHandler(e, currentGame, canvasSize);
      }}
      onMouseDown={(e) => {
        mouseDownHandler(e, currentGame.mouseData);
      }}
      onMouseUp={(e) => {
        mouseUpHandler(e, currentGame);
      }}
      onMouseMove={(e) => {
        mouseMoveHandler(e, currentGame);
      }}
      onMouseLeave={() => {
        mouseLeaveHandler(currentGame);
      }}
      onMouseEnter={() => {
        mouseEnterHandler(currentGame.mouseData);
      }}
    />
  );
};

export default Canvas;
