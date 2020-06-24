import orbMoveCommand from "./orbMoveCommand";

const selectOrbAndIssueMoveCommand = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  keyPressed,
  mouseData,
}) => {
  console.log(playersInGame);
  if (!currentGameData) return;
  let playerOrbsToSelect;
  if (clientPlayer.uuid === playersInGame.host.uuid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentGameData.orbs[playerOrbsToSelect].forEach((orb) => {
    orb.isSelected = false;
    console.log("orb unselected " + orb.num);
  });
  if (
    currentGameData.orbs[playerOrbsToSelect][keyPressed - 1].owner ===
    clientPlayer.uuid
  ) {
    console.log("orb " + keyPressed - 1 + " selected");
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
    playersInGame,
    headingX: (currentGameData.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.xPos = mouseData.xPos),
    headingY: (currentGameData.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.yPos = mouseData.yPos),
  });
};

export default selectOrbAndIssueMoveCommand;
