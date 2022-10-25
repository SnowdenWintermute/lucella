import {
  baseOrbRadius,
  baseSpeedModifier,
  gameOverCountdownDuration,
  initialScoreNeededToWin,
} from "../../consts/battle-room-game-config";
import { MouseData } from "../MouseData";
import { Orb } from "../Orb";
import { Point } from "../Point";
import { Rectangle } from "../Rectangles";
import { generateStartingOrbs } from "./generateStartingOrbs";

export class BattleRoomGame {
  gameName: string;
  isRanked: boolean;
  intervals: {
    physics: NodeJS.Timeout | undefined;
    broadcast: NodeJS.Timeout | undefined;
    endingCountdown: NodeJS.Timeout | undefined;
  };
  mouseData: MouseData; // client only
  gameOverCountdown: { duration: number; current: number | null };
  queues: {
    client: { localInputs: any[] };
    server: { receivedInputs: any[] };
  };
  lastUpdateFromServer: any;
  currentTick: number; // 65535 max then roll to 0
  lastProcessedClientInputTicks: { host: number | null; challenger: number | null }; // server only
  winner: string | null;
  orbs: { host: Orb[]; challenger: Orb[] };
  endzones: { host: Rectangle; challenger: Rectangle };
  score: { host: number; challenger: number; neededToWin: number };
  speedModifier: number;
  inputsToSimulate: any[];
  static baseWindowDimensions = { width: 450, height: 750 };
  static baseEndzoneHeight = 60;
  static baseOrbRadius = baseOrbRadius;
  static baseSpeedModifier = baseSpeedModifier;
  static initialScoreNeededToWin = initialScoreNeededToWin;
  constructor(gameName: string, isRanked?: boolean) {
    this.gameName = gameName;
    this.isRanked = isRanked || false;
    this.intervals = { physics: undefined, broadcast: undefined, endingCountdown: undefined };
    this.mouseData = new MouseData();
    this.gameOverCountdown = { duration: gameOverCountdownDuration, current: null };
    this.queues = {
      client: { localInputs: [] }, // client only
      server: { receivedInputs: [] }, // server only
    };
    this.lastUpdateFromServer = null;
    this.currentTick = 0;
    this.winner = null;
    this.lastProcessedClientInputTicks = { host: null, challenger: null }; // server only
    this.orbs = { host: [], challenger: [] };
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
    this.inputsToSimulate = [];
    generateStartingOrbs(this.orbs, BattleRoomGame.baseOrbRadius);
  }
}
