import {
  FrontendRoutes,
  baseGameStartCountdownDuration,
  ONE_SECOND,
  PlayerRole,
  SocketEventsFromClient,
  BattleRoomGameOptions,
  AuthRoutePaths,
  toKebabCase,
} from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { APP_TEXT } from "../../../src/consts/app-text";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { shortTestText, shortTestText2 } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function gameRoomGameConfig() {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.deleteAllTestUsersAndCreateOneTestUser();
  });

  it("provides the functionality of the game config screen in the game room menu", () => {
    const arbitraryNameForAnonUserInCypressSocketList = "Anon1234";
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList });
    const defaultOptionValue = BattleRoomGameOptions.acceleration.options[BattleRoomGameOptions.acceleration.defaultIndex];
    const selectedOptionTitle = BattleRoomGameOptions.acceleration.options[0].title;
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();

    // user can change values in a game they are hosting
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.HOST, APP_TEXT.GAME_SETUP.TITLE);
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`${shortTestText}{enter}`);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_SETTINGS).click();
    cy.findByLabelText(BattleRoomGameOptions.acceleration.readableTitle).should("be.visible");

    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      defaultOptionValue.title
    );
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).should("be.disabled");
    cy.findByLabelText(BattleRoomGameOptions.acceleration.readableTitle).findByLabelText(selectedOptionTitle).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      selectedOptionTitle
    );
    // reset defaults works
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).should("not.be.disabled");
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      defaultOptionValue.title
    );
    // editing an option should unready all players
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_SETTINGS).click();
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.JOINS_GAME,
      data: shortTestText,
    });
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.CLICKS_READY,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.CHALLENGER)).should("contain.text", APP_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_SETTINGS).click();
    cy.findByLabelText(BattleRoomGameOptions.acceleration.readableTitle).findByLabelText(selectedOptionTitle).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      selectedOptionTitle
    );
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_SETTINGS).click();
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.CHALLENGER)).should(
      "contain.text",
      APP_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY
    );
    // upon starting a new game, values from the last started game should appear the same
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.CLICKS_READY,
    });
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.wait(baseGameStartCountdownDuration * ONE_SECOND + ONE_SECOND);
    cy.get(`[data-cy="battle-room-canvas"]`).should("be.visible");
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.HOST, APP_TEXT.GAME_SETUP.TITLE);
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL)
      .focus()
      .clear()
      .type(`${toKebabCase(shortTestText2)}{enter}`);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_SETTINGS).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      selectedOptionTitle
    );
    cy.clickButton(BUTTON_NAMES.GENERIC_NAV.BACK);
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.LEAVE_GAME);
    // in a game the user is not hosting, they can see options being updated but not be able to edit them
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.HOSTS_NEW_GAME,
      data: toKebabCase(shortTestText2),
    });
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.JOIN, APP_TEXT.GAME_LIST.TITLE);
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF(toKebabCase(shortTestText2))).click();
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_SETTINGS).click();
    cy.findByLabelText(BattleRoomGameOptions.acceleration.readableTitle).findByLabelText(selectedOptionTitle).should("be.disabled");
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      defaultOptionValue.title
    );
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST,
      data: { acceleration: 0 },
    });
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.acceleration.readableTitle)).should(
      "contain.text",
      selectedOptionTitle
    );
  });
}
