export enum ErrorMessages {
  SOCKET_NOT_REGISTERED = "Socket not registered. Server likely restarted, please refresh",
  GAME_EXISTS = "A game by that name already exists",
  GAME_DOES_NOT_EXIST = "No game by that name exists",
  CANT_LEAVE_GAME_THAT_DOES_NOT_EXIST = "Trying to leave a game that doesn't exist",
  CANT_LEAVE_GAME_IF_YOU_ARE_NOT_IN_ONE = "You can't leave a game if you are not in one",
  GAME_IS_FULL = "That game is currently full",
  CANT_PLAY_AGAINST_SELF = "You can not join a game hosted by yourself",
  CANT_HOST_IF_ALREADY_IN_GAME = "You can't host a game if you are already one",
  CANT_JOIN_IF_ALREADY_IN_GAME = "You can't join a game if you are already one",
  LOG_IN_TO_PLAY_RANKED = "Log in or create an account to play ranked games",
  CANT_JOIN_RANKED_GAME_IF_NOT_ASSIGNED = "You can't join a ranked game that the matchmaking didn't assign you to",
}
