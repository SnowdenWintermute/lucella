import Matter from "matter-js";
import { baseOrbRadius, baseSpeedModifier, gameOverCountdownDuration, initialScoreNeededToWin } from "../../consts/battle-room-game-config";
import { UserInput } from "../inputs/UserInput";
import { MouseData } from "../MouseData";
import { Orb } from "../Orb";
import { Point } from "../Point";
import { Rectangle } from "../Rectangles";
import { DebugValues } from "./DebugValues";
import initializeWorld from "./initializeWorld";
import { NetCode } from "./NetCode";

export class BattleRoomGame {
  gameName: string;
  isRanked: boolean;
  physicsEngine: Matter.Engine | undefined;
  intervals: {
    physics: NodeJS.Timeout | undefined;
    endingCountdown: NodeJS.Timeout | undefined;
  };
  mouseData: MouseData; // client only
  gameOverCountdown: { duration: number; current: number | null };
  queues: {
    client: {
      localInputs: UserInput[];
      receivedOpponentPositions: { orbs: Orb[]; tick: number }[];
    };
    server: {
      receivedInputs: any[];
      receivedLatestClientTickNumbers: {
        host: number | null;
        challenger: number | null;
      };
    };
  };
  netcode: NetCode;
  antiCheat: {
    numberOfMovementRequests: { host: number; challenger: number };
    cumulativeTimeBetweenMovementRequests: { host: number; challenger: number };
    averageMovementRequestRate: { host: number; challenger: number };
  };
  winner: string | null;
  orbs: { host: { [label: string]: Orb }; challenger: { [label: string]: Orb } };
  currentCollisionPairs: Matter.Pair[];
  endzones: { host: Rectangle; challenger: Rectangle };
  score: { host: number; challenger: number; neededToWin: number };
  speedModifier: number;
  debug: DebugValues;
  static baseWindowDimensions = { width: 450, height: 750 };
  static baseEndzoneHeight = 60;
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
    this.queues = {
      client: { localInputs: [], receivedOpponentPositions: [] }, // client only
      server: {
        receivedInputs: [],
        receivedLatestClientTickNumbers: { host: null, challenger: null },
      }, // server only
    };
    this.netcode = new NetCode();
    this.antiCheat = {
      numberOfMovementRequests: { host: 0, challenger: 0 },
      cumulativeTimeBetweenMovementRequests: { host: 0, challenger: 0 },
      averageMovementRequestRate: { host: 0, challenger: 0 },
    };
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
      showDebug: false,
      general: {},
      clientPrediction: {},
    };
  }
}
