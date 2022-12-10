import { gameChannelNamePrefix, rankedGameChannelNamePrefix } from "../../../../common";

export default function validateChannelName(name: string, authorizedForGameChannel?: boolean) {
  if (
    (name.slice(0, gameChannelNamePrefix.length) === rankedGameChannelNamePrefix ||
      name.slice(0, rankedGameChannelNamePrefix.length) === gameChannelNamePrefix) &&
    !authorizedForGameChannel
  )
    return `Channels prefixed with "${gameChannelNamePrefix}" or "${rankedGameChannelNamePrefix}" are reserved for that game's players`;
}
