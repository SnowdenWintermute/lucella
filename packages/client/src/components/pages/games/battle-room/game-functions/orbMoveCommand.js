export default ({ headingX, headingY, commonEventHandlerProps, isPartOfSelectAndMoveCommand }) => {
  const { socket, currentGameData, commandQueue, playerDesignation } = commonEventHandlerProps
  const playerOrbs = currentGameData.gameState.orbs[playerDesignation + "Orbs"]
  playerOrbs.forEach((orb) => {
    if (orb.isSelected) {
      orb.heading.xPos = Math.round(headingX);
      orb.heading.yPos = Math.round(headingY);
    }
  });

  const newOrbHeadings = playerOrbs.map((orb) => {
    return { heading: orb.heading }
  });

  const data = { newOrbHeadings, commandPositionInQueue: ++commandQueue.counter };
  if (!isPartOfSelectAndMoveCommand) {
    commandQueue.queue.push({
      type: "orbMove",
      data,
      timeAdded: Date.now()
    });
    socket.emit("clientSubmitsMoveCommand", data);
  } else return data
};