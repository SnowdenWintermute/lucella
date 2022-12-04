import { defineConfig } from "cypress";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../common";
import { TaskNames } from "./cypress/support/TaskNames";
const io = require("socket.io-client");

let socket: Socket;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        [TaskNames.connectSocket]: () => {
          socket = io("http://localhost:8080" || "", {
            transports: ["websocket"],
            withCredentials: true,
            // reconnectionAttempts: 3,
          });
          return null;
        },
        [TaskNames.disconnectSocket]: () => {
          socket.disconnect();
          return null;
        },
        [TaskNames.joinChatChannel]: (channelName) => {
          socket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, channelName);
          return null;
        },
        [TaskNames.sendChatMessage]: (message) => {
          socket.emit(SocketEventsFromClient.NEW_CHAT_MESSAGE, message);
          return null;
        },
        [TaskNames.hostGame]: (gameName) => {
          socket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameName);
          return null;
        },
        [TaskNames.leaveGame]: (gameName) => {
          socket.emit(SocketEventsFromClient.LEAVES_GAME, gameName);
          return null;
        },
      });
      return config;
    },
  },
});
