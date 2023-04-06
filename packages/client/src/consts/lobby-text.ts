export const LOBBY_TEXT = {
  MATCHMAKING_QUEUE: {
    SEEKING_RANKED_MATCH: "Searching for ranked match...",
    NUM_PLAYERS_IN_QUEUE: "Number of players in queue: ",
    ELO_DIFF_THRESHOLD: "Current Elo difference threshold: ",
  },
  GAME_SETUP: {
    TITLE: "Creating an unranked game",
    GAME_CREATION_INPUT_LABEL: "Game name:",
  },
  GAME_ROOM: {
    GAME_NAME_HEADER: "Game: ",
    GAME_STATUS: {
      WAITING_FOR_OPPONENT: "Waiting for an opponent",
      WAITING_FOR_PLAYERS_TO_BE_READY: "Waiting for all players to be ready",
      GAME_STARTING: "Game starting",
      IN_WAITING_LIST: "Position in waiting list",
    },
    PLAYER_READY_STATUS: { READY: "ready", NOT_READY: "not ready" },
    SERVER_EXPERIENCING_HIGH_LOAD: "Server is experiencing high load, waiting for an open game slot.",
    POSITION_IN_WAITING_LIST: "Position in line: ",
  },
  GAME_LIST: {
    TITLE: "Current games",
    NO_GAMES_FOUND: "No games found",
  },
  SCORE_SCREEN: {
    TITLE: (gameName: string) => `Game ${gameName} result`,
    CASUAL_GAME_NO_RANK_CHANGE: "No changes to ladder rating",
  },
};
