// remove socketId prop from players props of game object
function generateGamesForClient({ gamesObject }) {
  let gamesForClient = gamesObject;
  Object.keys(gamesForClient).forEach((game) => {
    Object.keys(gamesForClient[game].players).forEach((player) => {
      if (gamesForClient[game].players[player])
        delete gamesForClient[game].players[player].socketId;
    });
  });
  return gamesForClient;
}

module.exports = generateGamesForClient;
