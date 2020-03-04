const uuidv4 = require("uuid/v4");

class Player {
  constructor(socketId, playerName) {
    this.uid = uuidv4();
    this.socketId = socketId;
    this.name = playerName;
    this.isInGame = false;
    this.record = {
      wins: 0,
      losses: 0
    };
  }
}

module.exports = Player;
