class GameRoom {
  constructor({ gameName, defaultCountdownNumber, isRanked }) {
    this.gameName = gameName;
    this.players = {
      host: null,
      challenger: null,
    };
    this.spectators = [];
    this.gameStatus = "inLobby"; // inLobby, countingDown, inProgress, gameOverScreen
    this.countdown = defaultCountdownNumber;
    this.countdownInterval = null;
    this.playersReady = { host: true, challenger: false };
    this.score = {
      host: 0,
      challenger: 0,
      neededToWin: 5,
    };
    this.winner = null;
    this.isRanked = isRanked ? isRanked : false;
  }
}
module.exports = GameRoom;
