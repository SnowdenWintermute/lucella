import Matter from "matter-js";
import { baseOrbRadius, baseSpeedModifier, baseWindowDimensions, initialEndZoneHeight, initialScoreNeededToWin } from "../../consts/battle-room-game-config";
import { MouseData } from "../MouseData";
import { Point } from "../Point";
import { Rectangle } from "../Rectangles";

export class CombatSimulator {
  id: string;
  physicsEngine: Matter.Engine | undefined;
  netcode = new NetCode();
  antiCheat = new AntiCheatValues();
  players: { [socketId: string]: SocketMetadata } = {};
  entities: {
    playerControlled: { [playerName: string]: MobileEntity } = {};
    mobile: { [id: string]: MobileEntity } = {};
    static: { [id: string]: StaticEntity } = {};
  };
  intervals: {
    physics: NodeJS.Timeout | undefined;
  } = { physics: undefined };
  queues = new BattleRoomQueues();
  mouseData = new MouseData();
  currentCollisionPairs: Matter.Pair[] = [];
  speedModifier = baseSpeedModifier;
  static baseWindowDimensions = baseWindowDimensions;
  static baseEndzoneHeight = initialEndZoneHeight;
  static baseOrbRadius = baseOrbRadius;
  static initialScoreNeededToWin = initialScoreNeededToWin;
  static initializeWorld = initializeWorld;
  constructor(id: string) {
    this.id = id;
  }
  clearPhysicsInterval() {
    clearInterval(this.intervals.physics);
  }
}
