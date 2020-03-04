class GameRoom {
  constructor(
    roomNumber,
    hostUid,
    gameName,
    defaultCountdownNumber,
    width,
    height
  ) {
    this.roomNumber = roomNumber;
    this.gameName = gameName;
    this.players = {
      hostUid: hostUid,
      challengerUid: null // uid
    };
    this.spectators = [];
    this.gameStatus = "inLobby"; // inLobby, countingDown, inProgress, gameOverScreen
    this.countdown = defaultCountdownNumber;
    this.endingStateCountdown = 2;
    this.width = width;
    this.height = height;
    this.speed = 4;
    this.orbRadius = 8;
    this.orbs = {
      hostOrbs: [],
      challengerOrbs: []
    };
    (this.playersReady = []), (this.messages = []); // {author: uid, msgText: String}
    this.score = {
      host: 0,
      challenger: 0,
      neededToWin: 5
    };
    this.winner = null;
    this.dashes = {
      host: {
        dashes: 3,
        recharging: false,
        cooldown: 3
      },
      challenger: {
        dashes: 3,
        recharging: false,
        cooldown: 3
      }
    };
    this.endzones = {
      host: {
        x: 0,
        y: 0,
        width: this.width,
        height: 60
      },
      challenger: {
        x: 0,
        y: this.height - 60,
        width: this.width,
        height: 60
      }
    };
  }
}
module.exports = GameRoom;
