// package: 
// file: src/proto/cs-game-state-deltas.proto

import * as jspb from "google-protobuf";

export class Vec2Proto extends jspb.Message {
  hasX(): boolean;
  clearX(): void;
  getX(): number;
  setX(value: number): void;

  hasY(): boolean;
  clearY(): void;
  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vec2Proto.AsObject;
  static toObject(includeInstance: boolean, msg: Vec2Proto): Vec2Proto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vec2Proto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vec2Proto;
  static deserializeBinaryFromReader(message: Vec2Proto, reader: jspb.BinaryReader): Vec2Proto;
}

export namespace Vec2Proto {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class Vec3Proto extends jspb.Message {
  hasX(): boolean;
  clearX(): void;
  getX(): number;
  setX(value: number): void;

  hasY(): boolean;
  clearY(): void;
  getY(): number;
  setY(value: number): void;

  hasZ(): boolean;
  clearZ(): void;
  getZ(): number;
  setZ(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vec3Proto.AsObject;
  static toObject(includeInstance: boolean, msg: Vec3Proto): Vec3Proto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Vec3Proto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vec3Proto;
  static deserializeBinaryFromReader(message: Vec3Proto, reader: jspb.BinaryReader): Vec3Proto;
}

export namespace Vec3Proto {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class VerticesProto extends jspb.Message {
  clearVerticesList(): void;
  getVerticesList(): Array<Vec2Proto>;
  setVerticesList(value: Array<Vec2Proto>): void;
  addVertices(value?: Vec2Proto, index?: number): Vec2Proto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerticesProto.AsObject;
  static toObject(includeInstance: boolean, msg: VerticesProto): VerticesProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerticesProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerticesProto;
  static deserializeBinaryFromReader(message: VerticesProto, reader: jspb.BinaryReader): VerticesProto;
}

export namespace VerticesProto {
  export type AsObject = {
    verticesList: Array<Vec2Proto.AsObject>,
  }
}

export class EntityProto extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  hasPosition(): boolean;
  clearPosition(): void;
  getPosition(): Vec3Proto | undefined;
  setPosition(value?: Vec3Proto): void;

  hasAngle(): boolean;
  clearAngle(): void;
  getAngle(): number;
  setAngle(value: number): void;

  hasVertices(): boolean;
  clearVertices(): void;
  getVertices(): VerticesProto | undefined;
  setVertices(value?: VerticesProto): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntityProto.AsObject;
  static toObject(includeInstance: boolean, msg: EntityProto): EntityProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EntityProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EntityProto;
  static deserializeBinaryFromReader(message: EntityProto, reader: jspb.BinaryReader): EntityProto;
}

export namespace EntityProto {
  export type AsObject = {
    id: number,
    position?: Vec3Proto.AsObject,
    angle: number,
    vertices?: VerticesProto.AsObject,
  }
}

export class EntitiesProto extends jspb.Message {
  clearEntitiesList(): void;
  getEntitiesList(): Array<EntityProto>;
  setEntitiesList(value: Array<EntityProto>): void;
  addEntities(value?: EntityProto, index?: number): EntityProto;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntitiesProto.AsObject;
  static toObject(includeInstance: boolean, msg: EntitiesProto): EntitiesProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EntitiesProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EntitiesProto;
  static deserializeBinaryFromReader(message: EntitiesProto, reader: jspb.BinaryReader): EntitiesProto;
}

export namespace EntitiesProto {
  export type AsObject = {
    entitiesList: Array<EntityProto.AsObject>,
  }
}

export class CSGameStateProto extends jspb.Message {
  hasPlayercontrolledentities(): boolean;
  clearPlayercontrolledentities(): void;
  getPlayercontrolledentities(): EntitiesProto | undefined;
  setPlayercontrolledentities(value?: EntitiesProto): void;

  hasMobileentities(): boolean;
  clearMobileentities(): void;
  getMobileentities(): EntitiesProto | undefined;
  setMobileentities(value?: EntitiesProto): void;

  hasStaticentities(): boolean;
  clearStaticentities(): void;
  getStaticentities(): EntitiesProto | undefined;
  setStaticentities(value?: EntitiesProto): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CSGameStateProto.AsObject;
  static toObject(includeInstance: boolean, msg: CSGameStateProto): CSGameStateProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CSGameStateProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CSGameStateProto;
  static deserializeBinaryFromReader(message: CSGameStateProto, reader: jspb.BinaryReader): CSGameStateProto;
}

export namespace CSGameStateProto {
  export type AsObject = {
    playercontrolledentities?: EntitiesProto.AsObject,
    mobileentities?: EntitiesProto.AsObject,
    staticentities?: EntitiesProto.AsObject,
  }
}

