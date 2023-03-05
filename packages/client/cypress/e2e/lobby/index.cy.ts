import { TaskNames } from "../../support/TaskNames";
import authedUserHostAndStartGame from "./authedUserHostAndStartGame";
import chatAndChangeChannels from "./chatAndChangeChannels";
import startGameAndDisconnect from "./startGameAndDisconnect";
import unauthedJoinLeaveAndDisconnectFromGameRoom from "./unauthedJoinLeaveAndDisconnectFromGameRoom";
import waitingList from "./waitingList";

describe("lobby chat, hosting, joining and game start and end functionality", () => {
  beforeEach(() => cy.task(TaskNames.disconnectAllSockets));
  afterEach(() => cy.task(TaskNames.disconnectAllSockets));
  waitingList();
  // startGameAndDisconnect();
  // authedUserHostAndStartGame();
  // chatAndChangeChannels();
  // unauthedJoinLeaveAndDisconnectFromGameRoom();
});
