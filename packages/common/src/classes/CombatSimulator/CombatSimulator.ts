import Matter from "matter-js";
import { baseWindowDimensions } from "../../consts/battle-room-game-config";
import { MouseData } from "../MouseData";
import { NetCode } from "../NetCode";
import { AntiCheatValueTracker } from "../AntiCheat";
import { SocketMetadata } from "../SocketMetadata";
import { InputQueues } from "../InputQueues";
import { Entity } from "./Entity";
import { MobileEntity } from "./MobileEntity";

export class CombatSimulator {
  id: string;
  physicsEngine: Matter.Engine | undefined;
  currentCollisionPairs: Matter.Pair[] = [];
  netcode = new NetCode();
  antiCheat = new AntiCheatValueTracker();
  // queues: InputQueues<>;
  intervals: {
    physics: NodeJS.Timeout | undefined;
  } = { physics: undefined };

  players: { [socketId: string]: SocketMetadata } = {};
  entities: {
    playerControlled: { [playerName: string]: MobileEntity };
    mobile: { [id: string]: MobileEntity };
    static: { [id: string]: Entity };
  } = {
    playerControlled: {},
    mobile: {},
    static: {},
  };
  mouseData = new MouseData();
  static baseWindowDimensions = baseWindowDimensions;
  // static initializeWorld = initializeWorld;
  constructor(id: string) {
    this.id = id;
  }
  clearPhysicsInterval() {
    clearInterval(this.intervals.physics);
  }
}
