import GameState from "../GameState";
import MouseData from "../MouseData";

class BattleRoomGame {
  gameName: string;
  mouseData: MouseData;
  intervals: { physics: NodeJS.Timer | null; broadcast: NodeJS.Timer | null };
  static baseWindowDimensions: { width: number; height: number };
  static baseOrbRadius: number;
  constructor({ gameName, isRanked, hostUuid, challengerUuid }) {
    this.gameName = gameName;
    this.intervals = { physics: null, broadcast: null };
    this.mouseData = new MouseData();
    this.gameOverCountdownText = null;
    this.gameOverCountdownDuration = 1;
    this.lastServerGameUpdate = {};
    this.opponentEntityStatesQueue = [];
    this.unappliedInputQueue = [];
    this.numberOfUpdatesApplied = 0;
    this.idOfLastUpdateApplied = 0;
    this.idOfLastCommandIssued = 0;
    this.commandQueue = { host: [], challenger: [] };
    this.isRanked = isRanked;
    this.winner = null;
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
        width: BattleRoomGame.baseWindowDimensions.width,
        height: 60,
      },
      challenger: {
        x: 0,
        y: BattleRoomGame.baseWindowDimensions.height - 60,
        width: BattleRoomGame.baseWindowDimensions.width,
        height: 60,
      },
    };
    this.speed = 4;
    this.lastCommandProcessedAt = Date.now();
    generateStartingOrbs({ orbs: this.orbs, startingOrbRadius, hostUuid, challengerUuid });
  }
  baseWindowDimensions = { width: 450, height: 750 };
  baseOrbRadius = 15;
}
module.exports = BattleRoomGame;
