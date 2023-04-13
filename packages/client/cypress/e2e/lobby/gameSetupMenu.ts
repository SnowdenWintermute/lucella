import { ERROR_MESSAGES, FrontendRoutes, SocketEventsFromClient } from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { APP_TEXT } from "../../../src/consts/app-text";
import { longTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function gameSetupMenu() {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.deleteAllTestUsersAndCreateOneTestUser();
  });

  it("correctly displays and provides functionality in the game setup menu", () => {
    const arbitraryNameForAnonUserInCypressSocketList = "Anon1234";
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList });

    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();
    //  - pressing host button opens menu
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.HOST, APP_TEXT.GAME_SETUP.TITLE);
    //  - pressing escape closes menu
    cy.get("body").trigger("keyup", { key: "Escape" });
    cy.verifyVeiwingMainMenu();
    //  - clicking back closes menu
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.HOST, APP_TEXT.GAME_SETUP.TITLE);
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_SETUP.CANCEL }).click();
    cy.verifyVeiwingMainMenu();
    //  - too short name (only empty is considered too short)
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.HOST, APP_TEXT.GAME_SETUP.TITLE);
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`{enter}`);
    cy.findByText(ERROR_MESSAGES.LOBBY.GAME_NAME.NOT_ENTERED).should("exist");
    //  - too long name
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`${longTestText}{enter}`);
    cy.findByText(ERROR_MESSAGES.LOBBY.GAME_NAME.MAX_LENGTH).should("exist");
    //  - duplicate name (other game by same name exists)
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.HOSTS_NEW_GAME,
      data: shortTestText,
    });
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`${shortTestText}{enter}`);
    cy.findByText(ERROR_MESSAGES.LOBBY.GAME_NAME.GAME_EXISTS).should("exist");
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.LEAVES_GAME,
    });
    //  - upon clicking create game with a valid game name, brings user to game room menu
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`${shortTestText}{enter}`);
    cy.findByText(APP_TEXT.GAME_ROOM.GAME_NAME_HEADER + shortTestText.toLowerCase()).should("be.visible");
  });
}
