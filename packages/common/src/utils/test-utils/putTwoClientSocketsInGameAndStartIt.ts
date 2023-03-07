import { Socket } from "socket.io-client";
import { SocketEventsFromClient, SocketEventsFromServer } from "../../index";

export function putTwoClientSocketsInGameAndStartIt(socket1: Socket, socket2: Socket, gameName: string) {
  return new Promise((resolve, reject) => {
    if (!socket1.connected || !socket2.connected) {
      // eslint-disable-next-line no-promise-executor-return
      return reject(new Error(`${gameName} tried to start a game between two sockets but one of them was not connected`));
    }

    const eventsOccurred = {
      client2JoinedGame: false,
      client1ClickedReady: false,
      client2ClickedReady: false,
      client1GotCompressedGamePacket: false,
    };

    socket1.on(SocketEventsFromServer.COMPRESSED_GAME_PACKET, (data) => {
      if (!eventsOccurred.client1GotCompressedGamePacket) {
        eventsOccurred.client1GotCompressedGamePacket = true;
        // console.log(`${socket1.id} putTwoClientSocketsInGameAndStartIt got compressed game packet in game ${gameName}`);
        resolve(true);
      }
    });

    socket2.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
      if (!data) return;
      if (!eventsOccurred.client2ClickedReady) {
        socket2.emit(SocketEventsFromClient.CLICKS_READY);
        eventsOccurred.client2ClickedReady = true;
      }
    });

    socket1.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
      if (!data) return;
      if (!eventsOccurred.client2JoinedGame) {
        socket2.emit(SocketEventsFromClient.JOINS_GAME, gameName);
        eventsOccurred.client2JoinedGame = true;
      }
      if (!eventsOccurred.client1ClickedReady) {
        eventsOccurred.client1ClickedReady = true;
        socket1.emit(SocketEventsFromClient.CLICKS_READY);
      }
    });

    socket1.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameName);
  });
}
