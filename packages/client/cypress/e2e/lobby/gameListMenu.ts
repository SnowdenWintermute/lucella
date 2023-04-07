import { ERROR_MESSAGES, FrontendRoutes, gameChannelNamePrefix, SocketEventsFromClient } from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function gameListMenu() {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.deleteAllTestUsersAndCreateOneTestUser();
  });

  it("provides the functionality of the game list menu", () => {
    const arbitraryNameForAnonUserInCypressSocketList = "Anon1";
    const arbitraryNameForAnonUserInCypressSocketList2 = "Anon2";
    const arbitraryNameForAnonUserInCypressSocketList3 = "Anon3";
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();

    //  - pressing escape closes the game list menu and puts the user back in the main menu
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.JOIN, LOBBY_TEXT.GAME_LIST.TITLE);
    cy.get("body").trigger("keyup", { key: "Escape" });
    cy.verifyVeiwingMainMenu();
    //  - pressing back closes the menu
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.JOIN, LOBBY_TEXT.GAME_LIST.TITLE);
    cy.clickButton(BUTTON_NAMES.GAME_LIST.BACK);
    cy.verifyVeiwingMainMenu();
    //  - if no games are being hosted, show a message "no games found"
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.JOIN, LOBBY_TEXT.GAME_LIST.TITLE);
    cy.findByText(LOBBY_TEXT.GAME_LIST.NO_GAMES_FOUND).should("be.visible");
    //  - pressing the refresh button updates the game list
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.HOSTS_NEW_GAME,
      data: shortTestText,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.REFRESH_GAME_LIST).click();
    cy.findByText(LOBBY_TEXT.GAME_LIST.NO_GAMES_FOUND).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF(shortTestText)).should("be.visible");
    //  - clicking join on a full game (possible if haven't updated game list) shows "game is full" alert and updates game list
    //  - full games in the list have their join button disabled
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList2 });
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList3 });
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList2,
      event: SocketEventsFromClient.HOSTS_NEW_GAME,
      data: "a",
    });
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.REFRESH_GAME_LIST).click();
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList3,
      event: SocketEventsFromClient.JOINS_GAME,
      data: "a",
    });
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF("a")).click();
    cy.findByText(ERROR_MESSAGES.LOBBY.GAME_IS_FULL).should("be.visible");
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF("a")).should("be.disabled");
    //  - clicking join on a game with an open spot places user in game room menu
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList3,
      event: SocketEventsFromClient.LEAVES_GAME,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.REFRESH_GAME_LIST).click();
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF("a")).should("not.be.disabled");
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF("a")).click();
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", `${gameChannelNamePrefix}a`);
    cy.findByText(`${LOBBY_TEXT.GAME_ROOM.GAME_NAME_HEADER}a`).should("be.visible");
  });
}
