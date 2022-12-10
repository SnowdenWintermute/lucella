import chatAndChangeChannels from "./chatAndChangeChannels";
import unauthedJoinLeaveAndStartGames from "./unauthedJoinLeaveAndStartGames";

describe("lobby chat functionality", () => {
  afterEach(() => cy.task("disconnectSocket"));
  // chatAndChangeChannels();
  unauthedJoinLeaveAndStartGames();
});
