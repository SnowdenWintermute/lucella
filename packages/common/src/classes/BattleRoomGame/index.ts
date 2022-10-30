import {
  baseOrbRadius,
  baseSpeedModifier,
  gameOverCountdownDuration,
  initialScoreNeededToWin,
} from "../../consts/battle-room-game-config";
import { UserInput } from "../inputs/UserInput";
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
  lastUpdateFromServer: any;
  currentTick: number; // 65535 max then roll to 0
  lastClientInputNumber: number;
  serverLastKnownClientTicks: {
    host: number | null;
    challenger: number | null;
  }; // server only
  serverLastProcessedInputNumbers: {
    host: number | null;
    challenger: number | null;
  };
  winner: string | null;
  orbs: { host: Orb[]; challenger: Orb[] };
  endzones: { host: Rectangle; challenger: Rectangle };
  score: { host: number; challenger: number; neededToWin: number };
  speedModifier: number;
  debug: {
    clientPrediction: {
      inputsToSimulate: any[];
      ticksSinceLastClientTickConfirmedByServer: number;
      simulatingBetweenInputs: boolean;
      clientServerTickDifference: number;
      lastProcessedClientInputNumber: number;
    };
  };
  static baseWindowDimensions = { width: 450, height: 750 };
  static baseEndzoneHeight = 60;
  static baseOrbRadius = baseOrbRadius;
  static baseSpeedModifier = baseSpeedModifier;
  static initialScoreNeededToWin = initialScoreNeededToWin;
  constructor(gameName: string, isRanked?: boolean) {
    this.gameName = gameName;
    this.isRanked = isRanked || false;
    this.intervals = {
      physics: undefined,
      broadcast: undefined,
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
    this.lastUpdateFromServer = null;
    this.currentTick = 0;
    this.lastClientInputNumber = 0;
    this.winner = null;
    this.serverLastKnownClientTicks = { host: null, challenger: null }; // server only
    this.serverLastProcessedInputNumbers = {
      host: null,
      challenger: null,
    };
    this.orbs = { host: [], challenger: [] };
    this.score = {
      host: 0,
      challenger: 0,
      neededToWin: BattleRoomGame.initialScoreNeededToWin,
    };
    this.endzones = {
      host: new Rectangle(
        new Point(0, 0),
        BattleRoomGame.baseWindowDimensions.width,
        BattleRoomGame.baseEndzoneHeight
      ),
      challenger: new Rectangle(
        new Point(
          0,
          BattleRoomGame.baseWindowDimensions.height -
            BattleRoomGame.baseEndzoneHeight
        ),
        BattleRoomGame.baseWindowDimensions.width,
        BattleRoomGame.baseEndzoneHeight
      ),
    };
    this.speedModifier = BattleRoomGame.baseSpeedModifier;
    this.debug = {
      clientPrediction: {
        inputsToSimulate: [],
        ticksSinceLastClientTickConfirmedByServer: 0,
        simulatingBetweenInputs: false,
        clientServerTickDifference: 0,
        lastProcessedClientInputNumber: 0,
      },
    };
    generateStartingOrbs(this.orbs, BattleRoomGame.baseOrbRadius);
  }
}
