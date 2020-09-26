export const showOpponentOrbsInPast = ({
  gameDataQueue,
  gameData,
  playerRole,
}) => {
  const opponentOrbsRole =
    playerRole === "host" ? "challengerOrbs" : "hostOrbs";

  if (Object.keys(gameDataQueue).length > 1) {
    if (
      gameDataQueue[gameDataQueue.length - 2].gameState &&
      gameData.gameState
    ) {
      gameData.gameState.orbs[opponentOrbsRole] =
        gameDataQueue[gameDataQueue.length - 2].gameState.orbs[
          opponentOrbsRole
        ];
    }
    gameDataQueue.shift();
  }
};
