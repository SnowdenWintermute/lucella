import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as gameUiActions from "../../../../store/actions/game-ui";
import cloneDeep from 'lodash.clonedeep'
import { convertBufferToGameStateObject } from "../battle-room/game-functions/convertBufferToGameStateObject";


const GameListener = ({ socket, currentGameData, lastServerGameUpdate, setLastServerGameUpdate, gameStateQueue, gameOverCountdownText }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket) return;
    socket.on("serverInitsGame", (data) => {
      currentGameData.current = data; // do I need to cloneDeep this one?
      setLastServerGameUpdate(cloneDeep(data));
    });
    socket.on("bufferTickFromServer", (data) => {
      // sync client orbs to server positions, then
      //    calculate client orb positions based on time the most recently processed server command was issued by client,
      //    plus all commands and collision events not yet processed.
      // add opponent orb movements to a queue for interpolating them 
      // removeOldCommandsAndEvents({gameData, eventQueue})
      // syncClientOrbs({gameData, decodedPacket, playerRole })
      // predictClientOrbs({gameData, eventQueue, playerRole})
      // queueOpponentOrbMovements({})
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
