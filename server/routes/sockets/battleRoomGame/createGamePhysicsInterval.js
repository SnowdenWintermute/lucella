const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");
const setOrbHeadings = require("./setOrbHeadings");

function createGamePhysicsInterval({
  io,
  connectedSockets,
  gameRooms,
  gameRoom,
  gameData,
  chatRooms,
}) {
  return setInterval(() => {
    if (!gameData) return;
    // go through the command queues
    Object.keys(gameData.commandQueue).forEach((playerRole) => {
      Object.keys(gameData.commandQueue[playerRole]).forEach(
        (commandInQueue) => {
          if (!gameData.commandQueue[playerRole][commandInQueue]) return;
          const { commandType } = gameData.commandQueue[playerRole][
            commandInQueue
          ];

          if (commandType === "orbSelect") {
            const { orbsToBeUpdated } = gameData.commandQueue[playerRole][
              commandInQueue
            ].data;

            gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
              orbsToBeUpdated.forEach((selectedOrb) => {
                if (selectedOrb.num === orb.num) {
                  orb.isSelected = selectedOrb.isSelected;
                }
              });
            });
          }
          if (commandType === "orbMove") {
            setOrbHeadings({
              playerRole,
              connectedSockets,
              gameRoom,
              gameData,
              data: gameData.commandQueue[playerRole][commandInQueue].data,
            });
          }
          if (commandType === "orbSelectAndMove") {
            console.log("selectAndMove");
            // select first
            const { orbsToBeUpdated } = gameData.commandQueue[playerRole][
              commandInQueue
            ].data.selectCommandData;

            gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb) => {
              orbsToBeUpdated.forEach((selectedOrb) => {
                if (selectedOrb.num === orb.num) {
                  orb.isSelected = selectedOrb.isSelected;
                }
              });
              // then set heading
              setOrbHeadings({
                playerRole,
                connectedSockets,
                gameRoom,
                gameData,
                data:
                  gameData.commandQueue[playerRole][commandInQueue].data
                    .moveCommandData,
              });
            });
          }

          // update the most recently processed command number
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
