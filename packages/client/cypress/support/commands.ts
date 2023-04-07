import "@testing-library/cypress/add-commands";
import { battleRoomDefaultChatChannel, SocketEventsFromClient } from "../../../common/dist";
import { BUTTON_NAMES } from "../../src/consts/button-names";
import { LOBBY_TEXT } from "../../src/consts/lobby-text";
import { TaskNames } from "./TaskNames";
Cypress.Commands.add("deleteAllTestUsersAndCreateOneTestUser", () => {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
  cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
    expect(response.status).to.equal(200);
  });
  cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
    expect(response.status).to.equal(201);
  });
});
Cypress.Commands.add("clickButton", (buttonName: string, force?: boolean) => {
  cy.findByRole("button", { name: buttonName }).click({ force: force || false });
});
Cypress.Commands.add("visitPageAndVerifyHeading", (url: string, heading: string) => {
  cy.visit(url);
  cy.findByRole("heading", { name: new RegExp(heading, "i") }).should("be.visible");
});
Cypress.Commands.add("clickLinkAndVerifyHeading", (link: string, heading: string) => {
  cy.findByRole("link", { name: new RegExp(link, "i") }).click();
  cy.findByRole("heading", { name: new RegExp(heading, "i") }).should("be.visible");
});
Cypress.Commands.add("verifyVeiwingMainMenu", () => {
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.CHANNEL }).should("be.visible");
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.RANKED }).should("be.visible");
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.HOST }).should("be.visible");
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.JOIN }).should("be.visible");
});
Cypress.Commands.add("openAndVerifyMenu", (menuButton: string, textToVerify: string) => {
  cy.findByRole("button", { name: menuButton }).click();
  cy.findByText(textToVerify).should("be.visible");
});
Cypress.Commands.add("hostCasualGame", (gameName: string) => {
  cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.HOST, LOBBY_TEXT.GAME_SETUP.TITLE);
  cy.findByLabelText(LOBBY_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`${gameName}{enter}`);
  cy.findByText(LOBBY_TEXT.GAME_ROOM.GAME_NAME_HEADER + gameName.toLowerCase()).should("be.visible");
});
Cypress.Commands.add("createAndLogInSequentialEloTestUsers", (numberToCreate: number, eloOfFirst: number, eloBetweenEach: number, testUsers: Object) => {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  cy.task(TaskNames.createSequentialEloTestUsers, { ...args, numberToCreate, eloOfFirst, eloBetweenEach }).then((response: { data: any; status: number }) => {
    expect(response.status).to.equal(201);
    Object.entries(response.data).forEach(([key, value]) => {
      console.log("KEY: ", key, "VALUE: ", value);
      // eslint-disable-next-line no-param-reassign
      testUsers[key] = value;
    });
    Object.entries(testUsers).forEach(([username, user]) => {
      // @ts-ignore
      cy.task(TaskNames.logUserIn, { name: username, email: user.email, password: Cypress.env("CYPRESS_TEST_USER_PASSWORD") }).then(() => {
        cy.task(TaskNames.connectSocket, { username, withHeaders: true }).then(() => {
          cy.task(TaskNames.socketEmit, {
            username,
            event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
            data: battleRoomDefaultChatChannel,
          });
        });
      });
    });
  });
});
