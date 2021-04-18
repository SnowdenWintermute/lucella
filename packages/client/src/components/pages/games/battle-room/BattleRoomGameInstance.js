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
import createGameInterval from "./game-functions/createGameInterval";
import MouseData from "./classes/MouseData";
import GameListener from "../socket-manager/GameListener";
import fitCanvasToScreen from "./canvas-functions/fitCanvasToScreen";
import GameData from "@lucella/common/battleRoomGame/classes/GameData";
import cloneDeep from 'lodash.clonedeep'

const BattleRoomGameInstance = ({ socket }) => {
  const gameUi = useSelector((state) => state.gameUi);
  const { playerRole, playersInGame, gameStatus, winner, currentGameName } = gameUi
  const mouseData = new MouseData()
  //
  const [lastServerGameUpdate, setLastServerGameUpdate] = useState({});
  const numberOfLastUpdateApplied = useRef(0);
  const numberOfLastCommandIssued = useRef(0)
  const eventQueue = useRef([]);
  const currentGameData = useRef();
  const gameStateQueue = useRef([]); // opponent orb pos queue
  //
  const [clientPlayer, setClientPlayer] = useState({});
  const [canvasSize, setCanvasSize] = useState({});
  const canvasRef = useRef();
  const drawRef = useRef();
  const gameOverCountdownText = useRef();
  const gameWidthRatio = useRef(window.innerHeight * 0.6)

  useEffect(() => { setClientPlayer(playersInGame[playerRole]) }, [playerRole, playersInGame]);
  useEffect(() => {
    if ((gameStatus === "ending" || gameStatus === "inProgress") && !currentGameData.current) {
      console.log("creating new blank GameData")
      currentGameData.current = new GameData({ gameName: currentGameName });
      setLastServerGameUpdate(cloneDeep(currentGameData.current));
    }
  }, [currentGameName, gameStatus])

  useEffect(() => {
    fitCanvasToScreen({ window, setCanvasSize, gameWidthRatio })
    function handleResize() { fitCanvasToScreen({ window, setCanvasSize, gameWidthRatio }) }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize)
  }, [setCanvasSize, gameWidthRatio]);

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
        playerRole,
        currentGameData: currentGameData.current,
        lastServerGameUpdate,
        canvasSize,
        gameOverCountdownText: gameOverCountdownText.current,
        gameStatus,
        winner,
      });
    };
  });

  const commonEventHandlerProps = {
    socket,
    canvasSize,
    currentGameData,
    mouseData,
    clientPlayer,
    playersInGame,
    eventQueue,
    numberOfLastCommandIssued,
    playerRole
  }

  useEffect(() => {
    function currentDrawFunction() { drawRef.current() }
    const gameInterval = createGameInterval({
      currentDrawFunction,
      lastServerGameUpdate,
      numberOfLastUpdateApplied,
      gameData: currentGameData,
      eventQueue,
      gameStateQueue: gameStateQueue.current,
      playerRole,
      commonEventHandlerProps
    });
    return () => clearInterval(gameInterval);
  }, [socket, lastServerGameUpdate, eventQueue, playerRole, commonEventHandlerProps]);

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
        gameUi={gameUi}
        currentGameData={currentGameData}
        lastServerGameUpdate={lastServerGameUpdate}
        setLastServerGameUpdate={setLastServerGameUpdate}
        gameStateQueue={gameStateQueue}
        gameOverCountdownText={gameOverCountdownText}
      />
      {currentGameData.current ? <canvas
        height={canvasSize.height}
        width={canvasSize.width}
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
