import selectOrbIfAppropriate from './selectOrbIfAppropriate'

const selectOrbs = ({ startX, startY, currX, currY, commonEventHandlerProps }) => {
  const { socket, currentGameData, commandQueue, playerDesignation } = commonEventHandlerProps
  if (!currentGameData) return;
  if (!currentGameData.gameState) return;
  const playerOrbs = currentGameData.gameState.orbs[playerDesignation + "Orbs"]
  let stackedOrbHighestIndex;
  const selectionCoordinates = { startX, startY, currX, currY, }
  playerOrbs.forEach(orb => { selectOrbIfAppropriate(orb, selectionCoordinates, stackedOrbHighestIndex, playerOrbs) });
  const orbsToBeUpdated = playerOrbs.map((orb) => {
    return { num: orb.num, isSelected: orb.isSelected };
  });
  const data = {
    ownerOfOrbs: playerDesignation + "Orbs",
    orbsToBeUpdated,
    commandPositionInQueue: ++commandQueue.counter,
  }
  commandQueue.queue.push({ type: "orbSelect", data });
  socket.emit("clientSendsOrbSelections", data);
};

export default selectOrbs;
