import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { handleKeypress } from "./user-input-listeners/userInputListeners";
import { draw } from "./canvasMain";

const BattleRoomGameInstance = ({ socket }) => {
  const [mouseData, setMouseData] = useState({
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
  });

  const canvasRef = useRef();

  useEffect(() => {
    window.addEventListener("keydown", handleKeypress);
    return () => {
      window.removeEventListener("keydown", handleKeypress);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    console.log(mouseData.leftPressedAtX);
    const drawInterval = setInterval(() => {
      draw(context, mouseData);
    }, 33);
    return () => clearInterval(drawInterval);
  }, [canvasRef, mouseData]);

  return (
    <div
      className="battle-room-canvas-holder"
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        height={750}
        width={450}
        className="battle-room-canvas"
        ref={canvasRef}
        onMouseDown={(e) => {
          console.log("mousedown");
          console.log(e);
          setMouseData({
            ...mouseData,
            leftPressedAtX: e.nativeEvent.offsetX,
            leftPressedAtY: e.nativeEvent.offsetY,
          });
        }}
        onMouseUp={(e) => {
          console.log("mouseup");
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseMove={(e) => {
          if (!mouseData.leftCurrentlyPressed) return;
          console.log("mousemove");
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
