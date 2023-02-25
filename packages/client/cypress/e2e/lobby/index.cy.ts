import { TaskNames } from "../../support/TaskNames";
import authedUserHostAndStartGame from "./authedUserHostAndStartGame";
import chatAndChangeChannels from "./chatAndChangeChannels";
import startGameAndDisconnect from "./startGameAndDisconnect";
import unauthedJoinLeaveAndDisconnectFromGameRoom from "./unauthedJoinLeaveAndDisconnectFromGameRoom";

describe("lobby chat, hosting, joining and game start and end functionality", () => {
  beforeEach(() => cy.task(TaskNames.disconnectSocket));
  afterEach(() => cy.task(TaskNames.disconnectSocket));
  startGameAndDisconnect();
  authedUserHostAndStartGame();
  chatAndChangeChannels();
  unauthedJoinLeaveAndDisconnectFromGameRoom();
});
