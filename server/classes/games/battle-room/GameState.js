class GameState {
  constructor({ width, height }) {
    this.lastUpdateTimestamp = null;
    this.lastProcessedCommands = {
      host: null,
      challenger: null,
    };
    this.orbs = {
      hostOrbs: [],
      challengerOrbs: [],
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
  }
}

module.exports = GameState;
