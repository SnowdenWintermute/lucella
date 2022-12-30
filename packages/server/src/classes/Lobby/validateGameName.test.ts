import { ErrorMessages, maxGameNameLength } from "../../../../common";
import validateGameName from "./validateGameName";

describe("game name vadiation", () => {
  it("correctly validates a game name", () => {
    const tooShort = validateGameName("");
    expect(tooShort).toBe(ErrorMessages.LOBBY.GAME_NAME.MIN_LENGTH);
    let longGameName = "";
    for (let i = maxGameNameLength + 1; i > 0; i -= 1) longGameName = longGameName.concat("a");
    const tooLong = validateGameName(longGameName);
    expect(tooLong).toBe(ErrorMessages.LOBBY.GAME_NAME.MAX_LENGTH);
    const unauthedRanked = validateGameName("ranked-a");
    expect(unauthedRanked).toBe(ErrorMessages.LOBBY.GAME_NAME.UNAUTHORIZED_RANKED);
    const errorForValidGameName = validateGameName("a");
    expect(errorForValidGameName).toBeFalsy();
  });
});
