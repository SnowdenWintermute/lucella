import { FrontendRoutes } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";
import chatAndChangeChannels from "./chatAndChangeChannels";
import gameListMenu from "./gameListMenu";
import gameRoomMenu from "./gameRoomMenu";
import gameSetupMenu from "./gameSetupMenu";
import matchmakingQueueMenu from "./matchmakingQueueMenu";

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
  // gameSetupMenu();
  // gameRoomMenu();
  // gameListMenu();
  matchmakingQueueMenu();
  // startGameAndDisconnect();
  // authedUserHostAndStartGame();
  // chatAndChangeChannels();
  // unauthedJoinLeaveAndDisconnectFromGameRoom();
});
