import axios from "axios";
import { defineConfig } from "cypress";
import { Socket } from "socket.io-client";
import { CypressTestRoutePaths, SocketEventsFromClient } from "../common";
import { TaskNames } from "./cypress/support/TaskNames";
import { makeEmailAccount } from "./cypress/support/email-account";
const io = require("socket.io-client");

let socket: Socket;

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 60000,
    // baseUrl: "localhost:3000",
    async setupNodeEvents(on, config) {
      const emailAccount = await makeEmailAccount();
      on("task", {
        [TaskNames.setRateLimiterDisabled]: async (args) => {
          try {
            const response = await axios({
              method: "put",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.RATE_LIMITER}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, rateLimiterDisabled: args.rateLimiterDisabled },
            });
            console.log("disableRateLimiter status: ", response.status);
            return { status: response.status };
          } catch (error: any) {
            console.log("setRateLimiterDisabled: ", error);
            return error;
          }
        },
        [TaskNames.deleteAllTestUsers]: async (args) => {
          console.log(
            "DELETE ALL TEST USERS URL: ",
            `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`
          );
          try {
            const response = await axios({
              method: "put",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, email: args.email || null },

              headers: { "content-type": "application/json" },
            });
            console.log("deleteTestUsers status: ", response.status);
            // @ts-ignore
            return { body: response.body, status: response.status };
          } catch (error: any) {
            console.log("deleteAllUsers: ", error, error.response.data);
            return error;
          }
        },
        [TaskNames.createCypressTestUser]: async (args) => {
          try {
            const response = await axios({
              method: "post",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.CREATE_CYPRESS_TEST_USER}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, email: args.email || null },
              headers: { "content-type": "application/json" },
            });
            // @ts-ignore
            return { body: response.body, status: response.status };
          } catch (error: any) {
            console.log("createtestuser: ", error);
            return error;
          }
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
          if (socket) socket.disconnect();
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
            console.log("last email subject: ", lastEmail?.subject);
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
