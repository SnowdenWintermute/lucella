export enum GameStatus {
  IN_LOBBY,
  COUNTING_DOWN,
  IN_PROGRESS,
  IN_WAITING_LIST,
  STARTING_NEXT_ROUND,
  ENDING,
}

export enum PlayerRole {
  HOST = "host",
  CHALLENGER = "challenger",
}

export enum BRPlayerActions {
  CLIENT_TICK_NUMBER,
  SELECT_ORBS,
  ASSIGN_DESTINATIONS_TO_SELECTED_ORBS,
  ASSIGN_DESTINATIONS_TO_ORBS,
  SELECT_ORB_AND_ASSIGN_DESTINATION,
  LINE_UP_ORBS_HORIZONTALLY_AT_Y,
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

export enum IPBanReason {
  RATE_LIMIT_ABUSE = "rate_limit_abuse",
  CHAT = "chat",
}

export enum GameType {
  BATTLE_ROOM,
  COMBAT_SIMULATOR,
}
