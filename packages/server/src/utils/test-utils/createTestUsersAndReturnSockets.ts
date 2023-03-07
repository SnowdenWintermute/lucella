/* eslint-disable no-async-promise-executor */
import { io, Socket } from "socket.io-client";
import { CookieNames, GENERIC_SOCKET_EVENTS, SocketEventsFromServer } from "../../../../common";
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
        userSocket.on(SocketEventsFromServer.ERROR_MESSAGE, (data) => console.error(`${user.name} got error: ${data}`));
        userSocket.on(GENERIC_SOCKET_EVENTS.CONNECT_ERROR, () => {
          console.log(`${user.name}'s socket unable to connect`);
          reject(new Error(`${user.name}'s socket unable to connect`));
        });
        userSocket.on(SocketEventsFromServer.AUTHENTICATION_COMPLETE, () => {
          console.log(`${user.name}'s socket connected and authorized`);
          userSocket.off(SocketEventsFromServer.AUTHENTICATION_COMPLETE);
          userSocket.off(GENERIC_SOCKET_EVENTS.CONNECT_ERROR);
          resolve(true);
        });
      })
    );
  });

  await Promise.all(userCreationAndSocketConnectionPromises);

  return clients;
}
