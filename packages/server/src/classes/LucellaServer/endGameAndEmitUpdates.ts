/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
import { BattleRoomGame, gameChannelNamePrefix, GameStatus, IBattleRoomGameRecord, ONE_SECOND, SocketEventsFromServer } from "../../../../common";
import { LucellaServer } from ".";
import updateScoreCardsAndSaveGameRecord from "../../battleRoomGame/endGameCleanup/updateScoreCardsAndSaveGameRecord";

export default async function endGameAndEmitUpdates(server: LucellaServer, game: BattleRoomGame) {
  const { io, lobby, games } = server;
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

  // eslint-disable-next-line prefer-const
  let gameRecord: IBattleRoomGameRecord | null = null;
  if (!gameRoom.winner || !loser) console.error("Tried to update game records but either winner or loser wasn't found");
  else gameRecord = await updateScoreCardsAndSaveGameRecord(gameRoom.winner, gameRoom, game, gameRoom.isRanked);
  // determineNewLadderRanks() not yet created
  io.in(gameChatChannelName).emit(SocketEventsFromServer.NAME_OF_GAME_WINNER, gameRoom.winner);

  game.gameOverCountdown.current = game.gameOverCountdown.duration;
  game.intervals.endingCountdown = setInterval(() => {
    game.gameOverCountdown.current! -= 1;
    io.to(gameChatChannelName).emit(SocketEventsFromServer.GAME_ENDING_COUNTDOWN_UPDATE, game.gameOverCountdown.current);
    if (game.gameOverCountdown.current! >= 1) return;
    game.clearGameEndingCountdownInterval();

    io.in(gameChatChannelName).emit(SocketEventsFromServer.SHOW_END_SCREEN, {
      gameRoom,
      gameRecord,
    });

    Object.values(gameRoom.players).forEach((player) => {
      if (!player) return;
      lobby.changeSocketChatChannelAndEmitUpdates(io.sockets.sockets.get(player.socketId!)!, player.previousChatChannelName || null);
      lobby.removeSocketMetaFromGameRoomAndEmitUpdates(gameRoom, player);
    });
    // this cleans out the names of any players that disconnected
    delete lobby.chatChannels[gameChatChannelName];

    delete lobby.gameRooms[game.gameName];
    delete games[game.gameName];
    io.sockets.emit(SocketEventsFromServer.GAME_ROOM_LIST_UPDATE, lobby.getSanitizedGameRooms());
  }, ONE_SECOND);
}
