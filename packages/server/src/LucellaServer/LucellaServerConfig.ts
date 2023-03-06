import { baseGameCreationWaitingListLoopIntervalLength, baseMatchmakingQueueIntervalLength, baseMaxConcurrentGames } from "../../../common";

export default class LucellaServerConfig {
  maxConcurrentGames = baseMaxConcurrentGames;
  gameCreationWaitingListLoopIntervalLength = baseGameCreationWaitingListLoopIntervalLength;
  matchmakingQueueIntervalLength = baseMatchmakingQueueIntervalLength;
}
