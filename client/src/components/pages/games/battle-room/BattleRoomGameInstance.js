import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  handleKeypress,
  mouseUpHandler,
  mouseDownHandler,
  mouseMoveHandler,
  mouseLeaveHandler,
  mouseEnterHandler,
} from "./user-input-listeners/userInputListeners";
import draw from "./canvasMain";
import * as gameUiActions from "../../../../store/actions/game-ui";
import createGamePhysicsInterval from "./game-functions/clientPrediction/createGamePhysicsInterval";
import cloneDeep from "lodash.clonedeep";
import { convertBufferToGameStateObject } from "./game-functions/convertBufferToGameStateObject";

const BattleRoomGameInstance = ({ socket }) => {
  const dispatch = useDispatch();
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
    mouseOnScreen: true,
  };
  let [lastServerGameUpdate, setLastServerGameUpdate] = useState({});
  const numberOfLastServerUpdateApplied = useRef(null);
  let currentGameData = useRef();
  let commandQueue = useRef({ counter: 0, queue: [] });
  let gameDataQueue = useRef([]);
  const playerDesignation = useSelector(
    (state) => state.gameUi.playerDesignation,
  );
  const playersInGame = useSelector((state) => state.gameUi.playersInGame);
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);
  const winner = useSelector((state) => state.gameUi.winner);
  const [clientPlayer, setClientPlayer] = useState([]);
  const canvasInfo = {
    width: 450,
    height: 750,
  };

  const canvasRef = useRef();
  const drawRef = useRef();
  const gameOverCountdownText = useRef();

  useEffect(() => {
    setClientPlayer(playersInGame[playerDesignation]);
  }, [playerDesignation, playersInGame]);

  useEffect(() => {
    if (!socket) return;
    socket.on("serverInitsGame", (data) => {
      console.log("gameInit");
      currentGameData.current = cloneDeep(data);
      setLastServerGameUpdate(cloneDeep(data));
    });
    socket.on("tickFromServer", (packet) => {
      if (!lastServerGameUpdate) return;
      let newUpdate = lastServerGameUpdate;
      Object.keys(packet).forEach((key) => {
        newUpdate[key] = cloneDeep(packet[key]);
        setLastServerGameUpdate(newUpdate);
      });
      gameDataQueue.current.push(newUpdate);
    });
    socket.on("bufferTickFromServer", (data) => {
      if (!currentGameData.current) return;
      if (!currentGameData.current.gameState) return;
      // console.log(currentGameData.gameState);
      const decodedPacket = convertBufferToGameStateObject({
        data,
        model: currentGameData.current.gameState,
      });
      // console.log(decodedPacket);
    });
    socket.on("serverSendsWinnerInfo", (data) => {
      dispatch(gameUiActions.setGameWinner(data));
    });
    socket.on("gameEndingCountdown", (data) => {
      return (gameOverCountdownText.current = data);
    });
    return () => {
      socket.off("serverInitsGame");
      socket.off("tickFromServer");
      socket.off("bufferTickFromServer");
      socket.off("gameEndingCountdown");
      socket.off("serverSendsWinnerInfo");
      dispatch(gameUiActions.clearGameUiData());
    };
  }, [socket, dispatch]);

  // set up a ref to the current draw function so it's interval can have access to it having current proporties
  useEffect(() => {
    drawRef.current = function () {
      if (!currentGameData.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      // if (!draw) return;
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
    [socket, playersInGame, clientPlayer, mouseData, commandQueue],
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
      gameDataQueue: gameDataQueue.current,
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
            currentGameData: currentGameData.current,
            clientPlayer,
            mouseData,
            playersInGame,
            commandQueue: commandQueue.current,
          });
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseMove={(e) => {
          mouseMoveHandler({ e, mouseData });
        }}
        onMouseLeave={(e) => {
          mouseLeaveHandler({
            socket,
            currentGameData: currentGameData.current,
            clientPlayer,
            playersInGame,
            mouseData,
            commandQueue: commandQueue.current,
          });
        }}
        onMouseEnter={(e) => {
          mouseEnterHandler({ mouseData });
        }}
      />
    </div>
  );
};

BattleRoomGameInstance.propTypes = {
  socket: PropTypes.object,
};

export default BattleRoomGameInstance;
