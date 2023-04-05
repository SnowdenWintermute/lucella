export const LOBBY_TEXT = {
  MATCHMAKING_QUEUE: {
    SEEKING_RANKED_MATCH: "Seeking ranked match...",
    RANKED_GAME_STARTING: "Ranked game starting...",
  },
  GAME_SETUP: {
    TITLE: "Creating an unranked game",
    GAME_CREATION_INPUT_LABEL: "Game name:",
  },
  GAME_ROOM: {
    GAME_NAME_HEADER: "Game: ",
    GAME_STATUS_WAITING_FOR_OPPONENT: "Waiting for an opponent",
    PLAYER_READY_STATUS: { READY: "ready", NOT_READY: "not ready" },
    SERVER_EXPERIENCING_HIGH_LOAD: "Server is experiencing high load, waiting for an open game slot.",
    POSITION_IN_WAITING_LIST: "Position in line: ",
  },
  SCORE_SCREEN: {
    TITLE: (gameName: string) => `Game ${gameName} result`,
    CASUAL_GAME_NO_RANK_CHANGE: "No changes to ladder rating",
  },
};
