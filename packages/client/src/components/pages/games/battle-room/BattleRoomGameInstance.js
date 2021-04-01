import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  handleKeypress,
  mouseUpHandler,
  mouseDownHandler,
  mouseMoveHandler,
  mouseLeaveHandler,
  mouseEnterHandler,
  touchStartHandler,
  touchMoveHandler,
  touchEndHandler,
} from "./user-input-listeners/userInputListeners";
import draw from "./canvas-functions/canvasMain";
import createGamePhysicsInterval from "./game-functions/clientPrediction/createGamePhysicsInterval";
import MouseData from "./classes/MouseData";
import GameListener from "../socket-manager/GameListener";

const BattleRoomGameInstance = ({ socket }) => {
  const mouseData = new MouseData()
  const [lastServerGameUpdate, setLastServerGameUpdate] = useState({});
  const numberOfLastServerUpdateApplied = useRef(null);
  const currentGameData = useRef();
  const commandQueue = useRef({ counter: 0, queue: [] });
  const gameStateQueue = useRef([]);
  const gameUi = useSelector((state) => state.gameUi);
  const { playerDesignation, playersInGame, gameStatus, winner } = gameUi
  const [clientPlayer, setClientPlayer] = useState([]);
  const canvasRef = useRef();
  const [canvasInfo, setCanvasInfo] = useState({});
  const drawRef = useRef();
  const gameOverCountdownText = useRef();

  useEffect(() => {
    setClientPlayer(playersInGame[playerDesignation]);
  }, [playerDesignation, playersInGame]);

  useEffect(() => {
    const gameWidthRatio = window.innerHeight * 0.6;
    setCanvasInfo({
      height: window.innerHeight,
      width:
        gameWidthRatio > window.innerWidth ? window.innerWidth : gameWidthRatio,
    });
  }, [setCanvasInfo]);

  useEffect(() => {
    function handleResize() {
      const gameWidthRatio = window.innerHeight * 0.6;
      setCanvasInfo({
        height: window.innerHeight,
        width:
          gameWidthRatio > window.innerWidth
            ? window.innerWidth
            : gameWidthRatio,
      });
    }
    window.addEventListener("resize", handleResize);
  }, [setCanvasInfo]);

  // set up a ref to the current draw function so it's interval can have access to it having current proporties
  useEffect(() => {
    drawRef.current = function () {
      if (!currentGameData.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      draw({
        context,
        mouseData,
        clientPlayer,
        currentGameData: currentGameData.current,
        lastServerGameUpdate,
        canvasInfo,
        gameOverCountdownText: gameOverCountdownText.current,
        gameStatus,
        winner,
      });
    };
  });

  const onKeyPress = useCallback(
    (e) => {
      handleKeypress({
        e,
        socket,
        currentGameData: currentGameData.current,
        clientPlayer,
        playersInGame,
        mouseData,
        commandQueue: commandQueue.current,
      });
    },
    [socket, playersInGame, clientPlayer, mouseData, commandQueue]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [onKeyPress]);

  // physics interval
  useEffect(() => {
    const physicsInterval = createGamePhysicsInterval({
      lastServerGameUpdate,
      numberOfLastServerUpdateApplied: numberOfLastServerUpdateApplied.current,
      gameData: currentGameData.current,
      commandQueue: commandQueue.current,
      gameStateQueue: gameStateQueue.current,
      playerRole: playerDesignation,
    });
    return () => clearInterval(physicsInterval);
  }, [lastServerGameUpdate, commandQueue]);

  // draw interval
  useEffect(() => {
    function currentDrawFunction() {
      drawRef.current();
    }
    const drawInterval = setInterval(() => {
      currentDrawFunction();
    }, 33);
    return () => clearInterval(drawInterval);
  }, [drawRef]);

  return (
    <div
      className="battle-room-canvas-holder"
      onContextMenu={(e) => e.preventDefault()}
    >
      <GameListener
        socket={socket}
        currentGameData={currentGameData}
        lastServerGameUpdate={lastServerGameUpdate}
        setLastServerGameUpdate={setLastServerGameUpdate}
        gameStateQueue={gameStateQueue}
        gameOverCountdownText={gameOverCountdownText}
      />
      {currentGameData.current && <canvas
        height={canvasInfo.height}
        width={canvasInfo.width}
        className="battle-room-canvas"
        ref={canvasRef}
        onTouchStart={(e) => {
          mouseData.touchStartTime = touchStartHandler({
            e,
            canvasInfo,
            currentGameData: currentGameData.current,
            mouseData,
          });
        }}
        onTouchMove={(e) => {
          touchMoveHandler({
            e,
            canvasInfo,
            currentGameData: currentGameData.current,
            mouseData,
          });
        }}
        onTouchEnd={(e) => {
          touchEndHandler({
            e,
            canvasInfo,
            currentGameData: currentGameData.current,
            mouseData,
            socket,
            clientPlayer,
            playersInGame,
            commandQueue: commandQueue.current,
          });
        }}
        onMouseDown={(e) => {
          mouseDownHandler({
            e,
            mouseData,
            currentGameData: currentGameData.current,
            canvasInfo,
          });
        }}
        onMouseUp={(e) => {
          mouseUpHandler({
            e,
            socket,
            currentGameData: currentGameData.current,
            canvasInfo,
            clientPlayer,
            mouseData,
            playersInGame,
            commandQueue: commandQueue.current,
          });
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseMove={(e) => {
          mouseMoveHandler({
            e,
            mouseData,
            canvasInfo,
            currentGameData: currentGameData.current,
          });
        }}
        onMouseLeave={(e) => {
          mouseLeaveHandler({
            socket,
            currentGameData: currentGameData.current,
            canvasInfo,
            clientPlayer,
            playersInGame,
            mouseData,
            commandQueue: commandQueue.current,
          });
        }}
        onMouseEnter={(e) => {
          mouseEnterHandler({ mouseData });
        }}
      />}
    </div>
  );
};

BattleRoomGameInstance.propTypes = {
  socket: PropTypes.object,
};

export default BattleRoomGameInstance;
