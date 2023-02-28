import { baseGameCreationWaitingListLoopInterval, baseMaxConcurrentGames } from "../../../common";

export default class LucellaServerConfig {
  maxConcurrentGames = baseMaxConcurrentGames;
  gameCreationWaitingListLoopInterval = baseGameCreationWaitingListLoopInterval;
}
