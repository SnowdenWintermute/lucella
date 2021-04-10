import cloneDeep from "lodash.clonedeep";

export const showOpponentOrbsInPast = ({
  gameStateQueue,
  gameData,
  playerRole,
}) => {

  if (gameStateQueue.length > 1) {
    gameData.gameState.orbs[playerRole].forEach((orb, i) => {
      Object.keys(orb).forEach((key) => {
        if (
          gameStateQueue[gameStateQueue.length - 2].orbs[playerRole][
            i
          ].hasOwnProperty(key)
        ) {
          orb[key] = cloneDeep(
            gameStateQueue[gameStateQueue.length - 2].orbs[playerRole][i][
            key
            ],
          );
        }
      });
    });
    gameStateQueue.shift();
  } else if (gameStateQueue.length > 0) {
    gameData.gameState.orbs[playerRole].forEach((orb, i) => {
      Object.keys(orb).forEach((key) => {
        if (gameStateQueue[0].orbs[playerRole][i].hasOwnProperty(key)) {
          orb[key] = cloneDeep(
            gameStateQueue[0].orbs[playerRole][i][key],
          );
        }
      });
    });
  }
};
