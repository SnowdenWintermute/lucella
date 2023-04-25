import { TaskNames } from "../../support/TaskNames";
import chat from "./chat";
import gameListMenu from "./gameListMenu";
import gameRoomGameConfig from "./gameRoomGameConfig";
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
  // beforeEach(() => ));
  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
  });

  chat();
  gameSetupMenu();
  gameRoomMenu();
  gameListMenu();
  gameRoomGameConfig();
  // matchmakingQueueMenu();
});
