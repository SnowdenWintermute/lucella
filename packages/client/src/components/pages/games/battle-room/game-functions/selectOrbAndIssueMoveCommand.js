import orbMoveCommand from "./orbMoveCommand";

export default async ({ keyPressed, commonEventHandlerProps }) => {
  const { socket, currentGameData, mouseData, commandQueue, playerDesignation } = commonEventHandlerProps
  if (!currentGameData) return;
  const playerOrbs = currentGameData.gameState.orbs[playerDesignation]
  playerOrbs.forEach((orb) => { orb.isSelected = false });

  const selectedOrb = playerOrbs[keyPressed - 1]
  if (selectedOrb.owner === playerDesignation) {
    selectedOrb.isSelected = true;
    selectedOrb.heading.xPos = mouseData.xPos;
    selectedOrb.heading.yPos = mouseData.yPos;
  }

  const orbsToBeUpdated = playerOrbs
    .map((orb) => {
      return { num: orb.num, isSelected: orb.isSelected };
    });


  const selectCommandData = {
    ownerOfOrbs: playerDesignation,
    orbsToBeUpdated,
  };

  const moveCommandData = orbMoveCommand({
    isPartOfSelectAndMoveCommand: true,
    headingX: (selectedOrb.heading.xPos = mouseData.xPos),
    headingY: (selectedOrb.heading.yPos = mouseData.yPos),
    commonEventHandlerProps
  });

  const data = { selectCommandData, moveCommandData, commandPositionInQueue: ++commandQueue.counter };
  commandQueue.queue.push({ type: "selectAndMoveOrb", data, timeAdded: Date.now() });
  socket.emit("selectAndMoveOrb", data);
};
