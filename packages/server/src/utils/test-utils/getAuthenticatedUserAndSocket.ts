import { io, Socket } from "socket.io-client";
import { CookieNames, User } from "../../../../common";
import UserRepo from "../../database/repos/users";
import createTestUser from "./createTestUser";
import logTestUserIn from "./logTestUserIn";

export default async function getAuthenticatedUserAndSocket(socketServerUrl: string, username: string, email: string, elo?: number): Promise<[User, Socket]> {
  let user = await UserRepo.findOne("email", email);
  if (!user) {
    console.log("user not found, creating user: ", username);
    user = await createTestUser(username, email, undefined, undefined, elo);
  }
  const userWithAccessToken = await logTestUserIn(email);
  const socket = io(socketServerUrl, {
    transports: ["websocket"],
    extraHeaders: { cookie: `${CookieNames.ACCESS_TOKEN}=${userWithAccessToken.accessToken};` },
  });
  return [user, socket];
}
