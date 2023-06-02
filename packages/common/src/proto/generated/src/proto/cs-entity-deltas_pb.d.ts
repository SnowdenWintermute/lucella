// package: 
// file: src/proto/cs-entity-deltas.proto

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

export class EntityProto extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasPosition(): boolean;
  clearPosition(): void;
  getPosition(): VectorProto | undefined;
  setPosition(value?: VectorProto): void;

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
    id: string,
    position?: VectorProto.AsObject,
  }
}

