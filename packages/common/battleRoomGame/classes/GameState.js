const generateStartingOrbs = require('./generateStartingOrbs')

class GameState {
  constructor({ width, height, startingOrbRadius, hostUuid, challengerUuid }) {
    this.lastUpdateTimestamp = null;
    this.lastProcessedCommandNumbers = {
      host: null,
      challenger: null,
    };
    this.orbs = {
      host: [],
      challenger: [],
    };
    this.score = {
      host: 0,
      challenger: 0,
      neededToWin: 5,
    };
    this.dashes = {
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
    };
    this.endzones = {
      host: {
        x: 0,
        y: 0,
        width: width,
        height: 60,
      },
      challenger: {
        x: 0,
        y: height - 60,
        width: width,
        height: 60,
      },
    };
    this.speed = 4;
    this.lastCommandProcessedAt = Date.now()
    generateStartingOrbs({ orbs: this.orbs, startingOrbRadius, hostUuid, challengerUuid })
  }
}

module.exports = GameState;
