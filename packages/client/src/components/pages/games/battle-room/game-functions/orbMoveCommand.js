export default ({ headingX, headingY, commonEventHandlerProps, isPartOfSelectAndMoveCommand }) => {
  const { socket, currentGameData, commandQueue, playerDesignation } = commonEventHandlerProps
  const playerOrbs = currentGameData.gameState.orbs[playerDesignation + "Orbs"]
  playerOrbs.forEach((orb) => {
    if (orb.isSelected) {
      orb.heading.xPos = headingX;
      orb.heading.yPos = headingY;
    }
  });
  console.log(headingX, headingY)
  console.log(playerOrbs)

  const newOrbHeadings = playerOrbs.map((orb) => {
    console.log(orb.heading)
    return { heading: orb.heading }
  });

  const data = { newOrbHeadings, commandPositionInQueue: ++commandQueue.counter };
  if (!isPartOfSelectAndMoveCommand) {
    commandQueue.queue.push({
      type: "orbMove",
      data,
    });
    socket.emit("clientSubmitsMoveCommand", data);
  }

  return data
};
