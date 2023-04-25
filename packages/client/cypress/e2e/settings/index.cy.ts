import { TaskNames } from "../../support/TaskNames";
import gameSettingsConfig from "./gameSettingsConfig";

describe("settings page", () => {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
    cy.task(TaskNames.deleteAllTestUsers, {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    });
  });
  // afterEach(() => cy.task(TaskNames.disconnectAllSockets));
  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
  });

  gameSettingsConfig();
});
