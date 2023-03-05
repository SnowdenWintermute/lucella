import { TaskNames } from "../../support/TaskNames";
import authedUserHostAndStartGame from "./authedUserHostAndStartGame";
import chatAndChangeChannels from "./chatAndChangeChannels";
import startGameAndDisconnect from "./startGameAndDisconnect";
import unauthedJoinLeaveAndDisconnectFromGameRoom from "./unauthedJoinLeaveAndDisconnectFromGameRoom";
import waitingListInCasualGameRoom from "./waitingListInCasualGameRoom";
import waitingListInMatchmaking from "./waitingListInMatchmaking";

describe("lobby chat, hosting, joining and game start and end functionality", () => {
  afterEach(() => cy.task(TaskNames.disconnectAllSockets));
  // startGameAndDisconnect();
  // authedUserHostAndStartGame();
  // chatAndChangeChannels();
  // unauthedJoinLeaveAndDisconnectFromGameRoom();
  // waitingListInCasualGameRoom();
  waitingListInMatchmaking();
});
