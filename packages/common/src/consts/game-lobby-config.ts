import { ONE_SECOND } from ".";

export const baseGameStartCountdownDuration = 1; // 3
export const baseMaxConcurrentGames = 15; // 15
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

export const chatChannelWelcomeMessage = (channelName: string) => `Welcome to ${channelName}.`;

// for frontend chat selection buttons
export const defaultChatChannelNames = {
  BATTLE_ROOM_CHAT: "Battle Room Chat",
  LINDBLUM: "Lindblum",
  ALEXANDRIA: "Alexandria",
  BURMECIA: "Burmecia",
  TRENO: "Treno",
  LURKER_LOUNGE: "Lurker Lounge",
};

export const chatMessageMaxLength = 512;
export const chatChannelNameMaxLength = 64;
