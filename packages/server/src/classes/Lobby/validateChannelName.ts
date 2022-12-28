/* eslint-disable consistent-return */
import { ErrorMessages, gameChannelNamePrefix, rankedGameChannelNamePrefix } from "../../../../common";

export default function validateChannelName(name: string, authorizedForGameChannel?: boolean) {
  if (
    (name.slice(0, gameChannelNamePrefix.length) === gameChannelNamePrefix ||
      name.slice(0, rankedGameChannelNamePrefix.length) === rankedGameChannelNamePrefix) &&
    !authorizedForGameChannel
  )
    return ErrorMessages.LOBBY.GAME_NAME.UNAUTHORIZED_CHANNEL_NAME;
}
