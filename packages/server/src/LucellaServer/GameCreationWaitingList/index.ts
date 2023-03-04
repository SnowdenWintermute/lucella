/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { LucellaServer } from "..";
import { SocketEventsFromServer } from "../../../../common";
import { FastRemovalQueue } from "../../data-structures/FastRemovalQueue";

export class GameCreationWaitingList {
  gameRoomsWaitingToStart = new FastRemovalQueue<string>();
  interval: NodeJS.Timeout | null = null;
  server: LucellaServer;
  constructor(server: LucellaServer) {
    this.server = server;
  }

  addGameRoom(gameName: string) {
    if (this.gameRoomsWaitingToStart.map.get(gameName)) return;
    this.gameRoomsWaitingToStart.enqueue(gameName);
    if (!this.interval) this.createWaitingListUpdateInterval();
    this.emitWaitingListUpdateInGameRoom(gameName, this.gameRoomsWaitingToStart.size);
  }
  emitWaitingListUpdateInGameRoom(gameName: string, waitingListPosition: number) {
    const gameRoom = this.server.lobby.gameRooms[gameName];
    if (!gameRoom) {
      console.log(`tried to update gameRoom ${gameName} but couldn't find it`);
      this.removeGameRoom(gameName);
    } else this.server.io.in(gameRoom.chatChannel).emit(SocketEventsFromServer.GAME_CREATION_WAITING_LIST_POSITION, waitingListPosition);
  }
  removeGameRoom(gameName: string) {
    const removed = this.gameRoomsWaitingToStart.remove(gameName);
    console.log("removed game room: ", removed);
    if (!this.gameRoomsWaitingToStart.head) return this.clearWaitingListUpdateInterval();
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

    while (
      this.gameRoomsWaitingToStart.head &&
      (!this.server.games ||
        Object.keys(this.server.games).length + Object.keys(this.server.lobby.gameRoomsExecutingGameStartCountdown).length <
          this.server.config.maxConcurrentGames)
    ) {
      // check if the game has two players and both are ready, then start this game
      const nameOfGameToStart = this.gameRoomsWaitingToStart.dequeue();
      if (!nameOfGameToStart) return console.log("dequeued gameName from waiting list but got null");
      const gameToStart = this.server.lobby.gameRooms[nameOfGameToStart];
      if (!gameToStart) return console.log("tried to start a game in the waiting list but no game by was found with the listed name");
      if (!(gameToStart.players.host && gameToStart.players.challenger)) return console.log("tried to start a game but one of the players was missing");
      if (!(gameToStart.playersReady.host && gameToStart.playersReady.challenger))
        return console.log("tried to start a game but one of the players wasn't ready");
      this.server.initiateGameStartCountdown(gameToStart);
      console.log("waiting list started game: ", nameOfGameToStart);
      if (!this.gameRoomsWaitingToStart.head) return this.clearWaitingListUpdateInterval();
    }
    // notify game rooms of their positions in line
    let currentPosition = 1;
    let currentNode = this.gameRoomsWaitingToStart.head;
    while (currentNode) {
      this.emitWaitingListUpdateInGameRoom(currentNode.value, currentPosition);
      currentPosition += 1;
      currentNode = currentNode.next;
    }
  }
  createWaitingListUpdateInterval() {
    this.interval = setInterval(() => this.updateWaitingList(), this.server.config.gameCreationWaitingListLoopInterval);
  }
  clearWaitingListUpdateInterval() {
    console.log("clearing interval for game waiting list");
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
}
