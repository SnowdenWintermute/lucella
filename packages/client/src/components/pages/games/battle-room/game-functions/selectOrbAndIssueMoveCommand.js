import orbMoveCommand from "./orbMoveCommand";

export default async ({ keyPressed, commonEventHandlerProps }) => {
  const { socket, currentGameData, clientPlayer, mouseData, commandQueue, playerDesignation } = commonEventHandlerProps
  if (!currentGameData) return;
  currentGameData.gameState.orbs[playerDesignation + "Orbs"].forEach((orb) => { orb.isSelected = false });

  const selectedOrb = currentGameData.gameState.orbs[playerDesignation + "Orbs"][keyPressed - 1]
  if (selectedOrb.owner === clientPlayer.uuid) {
    selectedOrb.isSelected = true;
    selectedOrb.heading.xPos = mouseData.xPos;
    selectedOrb.heading.yPos = mouseData.yPos;
  }

  const orbsToBeUpdated = currentGameData.gameState.orbs[playerDesignation + "Orbs"]
    .map((orb) => {
      return { num: orb.num, isSelected: orb.isSelected };
    });


  const selectCommandData = {
    ownerOfOrbs: playerDesignation + "Orbs",
    orbsToBeUpdated,
  };

  const moveCommandData = orbMoveCommand({
    isPartOfSelectAndMoveCommand: true,
    headingX: (selectedOrb.heading.xPos = mouseData.xPos),
    headingY: (selectedOrb.heading.yPos = mouseData.yPos),
    commonEventHandlerProps
  });

  const data = { selectCommandData, moveCommandData, commandPositionInQueue: ++commandQueue.counter };
  commandQueue.queue.push({ type: "selectAndMoveOrb", data });
  socket.emit("selectAndMoveOrb", data);
};
