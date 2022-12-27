import io, { Socket } from "socket.io-client";
import { battleRoomDefaultChatChannel, ChatMessage, randBetween, SocketEventsFromClient, SocketEventsFromServer } from "@lucella/common";
import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import { lucella } from "../../lucella";
import PGContext from "../../utils/PGContext";
import setupExpressRedisAndPgContextAndOneTestUser from "../../utils/test-utils/setupExpressRedisAndPgContextAndOneTestUser";
import { LucellaServer } from "../LucellaServer";
import { wrappedRedis } from "../../utils/RedisContext";

let context: PGContext | undefined;
let app: Application | undefined;
let httpServer: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
let clientSocket: Socket;
// let clientSocket2:Socket
const port = Math.round(randBetween(8081, 65535));
beforeAll((done) => {
  async function setupForTests() {
    const { pgContext, expressApp } = await setupExpressRedisAndPgContextAndOneTestUser();
    context = pgContext;
    app = expressApp;
    httpServer = app.listen(port, () => {
      lucella.server = new LucellaServer(httpServer);
      clientSocket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        // extraHeaders: { cookie: `access_token=${accessToken};` },
      });
      clientSocket.on("connect", done);
      console.log(`test server on ${port}`);
    });
  }
  setupForTests();
});

beforeEach(async () => {
  await wrappedRedis.context!.removeAllKeys();
});

afterAll(async () => {
  if (context) await context.cleanup();
  await wrappedRedis.context!.cleanup();
  lucella.server?.io.close();
  httpServer?.close();
});

describe("lobby", () => {
  it(`
    client receives a welcome message after joining a chat channel and
    after sending a chat message in a channel the client gets its own message back`, (done) => {
    const receivedMessages: ChatMessage[] = [];
    clientSocket.on(SocketEventsFromServer.NEW_CHAT_MESSAGE, (message) => {
      console.log(message);
      receivedMessages.push(message);
      if (receivedMessages.length !== 2) return;
      expect(receivedMessages[0].text).toBe("Welcome to battle-room-chat.");
      expect(receivedMessages[1].text).toBe("ayy");
      done();
    });
    clientSocket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, battleRoomDefaultChatChannel);
    clientSocket.on(SocketEventsFromServer.CHAT_ROOM_UPDATE, (data) => {
      console.log("chat room update: ", data);
    });
    clientSocket.emit(SocketEventsFromClient.NEW_CHAT_MESSAGE, new ChatMessage("ayy"));
  });
});
