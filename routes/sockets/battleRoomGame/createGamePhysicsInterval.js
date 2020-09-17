const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");
const setOrbHeadings = require("./setOrbHeadings");

function createGamePhysicsInterval({
  io,
  socket,
  connectedSockets,
  gameRooms,
  gameRoom,
  gameData,
  chatRooms,
}) {
  return setInterval(() => {
    // update gameData on server
    Object.keys(gameData.commandQueue).forEach((playerRole) => {
      Object.keys(gameData.commandQueue[playerRole]).forEach(
        (commandInQueue) => {
          if (
            gameData.commandQueue[playerRole][commandInQueue].commandType ===
            "orbMove"
          ) {
            console.log("moveCommand");
            console.log(gameData.commandQueue[playerRole][commandInQueue]);
            // execute the command
            setOrbHeadings({
              playerRole,
              connectedSockets,
              gameRoom,
              gameData,
              data: gameData.commandQueue[playerRole][commandInQueue].data,
            });
            // update the most recently processed command
            gameData.gameState.lastProcessedCommands[playerRole] =
              gameData.commandQueue[playerRole][
                commandInQueue
              ].data.commandPositionInQueue;
            // remove command from queue
            gameData.commandQueue[playerRole].splice(
              gameData.commandQueue[playerRole].indexOf(
                gameData.commandQueue[playerRole][commandInQueue],
                1
              )
            );
          }
          // console.log(gameData.gameState.lastProcessedCommands[playerRole]);
        }
      );
    });
    moveOrbs({ gameData });
    handleOrbCollisions({ gameData });
    handleScoringPoints({
      io,
      connectedSockets,
      gameRooms,
      gameRoom,
      gameData,
      chatRooms,
    });
  }, 33);
}

module.exports = createGamePhysicsInterval;
