const orbMoveCommand = ({
  socket,
  currentGameData,
  clientPlayer,
  headingX,
  headingY,
}) => {
  let hostOrChallenger;
  if (currentGameData.players.host.uid == clientPlayer.uid)
    hostOrChallenger = "hostOrbs";
  if (currentGameData.players.challenger.uid == clientPlayer.uid)
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
