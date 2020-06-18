const cloneDeep = require("lodash/clonedeep");
// remove socketId prop from players props of game object
function generateGameForClient({ gameObject }) {
  let gameForClient = cloneDeep(gameObject);
  console.log("generateGameForClient5");
  console.log(gameForClient);
  Object.keys(gameForClient.players).forEach((player) => {
    if (gameForClient.players[player])
      delete gameForClient.players[player].socketId;
  });
  return gameForClient;
}

module.exports = generateGameForClient;
