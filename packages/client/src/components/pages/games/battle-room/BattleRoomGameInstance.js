import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import mouseEnterHandler from './user-input-handlers/mouseEnterHandler'
import mouseLeaveHandler from './user-input-handlers/mouseLeaveHandler'
import mouseMoveHandler from './user-input-handlers/mouseMoveHandler'
import mouseDownHandler from './user-input-handlers/mouseDownHandler'
import mouseUpHandler from './user-input-handlers/mouseUpHandler'
import keyPressHandler from './user-input-handlers/keyPressHandler'
import touchMoveHandler from './user-input-handlers/touchMoveHandler'
import touchStartHandler from './user-input-handlers/touchStartHandler'
import touchEndHandler from './user-input-handlers/touchEndHandler'
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
  const [numberOfFullGameDataRequests, setNumberOfFullGameDataRequests] = useState(0)

  useEffect(() => { setClientPlayer(playersInGame[playerDesignation]) }, [playerDesignation, playersInGame]);

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

  useEffect(() => {
    console.log("creating physics interval", currentGameData.current)
    if (!currentGameData.current || typeof currentGameData.current === 'undefined') {
      socket.emit("clientRequestsGameData")
      const newNumberOfFullGameDataRequests = numberOfFullGameDataRequests + 1
      setNumberOfFullGameDataRequests(newNumberOfFullGameDataRequests)
    }

    const physicsInterval = createGamePhysicsInterval({
      lastServerGameUpdate,
      numberOfLastServerUpdateApplied,
      gameData: currentGameData.current,
      commandQueue: commandQueue.current,
      gameStateQueue: gameStateQueue.current,
      playerRole: playerDesignation,
    });
    return () => clearInterval(physicsInterval);
  }, [socket, lastServerGameUpdate, commandQueue, playerDesignation, numberOfFullGameDataRequests]);

  useEffect(() => {
    function currentDrawFunction() { drawRef.current() }
    const drawInterval = setInterval(currentDrawFunction, 33);
    return () => clearInterval(drawInterval);
  }, [drawRef]);

  const commonEventHandlerProps = {
    socket,
    canvasInfo,
    currentGameData: currentGameData.current,
    mouseData,
    clientPlayer,
    playersInGame,
    commandQueue: commandQueue.current,
    playerDesignation
  }

  const onKeyPress = useCallback((e) => { keyPressHandler({ e, commonEventHandlerProps }) }, [commonEventHandlerProps]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => { window.removeEventListener("keydown", onKeyPress) };
  }, [onKeyPress]);

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
      {currentGameData.current ? <canvas
        height={canvasInfo.height}
        width={canvasInfo.width}
        className="battle-room-canvas"
        ref={canvasRef}
        onTouchStart={(e) => { touchStartHandler({ e, commonEventHandlerProps }) }}
        onTouchMove={(e) => { touchMoveHandler({ e, commonEventHandlerProps }) }}
        onTouchEnd={(e) => { touchEndHandler({ e, commonEventHandlerProps }) }}
        onMouseDown={(e) => { mouseDownHandler({ e, mouseData }) }}
        onMouseUp={(e) => { mouseUpHandler({ e, commonEventHandlerProps }) }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseMove={(e) => { mouseMoveHandler({ e, commonEventHandlerProps }) }}
        onMouseLeave={() => { mouseLeaveHandler({ commonEventHandlerProps }) }}
        onMouseEnter={() => { mouseEnterHandler({ mouseData }) }}
      /> : "Loading..."}
    </div>
  );
};

BattleRoomGameInstance.propTypes = {
  socket: PropTypes.object,
};

export default BattleRoomGameInstance;
