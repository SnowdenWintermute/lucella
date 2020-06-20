class GameRoom {
  constructor({ gameName, defaultCountdownNumber }) {
    this.gameName = gameName;
    this.players = {
      host: null,
      challenger: null,
    };
    this.spectators = [];
    this.gameStatus = "inLobby"; // inLobby, countingDown, inProgress, gameOverScreen
    this.countdown = defaultCountdownNumber;
    this.playersReady = { host: false, challenger: false };
    this.score = {
      host: 0,
      challenger: 0,
      neededToWin: 5,
    };
    this.winner = null;
  }
}
module.exports = GameRoom;
