import orbMoveCommand from "./orbMoveCommand";

const selectOrbAndIssueMoveCommand = async ({
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

  const orbsToBeUpdated = currentGameData.gameState.orbs[
    playerOrbsToSelect
  ].map((orb) => {
    return { num: orb.num, isSelected: orb.isSelected };
  });

  // update client log of issued commands
  commandQueue.counter++;
  const commandPositionInQueue = commandQueue.counter;
  const selectCommandData = {
    ownerOfOrbs: playerOrbsToSelect,
    orbsToBeUpdated,
  };

  const moveCommandData = orbMoveCommand({
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
    isPartOfSelectAndMoveCommand: true,
  });

  const data = { selectCommandData, moveCommandData, commandPositionInQueue };

  commandQueue.queue.push({
    type: "selectAndMoveOrb",
    data,
  });

  socket.emit("selectAndMoveOrb", data);
};

export default selectOrbAndIssueMoveCommand;
