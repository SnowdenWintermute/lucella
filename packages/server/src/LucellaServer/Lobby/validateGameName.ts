import { rankedGameChannelNamePrefix, maxGameNameLength, ErrorMessages } from "../../../../common";

// eslint-disable-next-line consistent-return
export default function validateGameName(gameName: string, isRanked?: Boolean) {
  if (gameName.length < 1) return ErrorMessages.LOBBY.GAME_NAME.MIN_LENGTH;
  if (gameName.length > maxGameNameLength) return ErrorMessages.LOBBY.GAME_NAME.MAX_LENGTH;
  if (gameName.slice(0, rankedGameChannelNamePrefix.length) === rankedGameChannelNamePrefix && !isRanked)
    return ErrorMessages.LOBBY.GAME_NAME.UNAUTHORIZED_RANKED;
}
