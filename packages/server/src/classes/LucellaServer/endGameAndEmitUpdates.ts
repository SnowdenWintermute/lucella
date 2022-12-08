import { BattleRoomGame, EloUpdates, gameChannelNamePrefix, GameStatus, SocketEventsFromServer } from "@lucella/common";
import { LucellaServer } from ".";
const replicator = new (require("replicator"))();

export default function endGameAndEmitUpdates(lucellaServer: LucellaServer, game: BattleRoomGame) {
  const { io, lobby, games } = lucellaServer;
  const gameRoom = lobby.gameRooms[game.gameName];
  const gameChatChannelName = gameChannelNamePrefix + game.gameName;
  const { players } = gameRoom;

  gameRoom.gameStatus = GameStatus.ENDING;
  io.in(gameChatChannelName).emit(SocketEventsFromServer.CURRENT_GAME_STATUS_UPDATE, gameRoom.gameStatus);
  io.in(gameChatChannelName).emit(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, game.gameOverCountdown.current);
  game.clearPhysicsInterval();
  // @ todo - change this to a score only broadcast
  // io.to(gameChatChannelName).emit(SocketEventsFromServer.COMPRESSED_GAME_PACKET, replicator.encode(game)); // since we stop the physics/broadcast interval we need one last snapshot to show the winning point

  const loser = gameRoom.winner === players.host?.associatedUser.username ? players.challenger?.associatedUser.username : players.host?.associatedUser.username;

  let eloUpdates: EloUpdates | null = null;
  if (!gameRoom.winner || !loser) console.error("Tried to update game records but either winner or loser wasn't found");
  // else eloUpdates = await updateGameRecords(gameRoom.winner, loser, gameRoom, game, gameRoom.isRanked);
  io.in(gameChatChannelName).emit(SocketEventsFromServer.NAME_OF_GAME_WINNER, gameRoom.winner);

  game.gameOverCountdown.current = game.gameOverCountdown.duration;
  game.intervals.endingCountdown = setInterval(() => {
    game.gameOverCountdown.current! -= 1;
    io.to(gameChatChannelName).emit(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, game.gameOverCountdown.current);
    if (game.gameOverCountdown.current! >= 1) return;
    game.clearGameEndingCountdownInterval();

    io.in(gameChatChannelName).emit(SocketEventsFromServer.SHOW_END_SCREEN, {
      gameRoom,
      game: replicator.encode(new BattleRoomGame("test")), // todo - remove this placeholder
      eloUpdates,
    });

    let playerRole: keyof typeof gameRoom.players;
    for (playerRole in gameRoom.players) {
      const player = gameRoom.players[playerRole];
      if (!player) continue;
      lucellaServer.changeSocketChatChannelAndEmitUpdates(io.sockets.sockets.get(player.socketId!)!, player.previousChatChannelName || null);
      lucellaServer.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, player);
    }

    delete lobby.gameRooms[game.gameName];
    delete games[game.gameName];
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobby.getSanitizedGameRooms());
  }, 1000);
}
