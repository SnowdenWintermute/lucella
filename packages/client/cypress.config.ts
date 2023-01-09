import axios from "axios";
import { defineConfig } from "cypress";
import { Socket } from "socket.io-client";
import { SocketEventsFromClient, UsersRoutePaths } from "../common";
import { TaskNames } from "./cypress/support/TaskNames";
import { makeEmailAccount } from "./cypress/support/email-account";
const io = require("socket.io-client");

let socket: Socket;

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 6000,
    async setupNodeEvents(on, config) {
      const emailAccount = await makeEmailAccount();

      on("task", {
        [TaskNames.deleteAllTestUsers]: async (args) => {
          const response = await axios({
            method: "put",
            url: `${args.CYPRESS_BACKEND_URL}/api${UsersRoutePaths.ROOT}${UsersRoutePaths.DROP_ALL_TEST_USERS}`,
            data: { testerKey: args.CYPRESS_TESTER_KEY, email: args.email || null },

            headers: { "content-type": "application/json" },
          });
          // @ts-ignore
          return { body: response.body, status: response.status };
        },
        [TaskNames.createCypressTestUser]: async (args) => {
          const response = await axios({
            method: "post",
            url: `${args.CYPRESS_BACKEND_URL}/api${UsersRoutePaths.ROOT}${UsersRoutePaths.CREATE_CYPRESS_TEST_USER}`,
            data: { testerKey: args.CYPRESS_TESTER_KEY, email: args.email || null },
            headers: { "content-type": "application/json" },
          });
          // @ts-ignore
          return { body: response.body, status: response.status };
        },
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
        [TaskNames.getUserEmail]: () => {
          console.log("emailAccount.email: ", emailAccount.email);
          return emailAccount.email;
        },
        [TaskNames.getLastEmail]: async () => {
          try {
            const lastEmail = await emailAccount.getLastEmail();
            return lastEmail;
          } catch (error) {
            console.log("error in getLastEmail");
            return null;
          }
        },
      });
      return config;
    },
  },
});
