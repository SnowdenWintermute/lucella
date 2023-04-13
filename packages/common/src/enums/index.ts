export enum GameStatus {
  IN_LOBBY = "IN_LOBBY",
  COUNTING_DOWN = "COUNTING_DOWN",
  IN_PROGRESS = "IN_PROGRESS",
  IN_WAITING_LIST = "IN_WAITING_LIST",
  ENDING = "ENDING",
}

export enum PlayerRole {
  HOST = "host",
  CHALLENGER = "challenger",
}

export enum UserInputs {
  CLIENT_TICK_NUMBER,
  SELECT_ORBS,
  ASSIGN_ORB_DESTINATIONS,
  APPEND_WAYPOINT,
  SELECT_ORB_AND_ASSIGN_DESTINATION,
  SELECT_ORB_AND_APPEND_WAYPOINT,
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
