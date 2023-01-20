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
    defaultCommandTimeout: 20000,
    baseUrl: "http://localhost:3001",
    async setupNodeEvents(on, config) {
      const emailAccount = await makeEmailAccount();

      on("task", {
        [TaskNames.setRateLimiterDisabled]: async (args) => {
          const response = await axios({
            method: "put",
            url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.RATE_LIMITER}`,
            data: { testerKey: args.CYPRESS_TESTER_KEY, rateLimiterDisabled: args.rateLimiterDisabled },
          });
          return { status: response.status };
        },
        "log url": (args) => {
          console.log(
            "DELETE ALL TEST USERS URL: ",
            `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`
          );
          console.log(
            "sliced: ",
            `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`.split("").join("-").slice(0, 25)
          );
          return `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`;
        },
        [TaskNames.deleteAllTestUsers]: async (args) => {
          console.log(
            "DELETE ALL TEST USERS URL: ",
            `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`
          );
          const response = await axios({
            method: "put",
            url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`,
            data: { testerKey: args.CYPRESS_TESTER_KEY, email: args.email || null },

            headers: { "content-type": "application/json" },
          });
          // @ts-ignore
          return { body: response.body, status: response.status };
        },
        [TaskNames.createCypressTestUser]: async (args) => {
          const response = await axios({
            method: "post",
            url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.CREATE_CYPRESS_TEST_USER}`,
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
