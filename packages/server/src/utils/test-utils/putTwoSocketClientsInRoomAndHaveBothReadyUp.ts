import { Socket } from "socket.io-client";
import { SocketEventsFromClient, SocketEventsFromServer } from "../../../../common";

export default function putTwoSocketClientsInRoomAndHaveBothReadyUp(socket1: Socket, socket2: Socket, gameName: string) {
  return new Promise((resolve, reject) => {
    const eventsOccurred = {
      socket1HostedGame: false,
      socket2JoinedGame: false,
      socket1ClickedReady: false,
      socket2ClickedReady: false,
    };

    socket2.on(SocketEventsFromServer.PLAYER_READINESS_UPDATE, (data) => {
      console.log(
        "PLAYER_READINESS_UPDATE: ",
        data,
        Object.values(data).every((value) => value),
        gameName
      );
      if (Object.values(data).every((value) => value)) resolve(true);
    });
    socket1.on(SocketEventsFromServer.PLAYER_READINESS_UPDATE, (data) => {
      console.log(
        "PLAYER_READINESS_UPDATE: ",
        data,
        Object.values(data).every((value) => value),
        gameName
      );
      if (Object.values(data).every((value) => value)) resolve(true);
    });

    socket2.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
      if (!data) return;
      if (!eventsOccurred.socket2ClickedReady) {
        socket2.emit(SocketEventsFromClient.CLICKS_READY);
        eventsOccurred.socket2ClickedReady = true;
      }
    });

    socket1.on(SocketEventsFromServer.CURRENT_GAME_ROOM_UPDATE, (data) => {
      if (!data) return;
      if (!eventsOccurred.socket2JoinedGame) {
        eventsOccurred.socket2JoinedGame = true;
        socket2.emit(SocketEventsFromClient.JOINS_GAME, gameName);
        console.log(`${socket2.id}attempted to join game ${gameName}`);
      }
      if (!eventsOccurred.socket1ClickedReady) {
        eventsOccurred.socket1ClickedReady = true;
        socket1.emit(SocketEventsFromClient.CLICKS_READY);
      }
    });

    socket1.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameName);
  });
}
