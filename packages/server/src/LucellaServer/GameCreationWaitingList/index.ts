/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { LucellaServer } from "..";
import { SocketEventsFromServer } from "../../../../common";
import { FastRemovalQueue } from "../../data-structures/FastRemovalQueue";

export class GameCreationWaitingList {
  gameRoomsWaitingToStart = new FastRemovalQueue<string>();
  interval: NodeJS.Timeout | null = null;
  server: LucellaServer;
  numberOfGamesRemovedSinceLastUpdate = 0;
  constructor(server: LucellaServer) {
    this.server = server;
  }

  addGameRoom(gameName: string) {
    if (this.gameRoomsWaitingToStart.map.get(gameName)) return;
    this.gameRoomsWaitingToStart.enqueue(gameName);
    if (!this.interval) this.createWaitingListUpdateInterval();
    this.emitWaitingListUpdateInGameRoom(gameName, this.gameRoomsWaitingToStart.size);
  }
  emitWaitingListUpdateInGameRoom(gameName: string, waitingListPosition?: number, numberOfGamesRemovedSinceLastUpdate?: number) {
    const gameRoom = this.server.lobby.gameRooms[gameName];
    Object.values(gameRoom.players).forEach((player) => {
      const playerSocketId = player?.socketId;
      if (!playerSocketId) return console.log("tried to send GAME_CREATION_WAITING_LIST_UPDATE but found no socket id for player");
      const playerSocket = this.server.io.sockets.sockets.get(playerSocketId);
      if (!playerSocket) return console.log("tried to send GAME_CREATION_WAITING_LIST_UPDATE but found no socket");
      if (typeof waitingListPosition === "number") playerSocket.emit(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, waitingListPosition);
      if (typeof numberOfGamesRemovedSinceLastUpdate === "number")
        playerSocket.emit(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_NUMBER_OF_GAMES_DEQUEUED_SINCE_LAST_UPDATE, numberOfGamesRemovedSinceLastUpdate);
    });
  }
  removeGameRoom(gameName: string) {
    const removed = this.gameRoomsWaitingToStart.remove(gameName);
    this.numberOfGamesRemovedSinceLastUpdate += 1;
    console.log("removed game room: ", removed);
  }
  updateWaitingList() {
    console.log(
      "update waiting list\n number of games: ",
      Object.keys(this.server.games).length,
      "\n maxGames: ",
      this.server.config.maxConcurrentGames,
      "\n games in waiting list: ",
      this.gameRoomsWaitingToStart
    );
    if (!this.server.games || Object.keys(this.server.games).length <= 0) return this.clearWaitingListUpdateInterval(); // no games left
    while (this.gameRoomsWaitingToStart.head && (!this.server.games || Object.keys(this.server.games).length < this.server.config.maxConcurrentGames)) {
      // start this game
      const nameOfGameToStart = this.gameRoomsWaitingToStart.dequeue();
      this.numberOfGamesRemovedSinceLastUpdate += 1;
      if (!nameOfGameToStart) return console.log("dequeued gameName from waiting list but got null");
      const gameToStart = this.server.lobby.gameRooms[nameOfGameToStart];
      if (!gameToStart) return console.log("tried to start a game in the waiting list but no game by was found with the listed name");
      this.server.initiateGameStartCountdown(gameToStart);
      console.log("waiting list started game: ", nameOfGameToStart);
      if (!this.gameRoomsWaitingToStart.head) return this.clearWaitingListUpdateInterval();
    }
    // notify game rooms of their positions in line
    this.gameRoomsWaitingToStart.map.forEach((gameName) => {
      this.emitWaitingListUpdateInGameRoom(gameName, undefined, this.numberOfGamesRemovedSinceLastUpdate);
    });
    this.numberOfGamesRemovedSinceLastUpdate = 0;
  }
  createWaitingListUpdateInterval() {
    this.interval = setInterval(() => this.updateWaitingList(), this.server.config.gameCreationWaitingListLoopInterval);
  }
  clearWaitingListUpdateInterval() {
    console.log("clearing interval for game waiting list");
    if (this.interval) clearInterval(this.interval);
  }
}
