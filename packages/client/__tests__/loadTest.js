/* eslint-disable no-promise-executor-return */
const io = require("socket.io-client");
const { SocketEventsFromClient, SocketEventsFromServer, UserInput, UserInputs, Point, randBetween, baseWindowDimensions } = require("../../common");
const serializeInput = require("./serializeInputForLoadTest");

// const websiteAddress = "http://localhost:8080";
const websiteAddress = "https://melphina.com";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function emitRandomMoveCommands(socket, numberOfCommands) {
  for (let i = numberOfCommands; i > 0; i -= 1) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(33);
    socket.emit(
      SocketEventsFromClient.NEW_INPUT,
      serializeInput(
        new UserInput(UserInputs.SELECT_ORBS, {
          orbIds: [Math.round(randBetween(1, 5))],
          mousePosition: new Point(Math.round(randBetween(0, baseWindowDimensions.width)), Math.round(randBetween(0, baseWindowDimensions.height))),
        })
      )
    );
    if (i === 0) socket.disconnect();
  }
}

async function loadTest() {
  const numberOfClients = 300;
  const numberOfGameInputsEachClientShouldSend = 5000;

  for (let i = numberOfClients; i > 1; i -= 1) {
    sleep(Math.max(i * 50)).then(() => {
      const hostSocket = io(websiteAddress, { transports: ["websocket"] });
      const challengerSocket = io(websiteAddress, { transports: ["websocket"] });
      let hostReadied = false;
      let challengerReadied = false;
      let hostReceivedInitialGamePacket = false;
      let challengerReceivedInitialGamePacket = false;
      hostSocket.emit(SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, "battle-room-chat");
      hostSocket.on(SocketEventsFromServer.CHAT_CHANNEL_UPDATE, async () => {
        hostSocket.emit(SocketEventsFromClient.NEW_CHAT_MESSAGE, { text: "ayy", timestamp: 1234567 });
        hostSocket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, `${i}`);
      });

      hostSocket.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
        if (data?.gameName && !hostReadied) {
          hostSocket.emit(SocketEventsFromClient.CLICKS_READY);
          hostReadied = true;
        }
        challengerSocket.emit(SocketEventsFromClient.JOINS_GAME, `${i}`);
      });

      challengerSocket.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, async (data) => {
        if (data?.gameName && !challengerReadied) {
          challengerSocket.emit(SocketEventsFromClient.CLICKS_READY);
          challengerReadied = true;
        }
      });

      hostSocket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async () => {
        if (!hostReceivedInitialGamePacket) {
          hostReceivedInitialGamePacket = true;
          emitRandomMoveCommands(hostSocket, numberOfGameInputsEachClientShouldSend);
        }
      });
      challengerSocket.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, async () => {
        if (!challengerReceivedInitialGamePacket) {
          challengerReceivedInitialGamePacket = true;
          emitRandomMoveCommands(challengerSocket, numberOfGameInputsEachClientShouldSend);
        }
      });
    });
  }
}

loadTest();
