import { rankedGameChannelNamePrefix } from "@lucella/common";

export default function validateGameName(gameName: string, isRanked?: Boolean) {
  const maxGameNameLength = 20;
  if (gameName.length < 1) return "Game name must be at least one character long";
  if (gameName.length > maxGameNameLength) return `Game name must be fewer than ${maxGameNameLength} characters`;
  if (gameName.slice(0, rankedGameChannelNamePrefix.length) === rankedGameChannelNamePrefix && !isRanked)
    return console.log(`Game name can only start with "${rankedGameChannelNamePrefix}" if it is a ranked game`);
}
