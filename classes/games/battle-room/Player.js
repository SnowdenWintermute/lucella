const uuidv4 = require("uuid/v4");

class Player {
  constructor({ socketId, playerName }) {
    this.uid = uuidv4();
    this.socketId = socketId;
    this.name = playerName;
    this.isInGame = false;
  }
}

module.exports = Player;
