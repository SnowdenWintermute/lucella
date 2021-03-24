const cloneDeep = require("lodash.clonedeep");
// remove socketId prop from players props of game object
module.exports = ({ gamesObject }) => {
  let gamesForClient = cloneDeep(gamesObject);
  Object.keys(gamesForClient).forEach((game) => {
    Object.keys(gamesForClient[game].players).forEach((player) => {
      if (gamesForClient[game].players[player])
        delete gamesForClient[game].players[player].socketId;
    });
  });
  return gamesForClient;
}
