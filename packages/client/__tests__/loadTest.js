/* eslint-disable no-promise-executor-return */
const io = require("socket.io-client");
const { SocketEventsFromClient, SocketEventsFromServer, PlayerAction, PlayerActions, Point, randBetween, baseWindowDimensions } = require("../../common");
const serializeInput = require("./serializeInputForLoadTest");

// const websiteAddress = "http://localhost:8080";
const websiteAddress = "https://battleschool.io";

async function emitRandomMoveCommands(socket, numberOfCommands) {
  let count = 0;
  let timeout;
  function loopCommands() {
    socket.emit(
      SocketEventsFromClient.NEW_INPUT,
      serializeInput(
        new PlayerAction(PlayerActions.SELECT_ORBS, {
          orbIds: [Math.round(randBetween(1, 5))],
          mousePosition: new Point(Math.round(randBetween(0, baseWindowDimensions.width)), Math.round(randBetween(0, baseWindowDimensions.height))),
        })
      )
    );
    count += 1;
    if (count >= numberOfCommands) {
      clearTimeout(timeout);
      socket.disconnect();
    } else timeout = setTimeout(loopCommands, 33);
  }
  loopCommands();
}

async function loadTest() {
  const numberOfClientPairs = 15;
  const numberOfGameInputsEachClientShouldSend = 5000;

  for (let i = numberOfClientPairs; i > 0; i -= 1) {
    setTimeout(() => {
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

      hostSocket.on(SocketEventsFromServer.CURRENT_GAME_ROOM, (data) => {
        if (data?.gameName && !hostReadied) {
          hostSocket.emit(SocketEventsFromClient.CLICKS_READY);
          hostReadied = true;
        }
        challengerSocket.emit(SocketEventsFromClient.JOINS_GAME, `${i}`);
      });

      challengerSocket.on(SocketEventsFromServer.CURRENT_GAME_ROOM, async (data) => {
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
    }, i * 50);
  }
}

loadTest();
