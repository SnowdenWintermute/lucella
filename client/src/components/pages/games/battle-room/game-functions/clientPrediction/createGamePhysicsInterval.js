const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");
const clientPredictOwnOrbPositions = require("./clientPredictOwnOrbPositions");
const { syncGameState } = require("./syncGameState");
const { showOpponentOrbsInPast } = require("./showOpponentOrbsInPast");

function createGamePhysicsInterval({
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  gameData,
  commandQueue,
  playerRole,
  gameStateQueue,
}) {
  return setInterval(() => {
    if (!gameData) return;
    if (Object.keys(gameData).length < 1) return;
    // console.log(commandQueue);
    const numberOfLastCommandUpdateFromServer = lastServerGameUpdate.gameState
      ? lastServerGameUpdate.gameState.lastProcessedCommands[playerRole]
      : null;

    // set gameState to last recieved state
    syncGameState({
      gameData,
      lastServerGameUpdate,
      numberOfLastServerUpdateApplied,
      numberOfLastCommandUpdateFromServer,
      playerRole,
    });

    // find command to discard (since the state from that command has been synced to last server update)
    const commandToDiscard = commandQueue.queue.find((commandInQueue) => {
      return (
        commandInQueue.data.commandPositionInQueue ===
        numberOfLastCommandUpdateFromServer
      );
    });
    // discard corresponding command in client's queue
    commandQueue.queue.splice(commandQueue.queue.indexOf(commandToDiscard));

    clientPredictOwnOrbPositions({ commandQueue, gameData, playerRole });

    // go through gameData queue and show opponent positions in the past
    showOpponentOrbsInPast({ gameStateQueue, gameData, playerRole });

    if (!gameData) return;
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleScoringPoints({ gameData });
  }, 33);
}

export default createGamePhysicsInterval;
