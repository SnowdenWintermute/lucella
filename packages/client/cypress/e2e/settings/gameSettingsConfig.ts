import { AuthRoutePaths, BattleRoomGameOptions, ERROR_MESSAGES, FrontendRoutes, SocketEventsFromClient, SUCCESS_ALERTS } from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { APP_TEXT } from "../../../src/consts/app-text";
import { longTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";

export default function gameSettingsConfig() {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.deleteAllTestUsersAndCreateOneTestUser();
  });

  it("allows a user to select and save game settings in the settings page", () => {
    const defaultOptionValue = BattleRoomGameOptions.topSpeed.options[BattleRoomGameOptions.topSpeed.defaultIndex];
    const selectedOptionTitle = BattleRoomGameOptions.topSpeed.options[3].title;
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });

    // user can select game options from settings page
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.SETTINGS}`);
    cy.findByLabelText(BattleRoomGameOptions.topSpeed.readableTitle).should("be.visible");
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.topSpeed.readableTitle)).should(
      "contain.text",
      defaultOptionValue.title
    );
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).should("be.disabled");
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.SAVE }).should("be.disabled");
    cy.findByLabelText(BattleRoomGameOptions.topSpeed.readableTitle).findByLabelText(selectedOptionTitle).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.topSpeed.readableTitle)).should("contain.text", selectedOptionTitle);
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.SAVE }).should("not.be.disabled");
    cy.clickButton(BUTTON_NAMES.GAME_CONFIG.SAVE);
    cy.findByText(SUCCESS_ALERTS.SETTINGS.BATTLE_ROOM_GAME_SETTINGS_UPDATED).should("be.visible");
    // reset defaults works
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).should("not.be.disabled");
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.topSpeed.readableTitle)).should(
      "contain.text",
      defaultOptionValue.title
    );
    cy.findByText(SUCCESS_ALERTS.SETTINGS.BATTLE_ROOM_GAME_SETTINGS_RESET).should("be.visible");
    // saving actually persists
    cy.findByLabelText(BattleRoomGameOptions.topSpeed.readableTitle).findByLabelText(selectedOptionTitle).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.topSpeed.readableTitle)).should("contain.text", selectedOptionTitle);
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.SAVE }).should("not.be.disabled");
    cy.clickButton(BUTTON_NAMES.GAME_CONFIG.SAVE);
    cy.findByText(SUCCESS_ALERTS.SETTINGS.BATTLE_ROOM_GAME_SETTINGS_UPDATED).should("be.visible");
    cy.findByRole("link", { name: APP_TEXT.NAV.GAME }).click();
    cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).click();
    cy.findByRole("link", { name: APP_TEXT.USER_MENU.ITEMS.SETTINGS }).click();
    cy.findByLabelText(ARIA_LABELS.GAME_CONFIG.OPTION_CURRENT_VALUE(BattleRoomGameOptions.topSpeed.readableTitle)).should("contain.text", selectedOptionTitle);
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.SAVE }).should("be.disabled");
    cy.findByRole("button", { name: BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS }).should("not.be.disabled");
  });
}
