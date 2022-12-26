import { SocketMetadata } from "../../../common";

export type SocketMetadataList = {
  [socketId: string]: SocketMetadata;
};

export type SocketIDsByUsername = {
  [username: string]: string[];
};
