import { ErrorMessages, gameRoomCountdownDuration, GameStatus, maxGameNameLength, SocketEventsFromClient } from "../../../../common";
import { veryLongTestText, shortTestText, mediumTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";
import authedUserHostAndStartGame from "./authedUserHostAndStartGame";
import chatAndChangeChannels from "./chatAndChangeChannels";
import unauthedJoinLeaveAndDisconnectFromGameRoom from "./unauthedJoinLeaveAndDisconnectFromGameRoom";

describe("lobby chat, hosting, joining and game start and end functionality", () => {
  afterEach(() => cy.task("disconnectSocket"));
  chatAndChangeChannels();
  unauthedJoinLeaveAndDisconnectFromGameRoom();
  authedUserHostAndStartGame();
});
