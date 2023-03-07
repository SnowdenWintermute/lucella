import { ONE_SECOND } from ".";

export const gameRoomCountdownDuration = 1;
export const theVoid = "the void";
export const gameChannelNamePrefix = "game-";
export const rankedGameChannelNamePrefix = "ranked-";
export const maxEloDiffThreshold = 3000;
export const eloDiffThresholdAdditive = 1000;
export const baseGameCreationWaitingListLoopIntervalLength = 3 * ONE_SECOND;
export const baseMatchmakingQueueIntervalLength = ONE_SECOND;
export enum OfficialChannels {
  matchmakingQueue = "matchmaking-queue",
}
export const maxGameNameLength = 20;

export const battleRoomDefaultChatChannel = "battle-room-chat";

// for frontend chat selection buttons
export const defaultChatChannelNames = {
  LINDBLUM: "Lindblum",
  ALEXANDRIA: "Alexandria",
  BURMECIA: "Burmecia",
  BATTLE_ROOM_CHAT: "Battle Room Chat",
  TRENO: "Treno",
  LURKER_LOUNGE: "Lurker Lounge",
};
