const orbMoveCommand = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  headingX,
  headingY,
}) => {
  let hostOrChallenger;
  if (playersInGame.host.uuid === clientPlayer.uuid)
    hostOrChallenger = "hostOrbs";
  if (playersInGame.challenger.uuid === clientPlayer.uuid)
    hostOrChallenger = "challengerOrbs";
  currentGameData.orbs[hostOrChallenger].forEach((orb) => {
    if (orb.isSelected) {
      orb.heading.xPos = headingX;
      orb.heading.yPos = headingY;
    }
  });

  const dataForServer = {
    orbsClientWantsToMove: currentGameData.orbs[hostOrChallenger],
    gameName: currentGameData.gameName,
  };
  socket.emit("clientSubmitsMoveCommand", dataForServer);
};

export default orbMoveCommand;
