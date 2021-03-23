module.exports = ({ gameData, orbsToBeUpdated, playerRole }) => {
  gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
    orbsToBeUpdated.forEach((selectedOrb) => {
      if (selectedOrb.num === orb.num) orb.isSelected = selectedOrb.isSelected;
    });
  });
}