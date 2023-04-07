import { PlayerRole } from "../../../common";

export const ARIA_LABELS = {
  CHAT: {
    CHANNEL_NAME_WITH_NUM_USERS: "chat channel name and number of users",
  },
  GAME_ROOM: {
    PLAYER_NAME: (playerRole: PlayerRole) => `${playerRole} name`,
    PLAYER_READY_STATUS: (playerRole: PlayerRole) => `${playerRole} ready status`,
    GAME_STATUS: "game status",
    GAME_START_COUNTDOWN: "game start countdown",
    WAITING_LIST_POSITION: "waiting list position",
  },
  GAME_LIST: {
    REFRESH_GAME_LIST: "refresh game list",
    JOIN_GAME_BY_NAME_OF: (gameName: string) => `join game ${gameName}`,
  },
  LADDER: {
    FETCHING_LADDER_ENTRIES: "fetching ladder entries",
    TABLE: "ladder entries",
    CURRENT_PAGE: "current page",
    NEXT_PAGE: "next page",
    PREVIOUS_PAGE: "previous page",
    SEARCH: "search for a ladder entry",
  },
  SCORE_SCREEN_MODAL: "game result",
};
