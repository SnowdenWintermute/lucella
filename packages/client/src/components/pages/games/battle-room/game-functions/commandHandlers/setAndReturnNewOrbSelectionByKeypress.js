module.exports = ({ keyPressed, commonEventHandlerProps }) => {
  const { currentGameData, mouseData, playerDesignation } = commonEventHandlerProps
  if (!currentGameData.current) return;
  const playerOrbs = currentGameData.current.gameState.orbs[playerDesignation]
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

  const data = {
    ownerOfOrbs: playerDesignation,
    orbsToBeUpdated,
  }

  return data;
};
