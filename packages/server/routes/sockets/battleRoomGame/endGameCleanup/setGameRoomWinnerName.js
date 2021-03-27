module.exports = ({ gameRoom, gameData }) => {
  gameRoom.winner =
    gameData.winner === "host"
      ? gameRoom.players.host.username
      : gameRoom.players.challenger.username;
};
