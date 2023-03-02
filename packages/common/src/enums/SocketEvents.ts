// @todo - change these to numbers
export enum SocketEventsFromClient {
  NEW_CHAT_MESSAGE = "0",
  CLICKS_READY = "1",
  REQUESTS_GAME_ROOM_LIST = "2",
  REQUESTS_TO_JOIN_CHAT_CHANNEL = "3",
  HOSTS_NEW_GAME = "4",
  LEAVES_GAME = "5",
  JOINS_GAME = "6",
  ENTERS_MATCHMAKING_QUEUE = "7",
  LEAVES_MATCHMAKING_QUEUE = "8",
  NEW_INPUT = "9",
  CURRENT_TICK_NUMBER = "10",
}

export enum SocketEventsFromServer {
  ERROR_MESSAGE = "11",
  AUTHENTICATION_COMPLETE = "12",
  NEW_CHAT_MESSAGE = "13",
  CHAT_CHANNEL_UPDATE = "14",
  GAME_ROOM_LIST_UPDATE = "15",
  CURRENT_GAME_ROOM_UPDATE = "16",
  GAME_CLOSED_BY_HOST = "17",
  PLAYER_READINESS_UPDATE = "18",
  PLAYER_ROLE_ASSIGNMENT = "19",
  CURRENT_GAME_STATUS_UPDATE = "20",
  CURRENT_GAME_COUNTDOWN_UPDATE = "21",
  SHOW_SCORE_SCREEN = "22",
  MATCHMAKING_QUEUE_ENTERED = "23",
  MATCHMAKING_QUEUE_UPDATE = "24",
  MATCH_FOUND = "25",
  GAME_INITIALIZATION = "26",
  GAME_PACKET = "27",
  COMPRESSED_GAME_PACKET = "28",
  GAME_ENDING_COUNTDOWN_UPDATE = "29",
  NAME_OF_GAME_WINNER = "30",
  GAME_CREATION_WAITING_LIST_POSITION = "31",
}

export const GENERIC_SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  PING: "ping",
  PONG: "pong",
};
