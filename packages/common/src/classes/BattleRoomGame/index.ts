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
  netcode: NetCode;
  antiCheat: AntiCheatValues;
  intervals: {
    physics: NodeJS.Timeout | undefined;
    endingCountdown: NodeJS.Timeout | undefined;
  };
  queues: BattleRoomQueues;
  mouseData: MouseData; // client only
  gameOverCountdown: { duration: number; current: number | null };
  winner: string | null | undefined;
  currentCollisionPairs: Matter.Pair[];
  orbs: HostAndChallengerOrbSets;
  score: { host: number; challenger: number; neededToWin: number };
  speedModifier: number;
  endzones: { host: Rectangle; challenger: Rectangle };
  debug: DebugValues;
  static baseWindowDimensions = baseWindowDimensions;
  static baseEndzoneHeight = initialEndZoneHeight;
  static baseOrbRadius = baseOrbRadius;
  static baseSpeedModifier = baseSpeedModifier;
  static initialScoreNeededToWin = initialScoreNeededToWin;
  static initializeWorld = initializeWorld;
  constructor(gameName: string, isRanked?: boolean) {
    this.gameName = gameName;
    this.isRanked = isRanked || false;
    this.intervals = {
      physics: undefined,
      endingCountdown: undefined,
    };
    this.mouseData = new MouseData();
    this.gameOverCountdown = {
      duration: gameOverCountdownDuration,
      current: null,
    };
    this.queues = new BattleRoomQueues();
    this.netcode = new NetCode();
    this.antiCheat = new AntiCheatValues();
    this.winner = null;
    this.orbs = { host: {}, challenger: {} };
    this.currentCollisionPairs = [];
    this.score = {
      host: 0,
      challenger: 0,
      neededToWin: BattleRoomGame.initialScoreNeededToWin,
    };
    this.endzones = {
      host: new Rectangle(new Point(0, 0), BattleRoomGame.baseWindowDimensions.width, BattleRoomGame.baseEndzoneHeight),
      challenger: new Rectangle(
        new Point(0, BattleRoomGame.baseWindowDimensions.height - BattleRoomGame.baseEndzoneHeight),
        BattleRoomGame.baseWindowDimensions.width,
        BattleRoomGame.baseEndzoneHeight
      ),
    };
    this.speedModifier = BattleRoomGame.baseSpeedModifier;
    this.debug = {
      mode: 0,
      general: {},
      clientPrediction: {},
    };
  }
  clearPhysicsInterval() {
    clearInterval(this.intervals.physics);
  }
  clearGameEndingCountdownInterval() {
    clearInterval(this.intervals.endingCountdown);
  }
}
