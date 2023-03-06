import { TaskNames } from "../../support/TaskNames";
import authedUserHostAndStartGame from "./authedUserHostAndStartGame";
import chatAndChangeChannels from "./chatAndChangeChannels";
import startGameAndDisconnect from "./startGameAndDisconnect";
import unauthedJoinLeaveAndDisconnectFromGameRoom from "./unauthedJoinLeaveAndDisconnectFromGameRoom";

describe("lobby chat, hosting, joining and game start and end functionality", () => {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
    cy.task(TaskNames.deleteAllTestUsers, {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    });
  });
  afterEach(() => cy.task(TaskNames.disconnectAllSockets));
  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
  });
  startGameAndDisconnect();
  authedUserHostAndStartGame();
  chatAndChangeChannels();
  unauthedJoinLeaveAndDisconnectFromGameRoom();
});
