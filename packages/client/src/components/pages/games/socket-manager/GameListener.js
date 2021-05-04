import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as gameUiActions from "../../../../store/actions/game-ui";
import cloneDeep from 'lodash.clonedeep'
// import lagGenerator from '../util-functions/lagGenerator';


const GameListener = ({ socket, gameUi, currentGameData, lastServerGameUpdate, setLastServerGameUpdate, gameStateQueue, gameOverCountdownText }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (!socket) return;
    socket.on("serverInitsGame", () => {
      setLastServerGameUpdate(cloneDeep(currentGameData.current.gameState))
    });
    socket.on("bufferTickFromServer", async (data) => {
      // await lagGenerator(1000)
      const decodedPacket = JSON.parse(data)
      let newUpdate = lastServerGameUpdate;
      Object.keys(decodedPacket).forEach((key) => {
        newUpdate[key] = cloneDeep(decodedPacket[key]);
      });
      setLastServerGameUpdate(newUpdate);
      gameStateQueue.current.push(newUpdate);
    });
    socket.on("serverSendsWinnerInfo", (data) => {
      dispatch(gameUiActions.setGameWinner(data))
    });
    socket.on("gameEndingCountdown", (data) => {
      gameOverCountdownText.current = data
      // if (data === 0) dispatch(gameUiActions.clearGameUiData())
    })
    return () => {
      socket.off("serverInitsGame");
      socket.off("tickFromServer");
      socket.off("bufferTickFromServer");
      socket.off("gameEndingCountdown");
      socket.off("serverSendsWinnerInfo");
    };
  }, [socket, dispatch, gameStateQueue, currentGameData, gameOverCountdownText, gameUi.currentGameName, setLastServerGameUpdate, lastServerGameUpdate]);

  return <div />
}

export default GameListener
