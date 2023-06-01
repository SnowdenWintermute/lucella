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
import { PlayerRole } from "../../enums";
import { HostAndChallengerOrbSets, BRServerPacket } from "../../types";
import { MouseData } from "../GameGenerics/MouseData";
import { Point } from "../GameGenerics/Point";
import { Rectangle } from "../GameGenerics/Rectangles";
import { BattleRoomGameConfig } from "./BattleRoomGameConfig";
import { BattleRoomGameConfigOptionIndicesUpdate } from "./BattleRoomGameConfigOptionIndicesUpdate";
import { DebugValues } from "./DebugValues";
import initializeWorld from "./initializeWorld";
import { NetCode } from "../GameGenerics/NetCode";
import { BRGameElementsOfConstantInterest } from "./BRGameElementsOfConstantInterest";
import { AntiCheatValueTracker } from "../GameGenerics/AntiCheat";
import { BRPlayerAction } from "./BRPlayerAction";
import { ActionQueues } from "../GameGenerics/ActionQueues";

export class BattleRoomGame {
  gameName: string;
  isRanked: boolean;
  physicsEngine: Matter.Engine | undefined;
  netcode = new NetCode<BRGameElementsOfConstantInterest, BRServerPacket>(["host", "challenger"]);
  antiCheat = new AntiCheatValueTracker(["host", "challenger"]);
  intervals: {
    physics: NodeJS.Timeout | undefined;
    endingCountdown: NodeJS.Timeout | undefined;
    newRoundCountdown: NodeJS.Timeout | undefined;
  } = { physics: undefined, endingCountdown: undefined, newRoundCountdown: undefined };
  queues = new ActionQueues<BRPlayerAction>();
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
  config = new BattleRoomGameConfig({});
  speedModifier = baseSpeedModifier;
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
  static initialScoreNeededToWin = initialScoreNeededToWin;
  static initializeWorld = initializeWorld;
  constructor(gameName: string, playerNames: { host: string; challenger: string }, options?: BattleRoomGameConfigOptionIndicesUpdate, isRanked?: boolean) {
    this.gameName = gameName;
    this.isRanked = isRanked || false;
    this.playerNames = playerNames;
    if (!options) return;
    Object.entries(options).forEach(([option, value]) => {
      // @ts-ignore
      this.config.updateConfigValueFromOptionIndex(option, value);
    });
    this.score.neededToWin = this.config.numberOfPointsRequiredToWinRound;
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
