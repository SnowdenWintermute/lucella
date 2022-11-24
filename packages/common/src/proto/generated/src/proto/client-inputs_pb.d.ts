// package: lucella
// file: src/proto/client-inputs.proto

import * as jspb from "google-protobuf";

export class SmallVectorProto extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SmallVectorProto.AsObject;
  static toObject(includeInstance: boolean, msg: SmallVectorProto): SmallVectorProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SmallVectorProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SmallVectorProto;
  static deserializeBinaryFromReader(message: SmallVectorProto, reader: jspb.BinaryReader): SmallVectorProto;
}

export namespace SmallVectorProto {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class InputProto extends jspb.Message {
  getType(): number;
  setType(value: number): void;

  getNumber(): number;
  setNumber(value: number): void;

  clearOrbidsList(): void;
  getOrbidsList(): Array<number>;
  setOrbidsList(value: Array<number>): void;
  addOrbids(value: number, index?: number): number;

  hasMouseposition(): boolean;
  clearMouseposition(): void;
  getMouseposition(): SmallVectorProto | undefined;
  setMouseposition(value?: SmallVectorProto): void;

  hasYonly(): boolean;
  clearYonly(): void;
  getYonly(): number;
  setYonly(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InputProto.AsObject;
  static toObject(includeInstance: boolean, msg: InputProto): InputProto.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InputProto, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InputProto;
  static deserializeBinaryFromReader(message: InputProto, reader: jspb.BinaryReader): InputProto;
}

export namespace InputProto {
  export type AsObject = {
    type: number,
    number: number,
    orbidsList: Array<number>,
    mouseposition?: SmallVectorProto.AsObject,
    yonly: number,
  }
}

