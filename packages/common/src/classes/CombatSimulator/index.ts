/* eslint-disable max-classes-per-file */
import Matter from "matter-js";
import { Socket } from "socket.io";
import { MouseData } from "../GameGenerics/MouseData";
import { NetCode } from "../GameGenerics/NetCode";
import { AntiCheatValueTracker } from "../GameGenerics/AntiCheat";
import { SocketMetadata } from "../SocketMetadata";
import { ActionQueues } from "../GameGenerics/ActionQueues";
import { Entity } from "./Entity";
import { MobileEntity } from "./MobileEntity";
import { CSGameState } from "./CSGameState";
import { CSServerPacket } from "../../types";
import { CSPlayerAction } from "./cs-game-actions";
import { KeyboardInputState } from "../GameGenerics/KeyboardInputState";
import { CS_BASE_WINDOW_DIMENSIONS } from "./cs-game-config";

export class CSPlayer {
  socketMeta: SocketMetadata;
  ownedEntities: { [id: string]: Entity | MobileEntity } = {};
  constructor(socketMeta: SocketMetadata) {
    this.socketMeta = socketMeta;
  }
}

export class CombatSimulator {
  gameName: string;
  physicsEngine: Matter.Engine | undefined;
  currentCollisionPairs: Matter.Pair[] = [];
  netcode = new NetCode<CSGameState, CSServerPacket>();
  antiCheat = new AntiCheatValueTracker();
  queues = new ActionQueues<CSPlayerAction>();
  intervals: {
    physics: NodeJS.Timeout | undefined;
  } = { physics: undefined };

  players: { [socketId: string]: CSPlayer } = {};
  lastAssignedEntityId = -1;
  entities: {
    playerControlled: { [id: string]: MobileEntity };
    mobile: { [id: string]: MobileEntity };
    static: { [id: string]: Entity };
  } = {
    playerControlled: {},
    mobile: {},
    static: {},
  };
  // for client only:
  keyboardInputState = new KeyboardInputState();
  mouseData = new MouseData();
  static baseWindowDimensions = CS_BASE_WINDOW_DIMENSIONS;
  // static initializeWorld = initializeWorld;
  constructor(gameName: string) {
    this.gameName = gameName;
  }

  clearPhysicsInterval() {
    clearTimeout(this.intervals.physics);
    this.intervals.physics = undefined;
  }

  addPlayerControlledEntity(socket: Socket) {
    const player = this.players[socket.id];
    const entity = new MobileEntity((this.lastAssignedEntityId += 1), player.socketMeta.associatedUser.username, 1, 10, 0);
    this.entities.playerControlled[player.socketMeta.associatedUser.username] = entity;
    player.ownedEntities[entity.id] = entity;
  }

  removeEntity(type: "playerControlled" | "mobile" | "static", id: string) {
    console.log(`removing ${this.entities[type][id]}`);
    delete this.entities[type][id];
  }
}
