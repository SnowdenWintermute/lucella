export enum GameStatus {
  IN_LOBBY = "IN_LOBBY",
  COUNTING_DOWN = "COUNTING_DOWN",
  IN_PROGRESS = "IN_PROGRESS",
  GAME_OVER_SCREEN = "GAME_OVER_SCREEN",
  ENDING = "ENDING",
}

export enum PlayerRole {
  HOST = "host",
  CHALLENGER = "challenger",
}

export enum UserInputs {
  SELECT_ORBS = "SELECT_ORBS",
  MOVE_SELECTED_ORBS = "MOVE_SELECTED_ORBS",
  SELECT_AND_MOVE_ORB = "SELECT_AND_MOVE_ORB",
}
