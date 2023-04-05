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
  },
  GAME_LIST: {
    REFRESH_GAME_LIST: "refresh game list",
    JOIN_GAME_BY_NAME_OF: (gameName: string) => `join game ${gameName}`,
  },
};
