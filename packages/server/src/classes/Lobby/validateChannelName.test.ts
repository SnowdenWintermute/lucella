import { ErrorMessages, gameChannelNamePrefix, rankedGameChannelNamePrefix } from "../../../../common";
import validateChannelName from "./validateChannelName";

describe("lobby chat channel name vadiators", () => {
  it("correctly validates a channel name", () => {
    const unauthorizedForGameValidationError = validateChannelName(`${gameChannelNamePrefix}a`);
    expect(unauthorizedForGameValidationError).toBe(ErrorMessages.LOBBY.GAME_NAME.UNAUTHORIZED_CHANNEL_NAME);
    const unauthorizedForRankedValidationError = validateChannelName(`${rankedGameChannelNamePrefix}a`);
    expect(unauthorizedForRankedValidationError).toBe(ErrorMessages.LOBBY.GAME_NAME.UNAUTHORIZED_CHANNEL_NAME);
    const error = validateChannelName(`${rankedGameChannelNamePrefix}a`, true);
    expect(error).toBeFalsy();
  });
});
