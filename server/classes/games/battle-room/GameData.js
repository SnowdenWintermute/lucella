const GameState = require("./GameState");

class GameData {
  constructor({ gameName, isRanked }) {
    this.gameName = gameName;
    this.intervals = {};
    this.commandQueue = { host: [], challenger: [] };
    this.lastUpdatePacket = {};
    this.isRanked = isRanked;
    this.winner = null;
    this.endingStateCountdown = 1;
    this.width = 450;
    this.height = 750;
    this.orbRadius = 15;
    this.gameState = new GameState({ width: this.width, height: this.height });
  }
}
module.exports = GameData;
