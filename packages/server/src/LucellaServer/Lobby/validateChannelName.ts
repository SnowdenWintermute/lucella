/* eslint-disable consistent-return */
import { chatChannelNameMaxLength, ERROR_MESSAGES, gameChannelNamePrefix, rankedGameChannelNamePrefix } from "../../../../common";

export default function validateChannelName(name: string, authorizedForGameChannel?: boolean) {
  if (
    (name.slice(0, gameChannelNamePrefix.length) === gameChannelNamePrefix ||
      name.slice(0, rankedGameChannelNamePrefix.length) === rankedGameChannelNamePrefix) &&
    !authorizedForGameChannel
  )
    return ERROR_MESSAGES.LOBBY.GAME_NAME.UNAUTHORIZED_CHANNEL_NAME;
  if (name.length > chatChannelNameMaxLength) return ERROR_MESSAGES.LOBBY.CHAT.CHANNEL_NAME_TOO_LONG;
}
