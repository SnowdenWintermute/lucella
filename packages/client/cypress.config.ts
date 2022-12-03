import { defineConfig } from "cypress";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient } from "../common";
const io = require("socket.io-client");

let socket: Socket;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        connectSocket: (username: string) => {
          socket = io("http://localhost:8080" || "", {
            transports: ["websocket"],
            withCredentials: true,
          });
          console.log(socket.id + " socket id");
          return null;
        },
        sendChatMessage: (message) => {
          console.log(socket.id + " socket id from chat message");
          socket.emit(SocketEventsFromClient.NEW_CHAT_MESSAGE, "other user says hi");
          return null;
        },
      });
      return config;
    },
  },
});
