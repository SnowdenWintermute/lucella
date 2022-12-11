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
        [TaskNames.socketEmit]: (taskData: { event: SocketEventsFromClient; data: any }) => {
          const { event, data } = taskData;
          socket.emit(event, data);
          return null;
        },
      });
      return config;
    },
  },
});
