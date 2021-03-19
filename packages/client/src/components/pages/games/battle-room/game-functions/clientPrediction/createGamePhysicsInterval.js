const moveOrbs = require("@lucella/common/battleRoomGame/moveOrbs/index.js")
const handleOrbCollisions = require("@lucella/common/battleRoomGame/handleOrbCollisions");
const clientPredictOwnOrbPositions = require("./clientPredictOwnOrbPositions");
const { syncGameState } = require("./syncGameState");
const { showOpponentOrbsInPast } = require("./showOpponentOrbsInPast");
const handleOrbInEndzone = require('@lucella/common/battleRoomGame/handleOrbInEndzone')

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
    const numberOfLastCommandUpdateFromServer = lastServerGameUpdate.gameState
      ? lastServerGameUpdate.gameState.lastProcessedCommandNumbers[playerRole]
      : null;

    // set gameState to last received state
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
    handleOrbInEndzone(gameData);
  }, 33);
}

export default createGamePhysicsInterval;
