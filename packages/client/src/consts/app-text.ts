export const APP_TEXT = {
  NAV: {
    GAME: "Game",
    LADDER: "Ladder",
  },
  MATCHMAKING_QUEUE: {
    SEEKING_RANKED_MATCH: "Searching for ranked match...",
    NUM_PLAYERS_IN_QUEUE: "Number of players in queue: ",
    ELO_DIFF_THRESHOLD: "Current Elo difference threshold: ",
  },
  MAIN_MENU: {
    CHANNEL_MODAL_INPUT_LABEL: "Channel name:",
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
  },
  GAME_LIST: {
    TITLE: "Current games",
    NO_GAMES_FOUND: "No games found",
  },
  SCORE_SCREEN: {
    TITLE: (gameName: string) => `Game ${gameName} result`,
    CASUAL_GAME_NO_RANK_CHANGE: "No changes to ladder rating",
  },
  CHAT: {
    INPUT_PLACEHOLDER: "Enter a message to chat...",
    AUTHOR_MESSAGE_DELIMITER: " : ",
  },
  USER_MENU: {
    LOGIN: "LOGIN",
    ITEMS: {
      SETTINGS: "Settings",
      LOGOUT: "Logout",
    },
  },
  LADDER: {
    PAGE_NUMBER_PREFIX: "Page ",
  },
  SETTINGS: {
    TITLE: "Settings",
    CHANGE_PASSWORD: "Change Password",
    DELETE_ACCOUNT: "Delete Account",
  },
  AUTH: {
    PAGE_TITLES: {
      REGISTER: "Create Account",
      LOGIN: "Login",
      CHANGE_PASSWORD: "Change Password",
      ACCOUNT_ACTIVATION: "Account Activation",
    },
    INPUTS: {
      EMAIL_ADDRESS: "Email Address",
      USERNAME: "Username",
      PASSWORD: "Password",
      CONFIRM_PASSWORD: "Confirm Password",
      PASSWORD_RESET_REQUEST_EMAIL: "Enter your email to request a password reset.",
    },
    LINKS: {
      RESET_PASSWORD: "Reset password",
      CREATE_ACCOUNT: "Create account",
      LOG_IN: "Log in to existing account",
    },
  },
};
