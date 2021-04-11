import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as gameUiActions from "../../../../store/actions/game-ui";
import cloneDeep from 'lodash.clonedeep'
import { convertBufferToGameStateObject } from "../battle-room/game-functions/convertBufferToGameStateObject";
const GameData = require("@lucella/common/battleRoomGame/classes/GameData")


const GameListener = ({ socket, gameUi, currentGameData, lastServerGameUpdate, setLastServerGameUpdate, gameStateQueue, gameOverCountdownText }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket) return;
    socket.on("serverInitsGame", () => {
      console.log("serverInitsGame")
      currentGameData.current = new GameData({ gameName: gameUi.currentGameName });
      setLastServerGameUpdate(cloneDeep(currentGameData.current));
    });
    socket.on("bufferTickFromServer", (data) => {
      // create new update
      if (!lastServerGameUpdate) return;
      const decodedPacket = convertBufferToGameStateObject({ data });
      let newUpdate = lastServerGameUpdate;
      Object.keys(decodedPacket).forEach((key) => {
        newUpdate[key] = cloneDeep(decodedPacket[key]);
      });
      setLastServerGameUpdate(newUpdate);
      gameStateQueue.current.push(newUpdate);
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

  return <div />
}

export default GameListener
