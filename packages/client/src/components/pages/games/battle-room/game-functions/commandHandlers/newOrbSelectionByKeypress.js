module.exports = ({ keyPressed, commonEventHandlerProps }) => {
  const { currentGameData, playerRole } = commonEventHandlerProps
  if (!currentGameData.current) return;
  const playerOrbs = currentGameData.current.gameState.orbs[playerRole]

  const orbsToBeUpdated = playerOrbs
    .map((orb, i) => {
      return { num: orb.num, isSelected: keyPressed - 1 === i };
    });

  const data = {
    ownerOfOrbs: playerRole,
    orbsToBeUpdated,
  }
  return data;
};
