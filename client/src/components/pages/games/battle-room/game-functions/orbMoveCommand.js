const orbMoveCommand = ({
  socket,
  currentGameData,
  clientPlayer,
  playersInGame,
  headingX,
  headingY,
  commandQueue,
}) => {
  let hostOrChallenger;
  if (playersInGame.host.uuid === clientPlayer.uuid)
    hostOrChallenger = "hostOrbs";
  if (playersInGame.challenger.uuid === clientPlayer.uuid)
    hostOrChallenger = "challengerOrbs";
  currentGameData.gameState.orbs[hostOrChallenger].forEach((orb) => {
    if (orb.isSelected) {
      orb.heading.xPos = headingX;
      orb.heading.yPos = headingY;
    }
  });

  // update client log of issued commands
  commandQueue.counter++;
  const commandPositionInQueue = commandQueue.counter;
  // only send new headings
  const newOrbHeadings = currentGameData.gameState.orbs[hostOrChallenger].map(
    (orb) => {
      const orbHeadingInfo = { heading: orb.heading };
      return orbHeadingInfo;
    }
  );
  const data = {
    newOrbHeadings,
    commandPositionInQueue,
  };
  commandQueue.queue.push({
    type: "orbMove",
    data,
  });

  return data;
};

export default orbMoveCommand;
