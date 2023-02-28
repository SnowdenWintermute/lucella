/* eslint-disable no-async-promise-executor */
import { io, Socket } from "socket.io-client";
import { CookieNames } from "../../../../common";
import createTestUser from "./createTestUser";
import logTestUserIn from "./logTestUserIn";

export default async function createLoggedInUsersWithConnectedSockets(usersToCreate: { email: string; elo?: number }[], socketUrl: string) {
  const clients: { [username: string]: Socket } = {};
  const userCreationAndSocketConnectionPromises: any[] = [];

  usersToCreate.forEach((userData) => {
    userCreationAndSocketConnectionPromises.push(
      new Promise(async (resolve, reject) => {
        const user = await createTestUser(userData.email.split("@")[0], userData.email, undefined, undefined, userData.elo);
        const loginResult = await logTestUserIn(user.email);
        const userSocket = io(socketUrl, {
          transports: ["websocket"],
          extraHeaders: { cookie: `${CookieNames.ACCESS_TOKEN}=${loginResult.accessToken};` },
        });
        clients[user.name] = userSocket;
        resolve(true);
      })
    );
  });

  await Promise.all(userCreationAndSocketConnectionPromises);

  return clients;
}
