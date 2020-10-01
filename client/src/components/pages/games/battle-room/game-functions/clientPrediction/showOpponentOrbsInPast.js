import cloneDeep from "lodash.clonedeep";

export const showOpponentOrbsInPast = ({
  gameStateQueue,
  gameData,
  playerRole,
}) => {
  const opponentOrbsRole =
    playerRole === "host" ? "challengerOrbs" : "hostOrbs";

  if (gameStateQueue.length > 1) {
    gameData.gameState.orbs[opponentOrbsRole].forEach((orb, i) => {
      Object.keys(orb).forEach((key) => {
        if (
          gameStateQueue[gameStateQueue.length - 2].orbs[opponentOrbsRole][
            i
          ].hasOwnProperty(key)
        ) {
          orb[key] = cloneDeep(
            gameStateQueue[gameStateQueue.length - 2].orbs[opponentOrbsRole][i][
              key
            ],
          );
        }
      });
    });
    gameStateQueue.shift();
  } else if (gameStateQueue.length > 0) {
    gameData.gameState.orbs[opponentOrbsRole].forEach((orb, i) => {
      Object.keys(orb).forEach((key) => {
        if (gameStateQueue[0].orbs[opponentOrbsRole][i].hasOwnProperty(key)) {
          orb[key] = cloneDeep(
            gameStateQueue[0].orbs[opponentOrbsRole][i][key],
          );
        }
      });
    });
  }
};
