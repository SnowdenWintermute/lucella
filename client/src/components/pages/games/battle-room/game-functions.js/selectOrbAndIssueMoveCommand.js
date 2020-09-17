import orbMoveCommand from "./orbMoveCommand";

const selectOrbAndIssueMoveCommand = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  keyPressed,
  mouseData,
  commandQueue,
}) => {
  if (!currentGameData) return;
  let playerOrbsToSelect;
  if (clientPlayer.uuid === playersInGame.host.uuid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentGameData.gameState.orbs[playerOrbsToSelect].forEach((orb) => {
    orb.isSelected = false;
  });
  if (
    currentGameData.gameState.orbs[playerOrbsToSelect][keyPressed - 1].owner ===
    clientPlayer.uuid
  ) {
    currentGameData.gameState.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].isSelected = true;
    currentGameData.gameState.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.xPos = mouseData.xPos;
    currentGameData.gameState.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.yPos = mouseData.yPos;
  }

  // update client log of issued commands
  commandQueue.counter++;
  const commandPositionInQueue = commandQueue.counter;
  commandQueue.queue.push({
    type: "orbSelect",
    data: {
      gameName: currentGameData.gameName,
      ownerOfOrbs: playerOrbsToSelect,
      orbsToBeUpdated: currentGameData.gameState.orbs[playerOrbsToSelect],
      commandPositionInQueue,
    },
  });

  socket.emit("clientSendsOrbSelections", {
    gameName: currentGameData.gameName,
    ownerOfOrbs: playerOrbsToSelect,
    orbsToBeUpdated: currentGameData.gameState.orbs[playerOrbsToSelect],
    commandPositionInQueue,
  });
  
  orbMoveCommand({
    socket,
    currentGameData,
    clientPlayer,
    playersInGame,
    headingX: (currentGameData.gameState.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.xPos = mouseData.xPos),
    headingY: (currentGameData.gameState.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.yPos = mouseData.yPos),
    commandQueue,
  });
};

export default selectOrbAndIssueMoveCommand;
