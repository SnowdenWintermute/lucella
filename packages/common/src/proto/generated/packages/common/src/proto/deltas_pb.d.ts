// package: deltas
// file: packages/common/src/proto/deltas.proto

import * as jspb from "google-protobuf";

export class VectorProto extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VectorProto.AsObject;
  static toObject(includeInstance: boolean, msg: VectorProto): VectorProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VectorProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VectorProto;
  static deserializeBinaryFromReader(message: VectorProto, reader: jspb.BinaryReader): VectorProto;
}

export namespace VectorProto {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class OrbProto extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  hasIsselected(): boolean;
  clearIsselected(): void;
  getIsselected(): boolean;
  setIsselected(value: boolean): void;

  hasIsghost(): boolean;
  clearIsghost(): void;
  getIsghost(): boolean;
  setIsghost(value: boolean): void;

  hasPosition(): boolean;
  clearPosition(): void;
  getPosition(): VectorProto | undefined;
  setPosition(value?: VectorProto): void;

  hasDestination(): boolean;
  clearDestination(): void;
  getDestination(): VectorProto | undefined;
  setDestination(value?: VectorProto): void;

  hasVelocity(): boolean;
  clearVelocity(): void;
  getVelocity(): VectorProto | undefined;
  setVelocity(value?: VectorProto): void;

  hasForce(): boolean;
  clearForce(): void;
  getForce(): VectorProto | undefined;
  setForce(value?: VectorProto): void;

  hasNodestination(): boolean;
  clearNodestination(): void;
  getNodestination(): boolean;
  setNodestination(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OrbProto.AsObject;
  static toObject(includeInstance: boolean, msg: OrbProto): OrbProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OrbProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OrbProto;
  static deserializeBinaryFromReader(message: OrbProto, reader: jspb.BinaryReader): OrbProto;
}

export namespace OrbProto {
  export type AsObject = {
    id: number,
    isselected: boolean,
    isghost: boolean,
    position?: VectorProto.AsObject,
    destination?: VectorProto.AsObject,
    velocity?: VectorProto.AsObject,
    force?: VectorProto.AsObject,
    nodestination: boolean,
  }
}

export class OrbsProto extends jspb.Message {
  clearOrbsList(): void;
  getOrbsList(): Array<OrbProto>;
  setOrbsList(value: Array<OrbProto>): void;
  addOrbs(value?: OrbProto, index?: number): OrbProto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OrbsProto.AsObject;
  static toObject(includeInstance: boolean, msg: OrbsProto): OrbsProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OrbsProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OrbsProto;
  static deserializeBinaryFromReader(message: OrbsProto, reader: jspb.BinaryReader): OrbsProto;
}

export namespace OrbsProto {
  export type AsObject = {
    orbsList: Array<OrbProto.AsObject>,
  }
}

export class ScoreProto extends jspb.Message {
  hasHost(): boolean;
  clearHost(): void;
  getHost(): number;
  setHost(value: number): void;

  hasChallenger(): boolean;
  clearChallenger(): void;
  getChallenger(): number;
  setChallenger(value: number): void;

  hasNeededtowin(): boolean;
  clearNeededtowin(): void;
  getNeededtowin(): number;
  setNeededtowin(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScoreProto.AsObject;
  static toObject(includeInstance: boolean, msg: ScoreProto): ScoreProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScoreProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScoreProto;
  static deserializeBinaryFromReader(message: ScoreProto, reader: jspb.BinaryReader): ScoreProto;
}

export namespace ScoreProto {
  export type AsObject = {
    host: number,
    challenger: number,
    neededtowin: number,
  }
}

export class DeltasProto extends jspb.Message {
  hasChallengerorbs(): boolean;
  clearChallengerorbs(): void;
  getChallengerorbs(): OrbsProto | undefined;
  setChallengerorbs(value?: OrbsProto): void;

  hasHostorbs(): boolean;
  clearHostorbs(): void;
  getHostorbs(): OrbsProto | undefined;
  setHostorbs(value?: OrbsProto): void;

  hasScore(): boolean;
  clearScore(): void;
  getScore(): ScoreProto | undefined;
  setScore(value?: ScoreProto): void;

  hasGamespeedmodifier(): boolean;
  clearGamespeedmodifier(): void;
  getGamespeedmodifier(): number;
  setGamespeedmodifier(value: number): void;

  hasServerlastprocessedinputnumber(): boolean;
  clearServerlastprocessedinputnumber(): void;
  getServerlastprocessedinputnumber(): number;
  setServerlastprocessedinputnumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeltasProto.AsObject;
  static toObject(includeInstance: boolean, msg: DeltasProto): DeltasProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeltasProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeltasProto;
  static deserializeBinaryFromReader(message: DeltasProto, reader: jspb.BinaryReader): DeltasProto;
}

export namespace DeltasProto {
  export type AsObject = {
    challengerorbs?: OrbsProto.AsObject,
    hostorbs?: OrbsProto.AsObject,
    score?: ScoreProto.AsObject,
    gamespeedmodifier: number,
    serverlastprocessedinputnumber: number,
  }
}

