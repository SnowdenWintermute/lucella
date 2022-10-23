export enum SocketEventsFromClient {
  NEW_CHAT_MESSAGE = "NEW_CHAT_MESSAGE",
  CLICKS_READY = "CLICKS_READY",
  REQUESTS_GAME_ROOM_LIST = "REQUESTS_GAME_ROOM_LIST",
  REQUESTS_TO_JOIN_CHAT_CHANNEL = "REQUESTS_TO_JOIN_CHAT_CHANNEL",
  HOSTS_NEW_GAME = "HOSTS_NEW_GAME",
  LEAVES_GAME = "LEAVES_GAME",
  JOINS_GAME = "JOINS_GAME",
  ENTERS_MATCHMAKING_QUEUE = "ENTERS_MATCHMAKING_QUEUE",
  LEAVES_MATCHMAKING_QUEUE = "LEAVES_MATCHMAKING_QUEUE",
  NEW_INPUT = "NEW_INPUT",
}

export enum SocketEventsFromServer {
  ERROR_MESSAGE = "ERROR_MESSAGE",
  AUTHENTICATION_COMPLETE = "AUTHENTICATION_COMPLETE",
  NEW_CHAT_MESSAGE = "NEW_CHAT_MESSAGE",
  CHAT_ROOM_UPDATE = "CHAT_ROOM_UPDATE",
  GAME_ROOM_LIST_UPDATE = "GAME_ROOM_LIST_UPDATE",
  CURRENT_GAME_ROOM_UPDATE = "CURRENT_GAME_ROOM_UPDATE",
  GAME_CLOSED_BY_HOST = "GAME_CLOSED_BY_HOST",
  PLAYER_READINESS_UPDATE = "PLAYER_READINESS_UPDATE",
  PLAYER_ROLE_ASSIGNMENT = "PLAYER_ROLE_ASSIGNMENT",
  CURRENT_GAME_STATUS_UPDATE = "CURRENT_GAME_STATUS_UPDATE",
  CURRENT_GAME_COUNTDOWN_UPDATE = "CURRENT_GAME_COUNTDOWN_UPDATE",
  SHOW_END_SCREEN = "SHOW_END_SCREEN",
  MATCHMAKING_QUEUE_ENTERED = "MATCHMAKING_QUEUE_ENTERED",
  MATCHMAKING_QUEUE_UPDATE = "MATCHMAKING_QUEUE_UPDATE",
  MATCH_FOUND = "MATCH_FOUND",
  GAME_INITIALIZATION = "GAME_INITIALIZATION",
  GAME_PACKET = "GAME_PACKET",
  COMPRESSED_GAME_PACKET = "COMPRESSED_GAME_PACKET",
  GAME_ENDING_COUNTDOWN_UPDATE = "GAME_ENDING_COUNTDOWN_UPDATE",
  NAME_OF_GAME_WINNER = "NAME_OF_GAME_WINNER",
}
