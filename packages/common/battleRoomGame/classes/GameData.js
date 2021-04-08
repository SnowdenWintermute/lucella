const GameState = require("@lucella/common/battleRoomGame/classes/GameState");

class GameData {
  constructor({ gameName, isRanked, hostUuid, challengerUuid }) {
    this.gameName = gameName;
    this.intervals = {};
    this.commandQueue = { host: [], challenger: [] };
    this.isRanked = isRanked;
    this.winner = null;
    this.endingStateCountdown = 1;
    this.width = 450;
    this.height = 750;
    this.orbRadius = 15;
    this.gameState = new GameState({ width: this.width, height: this.height, startingOrbRadius: this.orbRadius, hostUuid, challengerUuid });
  }
}
module.exports = GameData;
