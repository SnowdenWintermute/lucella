const selectOrbs = ({
  socket,
  clientPlayer,
  currentGameData,
  playersInGame,
  startX,
  startY,
  currX,
  currY,
  commandQueue,
}) => {
  if (!currentGameData) return;
  let playerOrbsToSelect;
  let stackedOrbHighestIndex;
  if (clientPlayer.uuid === playersInGame.host.uuid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentGameData.gameState.orbs[playerOrbsToSelect].forEach((orb, i) => {
    if (
      // clicking directly on, select only highest index stacked orb
      currX + orb.radius >= orb.xPos &&
      currX - orb.radius <= orb.xPos &&
      currY + orb.radius >= orb.yPos &&
      currY - orb.radius <= orb.yPos &&
      // not drawing a small ass box with the end corner on the stack of orbs
      Math.abs(currX - startX) < 3 &&
      Math.abs(currY - startY) < 3 &&
      orb.owner === clientPlayer.uuid
    ) {
      if (!stackedOrbHighestIndex) {
        stackedOrbHighestIndex = orb.num;
        orb.isSelected = true;
      } else if (orb.num > stackedOrbHighestIndex) {
        currentGameData.gameState.orbs[playerOrbsToSelect].forEach((orb) => {
          orb.isSelected = false;
          console.log("orb unselected " + orb.num);
        });
        stackedOrbHighestIndex = orb.num;
        orb.isSelected = true;
      }
    } else if (
      // drawing box
      ((orb.xPos + orb.radius >= startX &&
        orb.xPos - orb.radius <= currX &&
        orb.yPos + orb.radius >= startY &&
        orb.yPos - orb.radius <= currY) ||
        (orb.xPos - orb.radius <= startX &&
          orb.xPos + orb.radius >= currX &&
          orb.yPos - orb.radius <= startY &&
          orb.yPos + orb.radius >= currY) ||
        (orb.xPos - orb.radius <= startX &&
          orb.xPos + orb.radius >= currX &&
          orb.yPos + orb.radius >= startY &&
          orb.yPos - orb.radius <= currY) ||
        (orb.xPos + orb.radius >= startX &&
          orb.xPos - orb.radius <= currX &&
          orb.yPos - orb.radius <= startY &&
          orb.yPos + orb.radius >= currY)) &&
      orb.owner === clientPlayer.uuid
    ) {
      orb.isSelected = true;
    } else {
      orb.isSelected = false;
    }
  });

  const orbsToBeUpdated = currentGameData.gameState.orbs[
    playerOrbsToSelect
  ].map((orb) => {
    return { num: orb.num, isSelected: orb.isSelected };
  });

  console.log(orbsToBeUpdated);
  // update client log of issued commands
  commandQueue.counter++;
  const commandPositionInQueue = commandQueue.counter;
  commandQueue.queue.push({
    type: "orbSelect",
    data: {
      ownerOfOrbs: playerOrbsToSelect,
      orbsToBeUpdated,
      commandPositionInQueue,
    },
  });

  socket.emit("clientSendsOrbSelections", {
    ownerOfOrbs: playerOrbsToSelect,
    orbsToBeUpdated,
    commandPositionInQueue,
  });
};

export default selectOrbs;
