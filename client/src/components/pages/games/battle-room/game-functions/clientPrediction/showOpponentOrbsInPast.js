export const showOpponentOrbsInPast = ({
  gameStateQueue,
  gameData,
  playerRole,
}) => {
  const opponentOrbsRole =
    playerRole === "host" ? "challengerOrbs" : "hostOrbs";

  // console.log(gameStateQueue);

  if (Object.keys(gameStateQueue).length > 1) {
    // console.log("length of gameStateQueue > 1");
    console.log(gameStateQueue[gameStateQueue.length - 2]);
    if (gameStateQueue[gameStateQueue.length - 2]) {
      console.log(gameData.gameState.orbs[opponentOrbsRole]);
      gameData.gameState.orbs[opponentOrbsRole].forEach((orb, i) => {
        Object.keys(orb).forEach((key) => {
          if (
            gameStateQueue[gameStateQueue.length - 2].orbs[opponentOrbsRole][i][
              key
            ]
          )
            orb[key] =
              gameStateQueue[gameStateQueue.length - 2].orbs[opponentOrbsRole][
                i
              ][key];
        });
      });
      gameStateQueue.shift();
    }
  }
  // console.log(gameData.gameState.orbs);
};
