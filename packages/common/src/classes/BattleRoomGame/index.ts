import Matter from "matter-js";
import {
  baseOrbRadius,
  baseSpeedModifier,
  baseWindowDimensions,
  gameOverCountdownDuration,
  initialEndZoneHeight,
  initialScoreNeededToWin,
  newRoundStartingCountdownDuration,
} from "../../consts/battle-room-game-config";
import { baseNumberOfRoundsRequiredToWin } from "../../consts/game-lobby-config";
import { PlayerRole } from "../../enums";
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
    newRoundCountdown: NodeJS.Timeout | undefined;
  } = { physics: undefined, endingCountdown: undefined, newRoundCountdown: undefined };
  queues = new BattleRoomQueues();
  mouseData = new MouseData();
  waypointKeyIsPressed: boolean = false;
  newRoundCountdown: { duration: number; current: number | null } = { duration: newRoundStartingCountdownDuration, current: null };
  newRoundStarting = false;
  gameOverCountdown: { duration: number; current: number | null } = { duration: gameOverCountdownDuration, current: null };
  playerNames: { host: string; challenger: string };
  winner: PlayerRole | null | undefined = null;
  currentCollisionPairs: Matter.Pair[] = [];
  orbs: HostAndChallengerOrbSets = { [PlayerRole.HOST]: {}, [PlayerRole.CHALLENGER]: {} };
  score = {
    host: 0,
    challenger: 0,
    neededToWin: BattleRoomGame.initialScoreNeededToWin,
  };
  // used for displaying this information in canvas, gameRoom object keeps track of the canonical values
  roundsWon = {
    host: 0,
    challenger: 0,
  };
  numberOfRoundsNeededToWin = baseNumberOfRoundsRequiredToWin;
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
  constructor(gameName: string, roundsNeededToWin: number, playerNames: { host: string; challenger: string }, isRanked?: boolean) {
    this.gameName = gameName;
    this.isRanked = isRanked || false;
    this.numberOfRoundsNeededToWin = roundsNeededToWin;
    this.playerNames = playerNames;
  }
  clearPhysicsInterval() {
    clearInterval(this.intervals.physics);
  }
  clearGameEndingCountdownInterval() {
    clearInterval(this.intervals.endingCountdown);
  }
  clearNewRoundCountdownInterval() {
    clearInterval(this.intervals.newRoundCountdown);
    this.newRoundCountdown.current = null;
  }
}
