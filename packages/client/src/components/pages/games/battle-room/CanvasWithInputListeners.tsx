import { WidthAndHeight } from "@lucella/common/battleRoomGame/types";
import React, { useCallback, useEffect } from "react";
import mouseDownHandler from "./user-input-handlers/mouseDownHandler";
import mouseEnterHandler from "./user-input-handlers/mouseEnterHandler";
import mouseLeaveHandler from "./user-input-handlers/mouseLeaveHandler";
import mouseMoveHandler from "./user-input-handlers/mouseMoveHandler";
import mouseUpHandler from "./user-input-handlers/mouseUpHandler";
import touchMoveHandler from "./user-input-handlers/touchMoveHandler";
import touchStartHandler from "./user-input-handlers/touchStartHandler";
import touchEndHandler from "./user-input-handlers/touchEndHandler";
import { BattleRoomGame } from "@lucella/common/battleRoomGame/classes/BattleRoomGame";
import { PlayerRole } from "@lucella/common/battleRoomGame/enums";
import keyPressHandler from "./user-input-handlers/keyPressHandler";

interface Props {
  canvasSize: WidthAndHeight;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentGame: BattleRoomGame;
  playerRole: PlayerRole;
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
      onTouchStart={(e) => {
        touchStartHandler(e, canvasSize, currentGame);
      }}
      onTouchMove={(e) => {
        touchMoveHandler( e, currentGame );
      }}
      onTouchEnd={(e) => {
        touchEndHandler( e, currentGame );
      }}
      onMouseDown={(e) => {
        mouseDownHandler(e, mouseData );
      }}
      onMouseUp={(e) => {
        mouseUpHandler( e, currentGame );
      }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={(e) => {
        mouseMoveHandler( e, currentGame );
      }}
      onMouseLeave={() => {
        mouseLeaveHandler({ currentGame );
      }}
      onMouseEnter={() => {
        mouseEnterHandler({ mouseData });
      }}
    />
  );
};

export default Canvas;
