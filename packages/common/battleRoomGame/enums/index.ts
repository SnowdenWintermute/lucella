export enum GameStatus {
  IN_LOBBY = "IN_LOBBY",
  COUNTING_DOWN = "COUNTING_DOWN",
  IN_PROGRESS = "IN_PROGRESS",
  GAME_OVER_SCREEN = "GAME_OVER_SCREEN",
  ENDING = "ENDING",
}

export enum PlayerRole {
  host = "host",
  challenger = "challenger",
}

export enum GameEvents {
  ORB_MOVE = "ORB_MOVE",
  ORB_SELECT = "ORB_SELECT",
  ORB_COLLISION = "ORB_COLLISION",
  ORB_ENTERS_ENDZONE = "ORB_ENTERS_ENDZONE",
}
