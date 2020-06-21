import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  handleKeypress,
  mouseUpHandler,
  mouseDownHandler,
  mouseMoveHandler,
} from "./user-input-listeners/userInputListeners";
import { draw } from "./canvasMain";

const BattleRoomGameInstance = ({ socket }) => {
  const mouseData = {
    leftPressedAtX: null,
    leftPressedAtY: null,
    leftReleasedAtX: null,
    leftReleasedAtY: null,
    leftCurrentlyPressed: false,
    rightReleasedAtX: null,
    rightReleasedAtY: null,
    xPos: 0,
    yPos: 0,
    mouseOnScreen: null,
  };
  const [currentGameData, setCurrentGameData] = useState(null);
  const [clientPlayer, setClientPlayer] = useState([]);
  const [canvasInfo, setCanvasInfo] = useState({
    width: 450,
    height: 750,
  });

  const canvasRef = useRef();

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  const onKeyPress = (e) => {
    handleKeypress({
      e,
      socket,
      currentGameData,
      clientPlayer,
      mouseData,
    });
  };

  // draw interval
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    console.log(mouseData.leftPressedAtX);
    const drawInterval = setInterval(() => {
      if (!currentGameData) return;
      draw({ context, mouseData, clientPlayer, currentGameData, canvasInfo });
    }, 33);
    return () => clearInterval(drawInterval);
  }, [canvasRef, mouseData, currentGameData]);

  return (
    <div
      className="battle-room-canvas-holder"
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        height={canvasInfo.height}
        width={canvasInfo.width}
        className="battle-room-canvas"
        ref={canvasRef}
        onMouseDown={(e) => {
          mouseDownHandler({ e, mouseData });
        }}
        onMouseUp={(e) => {
          mouseUpHandler({
            e,
            socket,
            currentGameData,
            clientPlayer,
            mouseData,
          });
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseMove={(e) => {
          mouseMoveHandler({ e, mouseData });
        }}
        onMouseLeave={(e) => {
          console.log("mouseleave");
        }}
        onMouseEnter={(e) => {
          console.log("mouseenter");
        }}
      />
    </div>
  );
};

BattleRoomGameInstance.propTypes = {
  socket: PropTypes.object,
};

export default BattleRoomGameInstance;
