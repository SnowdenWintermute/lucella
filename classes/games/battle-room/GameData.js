const GameState = require("./GameState");

class GameData {
  constructor({ gameName, width, height, isRanked }) {
    this.gameName = gameName;
    this.intervals = {};
    this.commandQueue = { host: [], challenger: [] };
    this.lastUpdatePacket = {};
    this.isRanked = isRanked;
    this.winner = null;
    this.endingStateCountdown = 1;
    this.width = width;
    this.height = height;
    this.speed = 8;
    this.orbRadius = 8;
    this.gameState = new GameState({ width: this.width, height: this.height });
  }
}
module.exports = GameData;
