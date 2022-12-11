import { rankedGameChannelNamePrefix, maxGameNameLength, ErrorMessages } from "../../../../common";

export default function validateGameName(gameName: string, isRanked?: Boolean) {
  if (gameName.length < 1) return ErrorMessages.GAME_NAME.MIN_LENGTH;
  if (gameName.length > maxGameNameLength) return ErrorMessages.GAME_NAME.MAX_LENGTH;
  if (gameName.slice(0, rankedGameChannelNamePrefix.length) === rankedGameChannelNamePrefix && !isRanked) return ErrorMessages.GAME_NAME.UNAUTHORIZED_RANKED;
}
