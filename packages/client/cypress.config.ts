/* eslint-disable prefer-destructuring */
import axios from "axios";
import { defineConfig } from "cypress";
import { Socket } from "socket.io-client";
import {
  AuthRoutePaths,
  ConfigRoutePaths,
  CypressTestRoutePaths,
  ONE_SECOND,
  putTwoClientSocketsInGameAndStartIt,
  putTwoSocketClientsInRoomAndHaveBothReadyUp,
  SocketEventsFromClient,
  SocketEventsFromServer,
} from "../common";
import { TaskNames } from "./cypress/support/TaskNames";
import { makeEmailAccount } from "./cypress/support/email-account";
import { cypressCloudProjectId } from "./cypress/support/consts";
const io = require("socket.io-client");

const users: {
  [name: string]: {
    socket: Socket | undefined;
    accessToken: string | undefined;
  };
} = {};

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 25 * ONE_SECOND,
    projectId: cypressCloudProjectId,
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    async setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
      require("cypress-terminal-report/src/installLogsPrinter")(on); // provides better logs in ci
      const emailAccount = await makeEmailAccount();
      on("task", {
        [TaskNames.setRateLimiterDisabled]: async (args) => {
          try {
            const response = await axios({
              method: "put",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.RATE_LIMITER}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, rateLimiterDisabled: args.rateLimiterDisabled },
            });
            return { status: response.status };
          } catch (error: any) {
            console.log("setRateLimiterDisabled: ", error);
            return error;
          }
        },
        [TaskNames.setMaxConcurrentGames]: async (args) => {
          try {
            const response = await axios({
              method: "put",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${ConfigRoutePaths.MAX_CONCURRENT_GAMES}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, maxConcurrentGames: args.maxConcurrentGames },
            });
            return { status: response.status };
          } catch (error: any) {
            console.log("setMaxConcurrentGames: ", error);
            return error;
          }
        },
        [TaskNames.deleteAllTestUsers]: async (args) => {
          try {
            const response = await axios({
              method: "put",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.DROP_ALL_TEST_USERS}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, email: args.email || null },

              headers: { "content-type": "application/json" },
            });
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
              data: { testerKey: args.CYPRESS_TESTER_KEY, name: args.name || null, email: args.email || null, elo: args.elo, role: args.role },
              headers: { "content-type": "application/json" },
            });
            // @ts-ignore
            return { body: response.body, status: response.status };
          } catch (error: any) {
            console.log("createtestuser: ", error);
            return error;
          }
        },
        [TaskNames.createSequentialEloTestUsers]: async (args) => {
          const { numberToCreate, eloOfFirst, eloBetweenEach } = args;
          try {
            const response = await axios({
              method: "post",
              url: `${args.CYPRESS_BACKEND_URL}/api${CypressTestRoutePaths.ROOT}${CypressTestRoutePaths.CREATE_SEQUENTIAL_ELO_TEST_USERS}`,
              data: { testerKey: args.CYPRESS_TESTER_KEY, numberToCreate, eloOfFirst, eloBetweenEach },
              headers: { "content-type": "application/json" },
            });
            // @ts-ignore
            return { data: response.data, status: response.status };
          } catch (error: any) {
            console.log("createSequentialEloUsers: ", error);
            return error;
          }
        },
        [TaskNames.logUserIn]: async ({ name, email, password }: { name: string; email: string; password: string }) => {
          try {
            const response = await axios({
              method: "post",
              url: `http://localhost:8080/api${AuthRoutePaths.ROOT}`,
              data: { email, password },
              headers: { "content-type": "application/json" },
            });
            if (!users[name]) users[name] = { socket: undefined, accessToken: undefined };
            users[name].accessToken = response.headers["set-cookie"]?.join("");
            return { status: response.status };
          } catch (error) {
            console.log(error);
            return error;
          }
        },
        [TaskNames.connectSocket]: async (args: { username: string; withHeaders?: boolean }) => {
          const { username, withHeaders } = args;
          if (!users[username]) users[username] = { socket: undefined, accessToken: undefined };
          const getConnectedSocket = new Promise((resolve, reject) => {
            if (withHeaders) {
              console.log(`connecting user ${username}'s socket with accessToken: ${users[username].accessToken}`);
              users[username].socket = io("http://localhost:8080" || "", {
                transports: ["websocket"],
                withCredentials: true,
                // reconnectionAttempts: 3,
                extraHeaders: {
                  cookie: users[username].accessToken,
                },
              });
            } else {
              users[username].socket = io("http://localhost:8080" || "", {
                transports: ["websocket"],
                withCredentials: true,
                // reconnectionAttempts: 3,
              });
            }
            users[username].socket?.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
              console.log("socket auth completed for socket: ", users[username].socket?.id);
              users[username].socket?.off(SocketEventsFromServer.AUTHENTICATION_COMPLETE);
              resolve(true);
            });
          });
          await getConnectedSocket;
          return null;
        },
        [TaskNames.disconnectSocket]: ({ username }) => {
          if (users[username]) users[username].socket?.disconnect();
          return null;
        },
        [TaskNames.disconnectAllSockets]: () => {
          Object.values(users).forEach((user) => {
            if (user.socket) user.socket.disconnect();
          });
          return null;
        },
        [TaskNames.socketEmit]: (taskData: { username: string; event: SocketEventsFromClient; data: any }) => {
          const { username, event, data } = taskData;
          if (!users[username].socket) console.error(`tried to emit event ${event} but no socket was found`);
          users[username].socket?.emit(event, data);
          return null;
        },
        [TaskNames.putTwoSocketsInGameAndStartIt]: async ({ username1, username2, gameName }: { username1: string; username2: string; gameName: string }) => {
          if (!users[username1].socket || !users[username2].socket) return new Error("tried to start a game but one of the sockets wasn't found");
          await putTwoClientSocketsInGameAndStartIt(users[username1].socket!, users[username2].socket!, gameName);
          return null;
        },
        [TaskNames.putTwoSocketClientsInRoomAndHaveBothReadyUp]: async ({
          username1,
          username2,
          gameName,
        }: {
          username1: string;
          username2: string;
          gameName: string;
        }) => {
          if (!users[username1].socket || !users[username2].socket) return new Error("tried to have two players ready up but one of the sockets wasn't found");
          await putTwoSocketClientsInRoomAndHaveBothReadyUp(users[username1].socket!, users[username2].socket!, gameName);
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
