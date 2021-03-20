// makes a gameRoom (lobby object) for client without socketIds

const cloneDeep = require("lodash.clonedeep");
// remove socketId prop from players props of game object
module.exports = ({ gameRoom }) => {
  let gameRoomForClient = cloneDeep(gameRoom);
  Object.keys(gameRoomForClient.players).forEach((player) => {
    if (gameRoomForClient.players[player])
      delete gameRoomForClient.players[player].socketId;
  });
  return gameRoomForClient;
};
