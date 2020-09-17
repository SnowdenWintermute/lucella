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
    this.gameState = {
      lastProcessedCommands: {
        host: null,
        challenger: null,
      },
      orbs: {
        hostOrbs: [],
        challengerOrbs: [],
      },
      score: {
        host: 0,
        challenger: 0,
        neededToWin: 5,
      },
      dashes: {
        host: {
          dashes: 3,
          recharging: false,
          cooldown: 3,
        },
        challenger: {
          dashes: 3,
          recharging: false,
          cooldown: 3,
        },
      },
      endzones: {
        host: {
          x: 0,
          y: 0,
          width: this.width,
          height: 60,
        },
        challenger: {
          x: 0,
          y: this.height - 60,
          width: this.width,
          height: 60,
        },
      },
    };
  }
}
module.exports = GameData;
