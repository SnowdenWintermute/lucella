import Matter from "matter-js";
import {
  baseOrbRadius,
  baseSpeedModifier,
  baseWindowDimensions,
  gameOverCountdownDuration,
  initialEndZoneHeight,
  initialScoreNeededToWin,
} from "../../consts/battle-room-game-config";
import { HostAndChallengerOrbSets } from "../../types";
import { MouseData } from "../MouseData";
import { Point } from "../Point";
import { Rectangle } from "../Rectangles";
import { AntiCheatValues } from "./AntiCheatValues";
import { BattleRoomQueues } from "./BattleRoomQueues";
import { DebugValues } from "./DebugValues";
import initializeWorld from "./initializeWorld";
import { NetCode } from "./NetCode";

export class BattleRoomGame {
  gameName: string;
  isRanked: boolean;
  physicsEngine: Matter.Engine | undefined;
  netcode = new NetCode();
  antiCheat = new AntiCheatValues();
  intervals: {
    physics: NodeJS.Timeout | undefined;
    endingCountdown: NodeJS.Timeout | undefined;
  } = { physics: undefined, endingCountdown: undefined };
  queues = new BattleRoomQueues();
  mouseData = new MouseData();
  gameOverCountdown: { duration: number; current: number | null } = { duration: gameOverCountdownDuration, current: null };
  winner: string | null | undefined = null;
  currentCollisionPairs: Matter.Pair[] = [];
  orbs: HostAndChallengerOrbSets = { host: {}, challenger: {} };
  score = {
    host: 0,
    challenger: 0,
    neededToWin: BattleRoomGame.initialScoreNeededToWin,
  };
  speedModifier = BattleRoomGame.baseSpeedModifier;
  endzones = {
    host: new Rectangle(new Point(0, 0), BattleRoomGame.baseWindowDimensions.width, BattleRoomGame.baseEndzoneHeight),
    challenger: new Rectangle(
      new Point(0, BattleRoomGame.baseWindowDimensions.height - BattleRoomGame.baseEndzoneHeight),
      BattleRoomGame.baseWindowDimensions.width,
      BattleRoomGame.baseEndzoneHeight
    ),
  };
  debug: DebugValues = {
    mode: 0,
    general: {},
    clientPrediction: {},
  };
  static baseWindowDimensions = baseWindowDimensions;
  static baseEndzoneHeight = initialEndZoneHeight;
  static baseOrbRadius = baseOrbRadius;
  static baseSpeedModifier = baseSpeedModifier;
  static initialScoreNeededToWin = initialScoreNeededToWin;
  static initializeWorld = initializeWorld;
  constructor(gameName: string, isRanked?: boolean) {
    this.gameName = gameName;
    this.isRanked = isRanked || false;
  }
  clearPhysicsInterval() {
    clearInterval(this.intervals.physics);
  }
  clearGameEndingCountdownInterval() {
    clearInterval(this.intervals.endingCountdown);
  }
}
