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
  console.log(newOrbHeadings);
  const data = {
    newOrbHeadings,
    commandPositionInQueue,
  };
  commandQueue.queue.push({
    type: "orbMove",
    data,
  });
  console.log(commandQueue);

  socket.emit("clientSubmitsMoveCommand", data);

  // client side prediction of own orbs
  // 1. store the sent command [{number: 0, data:{orbsClientWantsToMove: }}]
  // 2. discard any old commands already confirmed by the server
  // 3. draw predicted positions of client orbs
};

export default orbMoveCommand;
