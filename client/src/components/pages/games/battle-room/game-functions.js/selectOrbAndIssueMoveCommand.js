import orbMoveCommand from "./orbMoveCommand";

const selectOrbAndIssueMoveCommand = ({
  socket,
  currentGameData,
  clientPlayer,
  keyPressed,
  mouseData,
}) => {
  if (!currentGameData) return;
  let playerOrbsToSelect;
  if (clientPlayer.uid == currentGameData.players.host.uid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentGameData.orbs[playerOrbsToSelect].forEach((orb) => {
    orb.isSelected = false;
    console.log("orb unselected " + orb.num);
  });
  if (
    currentGameData.orbs[playerOrbsToSelect][keyPressed - 1].owner ===
    clientPlayer.uid
  ) {
    currentGameData.orbs[playerOrbsToSelect][keyPressed - 1].isSelected = true;
    currentGameData.orbs[playerOrbsToSelect][keyPressed - 1].heading.xPos =
      mouseData.xPos;
    currentGameData.orbs[playerOrbsToSelect][keyPressed - 1].heading.yPos =
      mouseData.yPos;
  }
  socket.emit("clientSendsOrbSelections", {
    gameName: currentGameData.gameName,
    ownerOfOrbs: playerOrbsToSelect,
    orbsToBeUpdated: currentGameData.orbs[playerOrbsToSelect],
  });
  orbMoveCommand({
    socket,
    currentGameData,
    clientPlayer,
    headingX: (currentGameData.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.xPos = mouseData.xPos),
    headingY: (currentGameData.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.yPos = mouseData.yPos),
  });
};

export default selectOrbAndIssueMoveCommand;
